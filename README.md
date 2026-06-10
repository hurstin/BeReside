# BeReside Hotel Booking API

BeReside is a modern, full-stack hotel management and booking API built with **NestJS**, **TypeORM**, and **PostgreSQL**. It features robust role-based access control, automated booking state management, and seamless payment processing via **Stripe**.

---

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure login and registration.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `guest`, `staff`, and `admin` roles.
- **Account Management**: Profile updates, secure password hashing (bcrypt), and password reset functionality.
- **Soft Deletion**: Admins can soft-delete users to maintain historical booking records.

### Room & Booking Management
- **Room Seeding**: Pre-configured automated database seeder for initial hotel room inventory.
- **Overlap Prevention**: Intelligent booking system that prevents double-booking of rooms for overlapping dates.
- **Dynamic Room States**: Rooms dynamically shift from `available` to `booked`, `occupied`, or `maintenance` based on booking lifecycles.
- **Automated Tasks**: Scheduled cron jobs (`@nestjs/schedule`) continuously monitor for expired pending bookings and automatically release unpaid holds after a 10-minute window.

### Financials & Payments
- **Stripe Checkout**: Integrated with Stripe for secure credit card processing.
- **Webhook Handlers**: Cryptographically verified webhook listeners process asynchronous payment confirmations to automatically confirm bookings.

### Admin Dashboard & Operations
- **Dashboard Metrics**: Admins can query real-time statistics including total revenue, occupancy rates, user counts, and booking volumes.
- **Staff Operations**: Staff members have full visibility over all bookings and can manually override states (e.g., checking guests in/out).

---

## 🛠️ Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **Payments**: Stripe Checkout & Webhooks
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest (Comprehensive unit test suites)

---

## 🐳 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Node.js & npm (for local development)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for testing webhooks locally)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hurstin/BeReside.git
   cd BeReside
   ```

2. **Environment Variables:**
   Ensure your `.env` file is configured with your Stripe API keys and database credentials.

3. **Start the Application:**
   Spin up the API and the PostgreSQL database using Docker Compose:
   ```bash
   docker compose up --build
   ```
   *The application will be available at `http://localhost:3000`.*

### Testing Webhooks Locally

Since Stripe cannot reach `localhost` directly, use the Stripe CLI to forward events to your local container:

```bash
# Login to Stripe CLI
stripe login

# Forward webhook events to the NestJS API
stripe listen --forward-to localhost:3000/payments/webhook
```

---

## 🧪 Testing

The project maintains a comprehensive unit testing suite covering services, controllers, and database mocking.

To run the test suites:
```bash
# Run unit tests
npm run test

# Run tests with coverage report
npm run test:cov
```

## 📖 API Documentation (Swagger)

The BeReside API is fully documented using Swagger OpenAPI. 

Once the application is running, you can access the interactive API documentation interface by navigating your browser to:
**[http://localhost:3000/api](http://localhost:3000/api)**

### Using the Swagger UI
- **Interactive Testing**: You can test endpoints directly from the browser.
- **Authentication**: To test protected routes, click the **Authorize** button at the top right of the Swagger UI and paste your JWT token (which you can acquire by hitting the `/auth/login` endpoint). 
- **Schema Validation**: All request and response schemas, including exact data types and validations, are visually rendered for the frontend teams.

---

## 📡 API Interaction (`request.http`)

The project includes a `request.http` file at the root directory. This file serves as an executable collection of API requests. If you are using an editor like VS Code (with the REST Client extension) or WebStorm, you can directly execute these requests to test the API endpoints without needing tools like Postman.

It includes templates for:
- Registering and authenticating users.
- Querying and booking rooms.
- Admin dashboard access and user role promotions. 

*(Make sure to update the `<replace-with-access-token>` placeholders with actual JWTs obtained from the login endpoint).*
