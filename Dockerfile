# ==============================================================================
# Stage 1: Build the NestJS application
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package manifests for robust caching of dependency layer
COPY package*.json ./

# Install all dependencies including devDependencies (needed for nest build)
RUN npm ci

# Copy the remaining project files
COPY . .

# Build the TypeScript compilation distribution
RUN npm run build

# ==============================================================================
# Stage 2: Production execution environment
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# Copy package manifests
COPY package*.json ./

# Install only production-needed packages to keep container light
RUN npm ci --omit=dev

# Copy compilation artifacts from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Standard port definition
ENV PORT=3000
EXPOSE 3000

# Execute compiled JavaScript binary entrypoint
CMD ["node", "dist/main"]
