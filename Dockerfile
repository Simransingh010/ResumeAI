# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.17.0

FROM node:${NODE_VERSION}-slim as base
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# Stage 1: Install ALL dependencies (including dev)
FROM base as deps
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM deps as build
COPY . .
RUN npm run build

# Stage 3: Install ONLY production dependencies
FROM base as prod-deps
COPY package.json package-lock.json ./
RUN npm ci 

# Stage 4: Final runtime image
FROM base as final
ENV NODE_ENV=production
USER node
WORKDIR /usr/src/app

COPY package.json .
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next

EXPOSE 3000
CMD ["npm", "start"]