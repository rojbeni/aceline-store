# --- STAGE 1: Build ---
FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable && apk add --no-cache libc6-compat

WORKDIR /app

# Declare build arguments with default values
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_5f303b02910aea86dc6841f489df2361b4f64069e00348195093d9a15021f0c6"
ARG NEXT_PUBLIC_DEFAULT_REGION="fr"
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL="https://aceline.online"
ARG NEXT_PUBLIC_BASE_URL="https://store.aceline.online"
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Make them available as environment variables during build time
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID

# Copy lockfile and manifest first so dependency install is cached separately from source changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Mount the pnpm store cache so it doesn't redownload every time
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

RUN pnpm build

# --- STAGE 2: Runner ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

# Required by check-env-variables.js, which next.config.js runs again on `next start`
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

# Copy application files and node_modules from builder
COPY --from=builder /app /app

# Expose storefront port
EXPOSE 8000
# Start storefront application
CMD ["npm", "run", "start"]