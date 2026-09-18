FROM node:22.23.2-trixie-slim AS build

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && corepack install

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY index.html vite.config.ts tsconfig*.json ./
COPY src ./src

ARG VITE_WEATHER_API_URL=""
RUN pnpm run build

FROM nginx:1.30.4-alpine-slim AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY --chmod=0644 nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]

ENTRYPOINT ["nginx", "-g", "daemon off;"]
