FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY prisma ./prisma/

# Copy workspace package files
COPY apps/server/package*.json ./apps/server/

# Copy shared packages if they exist (generic catch-all)
COPY packages ./packages

# Install dependencies (from root)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (from root or specific workspace? Usually root for monorepos if shared, or app specific)
# Assuming prisma is in apps/server based on previous file steps (wait, prisma was in apps/server/prisma)
# But my COPY command above copied local prisma.
# Let's verify prisma path. It is likely apps/server/src/prisma or apps/server/prisma.
# Step 5261 showed apps/server/prisma.

WORKDIR /app/apps/server
RUN npx prisma generate

WORKDIR /app
# Build the server
RUN npm run build --workspace=apps/server

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package*.json ./
COPY --from=builder /app/apps/server/prisma ./prisma

EXPOSE 4000

# We need to run inside the workspace or just use node dist/main
CMD [ "node", "dist/main" ]
