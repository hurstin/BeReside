# BeReside Hotel Management System

BeReside is a modern, production-ready full-stack hotel management and booking platform. It features a beautifully designed **Next.js** frontend and a robust **NestJS** backend, powered by a **PostgreSQL** database. 

The application handles the entire lifecycle of a hotel stay, from room discovery and secure credit card payments (via Stripe) to automated transactional emails and role-based staff operations.

---

## 🚀 Key Features

### 1. Booking & E-Commerce (Stripe Integration)
- **Live Inventory**: Real-time room availability checks preventing double-booking overlaps.
- **Secure Checkout**: Seamless credit card processing utilizing Stripe Checkout Sessions.
- **Asynchronous Fulfillment**: Cryptographically verified Stripe Webhooks automatically finalize bookings when payments succeed.

### 2. Transactional Emails (Nodemailer & Mailtrap)
- **Automated Receipts**: Customers receive HTML-formatted email receipts with their check-in details upon successful payment.
- **Magic Links**: Guests can request secure, time-limited magic links to view or manage their bookings without a traditional password.
- **Cancellation Notices**: Automated breakdown of cancellation penalties and refund amounts.

### 3. Role-Based Access Control (RBAC)
- **Multi-Tiered Roles**: Distinct permissions for `guest`, `staff`, and `admin`.
- **Admin Dashboard**: Real-time hotel statistics (revenue, occupancy rates, user counts).
- **Staff Operations**: Staff members have global visibility and can manually override booking states (e.g., checking guests in/out).
- **Automated Seeding**: System automatically seeds default Admin accounts and Room inventory on initial startup.

### 4. Background Jobs & Automation
- **Cron Jobs**: Scheduled tasks (`@nestjs/schedule`) continuously monitor for expired pending bookings, automatically releasing unpaid room holds after 10 minutes.
- **Dynamic State Machines**: Rooms autonomously shift between `available`, `booked`, `occupied`, and `maintenance` based on booking timelines.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **Styling**: Tailwind CSS & Lucide Icons
- **Language**: TypeScript

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **Payments**: Stripe Checkout & Webhooks
- **Email**: Nodemailer
- **Language**: TypeScript

### DevOps & Infrastructure
- **Hosting**: Fully deployed on [Render](https://render.com/) (Infrastructure as Code via `render.yaml`)
- **Containerization**: Multi-stage Docker builds optimized for Next.js and NestJS production environments.
- **CI/CD**: GitHub integrations for automated deployments.

---

## 📸 Architecture & Workflow

1. **User Flow**: A guest browses available rooms on the Next.js frontend and selects dates. 
2. **Hold Creation**: The NestJS backend creates a `pending` booking, reserving the dates for 10 minutes.
3. **Payment**: The guest is redirected to a hosted Stripe Checkout page.
4. **Webhook Processing**: Stripe securely pings the NestJS webhook endpoint, which verifies the signature, marks the booking as `paid`, and triggers the Mail Service.
5. **Confirmation**: The Mail Service dispatches a styled HTML receipt to the guest via SMTP.

---

## 🐳 Running Locally (Docker Compose)

The entire full-stack application (Frontend, Backend, and Database) is containerized and can be spun up with a single command.

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for testing webhooks locally)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hurstin/BeReside.git
   cd BeReside
   ```

2. **Environment Configuration:**
   Copy the example environment file and fill in your Stripe and SMTP credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start the Application:**
   Spin up all services:
   ```bash
   docker compose up --build
   ```
   - **Frontend**: Available at `http://localhost:3000`
   - **Backend API**: Available at `http://localhost:3000/api` (Swagger Docs)
   - **Database**: Port 5432

### Testing Stripe Webhooks Locally

Since Stripe cannot reach `localhost` directly, use the Stripe CLI to forward events to your local container:

```bash
# Login to Stripe CLI
stripe login

# Forward webhook events to the NestJS API
stripe listen --forward-to localhost:3000/payments/webhook
```

---

## 🚀 Production Deployment (Render)

This project includes a `render.yaml` file for Blueprint deployments on Render. It defines a PostgreSQL database, a Node web service for the Backend API, and a Docker-based web service for the Next.js Frontend.

### Required Production Environment Variables
When deploying, ensure the following variables are set securely in your hosting dashboard:

**Backend Environment:**
- `DATABASE_URL` (Auto-provided by Render Postgres)
- `STRIPE_SECRET_KEY` (Your live/test Stripe Secret)
- `STRIPE_WEBHOOK_SECRET` (Your live Stripe Webhook Signing Secret)
- `FRONTEND_URL` (e.g., `https://bereside-frontend.onrender.com`)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM_ADDRESS` (SMTP Credentials)

**Frontend Environment:**
- `NEXT_PUBLIC_API_URL` (e.g., `https://bereside-api.onrender.com`)

*Note on Next.js Deployments: Next.js evaluates `NEXT_PUBLIC_` variables at build time. The included frontend `Dockerfile` explicitly pulls `NEXT_PUBLIC_API_URL` into the build arguments (`ARG`) to ensure the client-side bundle is compiled with the correct live API endpoint.*

---

## 📖 API Documentation (Swagger)

The backend is fully documented using Swagger OpenAPI. 

Once running, navigate to **[http://localhost:3000/api](http://localhost:3000/api)** to view the interactive documentation. It visually renders all request and response schemas, DTO validations, and allows for direct endpoint testing via JWT authorization.
