FROM oven/bun:1.1-debian

# Install Python, ffmpeg (includes ffprobe), and git
# We use --no-install-recommends to keep the build small and fast
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node modules
COPY package.json bun.lock ./
RUN bun install

# Copy Prisma schema and generate the client BEFORE building
COPY prisma ./prisma
RUN bunx prisma generate

# Copy the rest of the app
COPY . .

# Install Python deps
RUN pip3 install faster-whisper yt-dlp --break-system-packages

# Give Next.js more memory so the build doesn't crash
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the app
RUN bun run build

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start the app
CMD ["sh", "-c", "bun run db:push && bunx next start -p 3000"]
