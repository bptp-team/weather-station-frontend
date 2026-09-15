# syntax=docker/dockerfile:1

# Build
FROM node:22.23.2-trixie-slim AS build

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Package manager
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && corepack install

# Dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Source
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src

# Compile
ARG VITE_WEATHER_API_URL=""
RUN pnpm run build

# Runtime
FROM nginx:1.30.4-alpine-slim AS runtime

# User
RUN addgroup -S -g 10001 app \
 && adduser -S -D -H -u 10001 -G app -h /nonexistent -s /sbin/nologin app \
 && rm -rf /etc/nginx/conf.d /docker-entrypoint.d /docker-entrypoint.sh /usr/share/nginx/html/*

# Server configuration
COPY --chown=0:0 --chmod=0644 docker/nginx.conf /etc/nginx/nginx.conf

# Artifact
COPY --from=build --chown=0:0 --chmod=u=rwX,go=rX /app/dist/ /usr/share/nginx/html/

USER 10001:10001

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]

STOPSIGNAL SIGQUIT

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
