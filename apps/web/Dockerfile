FROM oven/bun:1.3-alpine AS base
WORKDIR /usr/src/app

FROM base AS final

ENV PORT=8080
ENV NODE_ENV=production

COPY . .
RUN bun install && bun run build --filter '@vex/web'

USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "--cwd", "apps/web/build", "index.html" ]
