# syntax=docker/dockerfile:1-labs
FROM oven/bun:1.3-alpine AS base
WORKDIR /home/bun/app


FROM base AS install

ARG WORKSPACE_TARGET

RUN mkdir -p /temp/dev /temp/prod

COPY package.json bun.lock /temp/dev/
COPY --parents */*/package.json /temp/dev/

COPY package.json bun.lock /temp/prod/
COPY --parents */*/package.json /temp/prod/

RUN bun install --cwd /temp/dev --frozen-lockfile \
  && bun install --cwd /temp/prod --frozen-lockfile --filter "@vex/${WORKSPACE_TARGET}" --production


FROM base AS build

ARG WORKSPACE_TARGET

COPY --from=install /temp/dev ./
COPY --parents turbo.json apps/* ./
RUN bun run build --filter "@vex/${WORKSPACE_TARGET}"


FROM base AS release

ARG WORKSPACE_TARGET
ENV WORKSPACE_TARGET=${WORKSPACE_TARGET}

ARG ENTRYPOINT_CMD
ENV ENTRYPOINT_CMD=${ENTRYPOINT_CMD}

COPY --from=install /temp/prod ./
COPY --from=build "/home/bun/app/apps/${WORKSPACE_TARGET}/build" "./apps/${WORKSPACE_TARGET}/build/"
COPY --chmod=0755 "apps/${WORKSPACE_TARGET}/scripts/init.sh" .

RUN ./init.sh

USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "sh", "-c", "$ENTRYPOINT_CMD" ]
