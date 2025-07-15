# ---- Stage 1: build ---------------------------------------------------------
# Use an Alpine-based image to keep the final size minimal.
FROM node:20-alpine AS builder

# Accept database URL at build time for Prisma and Next.js static generation
ARG DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5434/pelicanbay?schema=public"
ENV DATABASE_URL=${DATABASE_URL}

# Enable PNPM via corepack (comes with Node 20)
RUN corepack enable && corepack prepare pnpm@9.1.1 --activate

# Create app directory
WORKDIR /app

# Copy lock-files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies) for the build
RUN pnpm install --frozen-lockfile

# Copy everything else and build the Next.js application
COPY . .

# Generate the production build – this outputs to the .next directory
# Generate Prisma client (needed for type-check during Next.js build)
RUN pnpm exec prisma generate && pnpm exec prisma migrate deploy && pnpm build

# ---- Stage 2: production runtime -------------------------------------------
FROM node:20-alpine AS runner

ENV NODE_ENV=production

# Enable PNPM again in the runtime stage
RUN corepack enable && corepack prepare pnpm@9.1.1 --activate

WORKDIR /app

# Copy only the files needed to run the app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Next.js requires these config files at runtime if they exist
COPY --from=builder /app/next.config.js /app/next.config.js
COPY --from=builder /app/next.config.ts /app/next.config.ts
# Prisma schema & migrations (if the container runs migrations)
COPY --from=builder /app/prisma ./prisma

# Install production-only dependencies
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Expose the port that Next.js will run on
EXPOSE 3000

# Start the server
CMD ["pnpm", "start"]
