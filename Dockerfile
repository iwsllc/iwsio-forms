# check=skip=CopyIgnoredFile
# syntax=docker/dockerfile:1-labs
FROM node:26-alpine AS base
ARG GITHUB_SHA
ARG PUBLIC_URL
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node && chmod -R 770 /home/node
RUN chown -R node:node /usr/local
USER node:node
WORKDIR /home/node/app
# Node 26 images no longer ship corepack; install pnpm from the standalone
# binary and pin it to the packageManager version in package.json.
ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
COPY --parents --chown=node:node ./forms/package.json .
COPY --parents --chown=node:node ./demo/package.json .
COPY --chown=node:node ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
RUN PNPM_VERSION=$(node -p "require('./package.json').packageManager.split('@')[1].split('+')[0]") \
	&& wget -qO- https://get.pnpm.io/install.sh \
	| env SHELL=/bin/sh ENV=/dev/null PNPM_VERSION=$PNPM_VERSION sh -

FROM base AS builder-server
ARG GITHUB_SHA
ARG PUBLIC_URL
USER root
RUN apk add --no-cache --virtual .build-deps git make python3 g++
USER node:node
WORKDIR /home/node/app
COPY --chown=node:node ./ ./
ENV CI=true
RUN pnpm -F demo install --prod

# builds production client-side
FROM builder-server AS builder-dev
ARG GITHUB_SHA
ARG PUBLIC_URL
WORKDIR /home/node/app
USER node:node
ENV CI=true
RUN pnpm install
ENV PUBLIC_URL=$PUBLIC_URL
ENV GITHUB_SHA=$GITHUB_SHA
RUN pnpm build
RUN pnpm build:demo
EXPOSE 3000
CMD ["pnpm", "dev"]

# production runtime; excludes build tools
FROM base AS production
WORKDIR /home/node/app
USER node:node
COPY --chown=node:node --from=builder-server /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=builder-server /home/node/app/demo/node_modules ./demo/node_modules
COPY --chown=node:node ./demo/serve.json ./demo/serve.json
COPY --chown=node:node --from=builder-dev /home/node/app/demo/dist ./demo/dist
EXPOSE 3000
CMD ["pnpm", "-F", "demo", "serve"]
