FROM node:24-alpine AS base
ARG GITHUB_SHA
ARG PUBLIC_URL
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node && chmod -R 770 /home/node
RUN chown -R node:node /usr/local
USER node:node
WORKDIR /home/node/app
COPY ./package.json ./package.json
COPY ./demo/package.json ./demo/package.json

FROM base AS builder-server
ARG GITHUB_SHA
ARG PUBLIC_URL
USER root
RUN apk add --no-cache --virtual .build-deps git make python3 g++
USER node:node
WORKDIR /home/node/app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm
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
CMD ["npm", "run", "serve", "-w", "demo"]
