# Stage 1: Build
FROM node:20 as builder

# Install MySQL client for migrations
RUN apk add --no-cache mysql-client

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20

WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma/

# Environment variables
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]