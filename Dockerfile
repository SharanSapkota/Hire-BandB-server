# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npm ci

# Generate Prisma client and build TypeScript -> JavaScript
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy build artifacts and Prisma schema
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

# Copy Prisma generated client from the builder layer
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]

