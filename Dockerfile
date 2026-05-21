FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Use the RUNTIME database URL for prisma generate so the binary matches
ENV DATABASE_URL="file:/data/openhorn.db"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXTAUTH_SECRET="openhorn-secret-key-production-2026"
ENV NEXTAUTH_URL="https://openhorn.fly.dev"
ENV AUTH_SECRET="openhorn-secret-key-production-2026"

RUN npx prisma generate
RUN npm run build

# Copy static assets into standalone dir (required for standalone mode)
RUN cp -r .next/static .next/standalone/.next/static
RUN if [ -d "public" ]; then cp -r public .next/standalone/public; fi

# Startup: push schema + seed + start
RUN printf '#!/bin/sh\nset -e\nexport DATABASE_URL="file:/data/openhorn.db"\nnpx prisma db push --skip-generate --accept-data-loss 2>/dev/null || true\nif [ ! -f /data/.seeded_v3 ]; then\n  echo "Seeding database..."\n  npx tsx prisma/seed.ts 2>/dev/null && touch /data/.seeded_v3\n  echo "Seeding complete"\nfi\necho "Starting Next.js..."\nnode .next/standalone/server.js\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["/bin/sh", "/app/start.sh"]
