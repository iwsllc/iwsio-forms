FROM node:20-alpine AS base
ARG GITHUB_SHA
ARG PUBLIC_URL
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node && chmod -R 770 /home/node
WORKDIR /home/node/app

FROM base AS builder-server
ARG GITHUB_SHA
ARG PUBLIC_URL
RUN apk add --no-cache --virtual .build-deps git make python3 g++
WORKDIR /home/node/app
USER node:node
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./package-lock.json ./
COPY --chown=node:node ./demo/package.json ./demo/
RUN npm ci --omit=dev -w demo

# builds production client-side
FROM builder-server AS builder-dev
ARG GITHUB_SHA
ARG PUBLIC_URL
WORKDIR /home/node/app
COPY --chown=node:node ./.eslint* ./
COPY --chown=node:node ./tsconfig* ./
COPY --chown=node:node ./demo ./demo
COPY --chown=node:node ./forms ./forms
USER node:node
RUN npm i --loglevel warn
ENV PUBLIC_URL=$PUBLIC_URL
ENV GITHUB_SHA=$GITHUB_SHA
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]

# production runtime; excludes build tools
FROM base AS production
WORKDIR /home/node/app
USER node:node
COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./package-lock.json ./package-lock.json
COPY --chown=node:node --from=builder-server /home/node/app/node_modules ./node_modules
COPY --chown=node:node ./demo/package.json ./demo/package.json
COPY --chown=node:node ./demo/serve.json ./demo/serve.json
COPY --chown=node:node --from=builder-dev /home/node/app/demo/dist ./demo/dist
EXPOSE 3000
CMD npm run serve -w demo
