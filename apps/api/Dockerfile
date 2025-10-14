# syntax=docker/dockerfile:1-labs
FROM oven/bun:1.3-alpine AS base
WORKDIR /home/bun/app


FROM base AS install
RUN mkdir -p /temp/dev /temp/prod

COPY package.json bun.lock /temp/dev/
COPY --parents */*/package.json /temp/dev/

COPY package.json bun.lock /temp/prod/
COPY --parents */*/package.json /temp/prod/

RUN bun install --cwd /temp/dev --frozen-lockfile \
  && bun install --cwd /temp/prod --frozen-lockfile --filter '@vex/api' --production


FROM base AS build
RUN mkdir -p /temp/build

COPY --from=install /temp/dev ./
COPY --parents turbo.json apps/api ./
RUN bun run build --filter '@vex/api'


FROM base AS release

COPY --from=install /temp/prod ./
COPY --from=build /home/bun/app/apps/api/build ./apps/api/build/

USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "run", "--cwd", "apps/api", "build/main.js" ]
