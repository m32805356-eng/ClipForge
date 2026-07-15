# ─────────────────────────────────────────────────────────────
# ClipForge — Dockerfile
# Multi-stage build that installs Bun, Python, faster-whisper,
# yt-dlp, and FFmpeg, then runs the Next.js production server.
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Base image with all system dependencies ──────────
FROM node:20-slim AS base

# Install system packages: FFmpeg, ffprobe, Python 3, build tools, git
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ffprobe \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

# Create a Python venv and install faster-whisper + yt-dlp
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:${PATH}"
RUN /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir \
    faster-whisper==1.2.1 \
    yt-dlp==2026.7.4

# ── Stage 2: Install Node dependencies ────────────────────────
FROM base AS deps

WORKDIR /app

# Copy package files for dependency caching
COPY package.json bun.lock* ./
COPY prisma ./prisma

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Generate Prisma client
RUN bun run db:generate || npx prisma generate

# ── Stage 3: Build the app ────────────────────────────────────
FROM deps AS builder

WORKDIR /app

# Copy all source code
COPY . .

# Copy the generated prisma client from deps stage
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ── Stage 4: Production runner ────────────────────────────────
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create directories for uploads, outputs, models, db
RUN mkdir -p /app/uploads /app/outputs /app/models /app/db

# Copy the standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema + DB (for db:push on startup)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db

# Copy Python scripts
COPY --from=builder /app/scripts ./scripts

# Copy .env
COPY .env .env

# Ensure the venv Python is the default python3 (so subprocess calls find faster-whisper)
RUN ln -sf /opt/venv/bin/python3 /usr/local/bin/python3

# Expose the port
EXPOSE 3000

# Startup script: push DB schema, then start the server
CMD ["sh", "-c", "bun run db:push --accept-data-loss 2>/dev/null; node server.js"]
