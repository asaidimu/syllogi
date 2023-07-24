# node for server and build.
FROM node:19.5-alpine as base

RUN apk --no-cache add --virtual .builds-deps build-base python3

RUN npm install --global node-gyp

FROM base as build

# set base path
WORKDIR /build

ARG PACKAGE_NAME

# copy meta files over
COPY ./meta .

# select workspace
RUN yarn workspaces focus "${PACKAGE_NAME}"

# copy source files
COPY ./pkg .

# Remove any existing .env file
RUN rm -f ./packages/server/.env

# Copy .env.prod to .env
RUN cp ./packages/server/.env.prod ./packages/server/.env

# generate secrets
RUN python3 ./packages/server/bin/secrets.py

# build prisma
RUN yarn workspace "${PACKAGE_NAME}" run prisma generate

# build package
RUN yarn workspace "${PACKAGE_NAME}" run build:dist

# Remove build dependencies after the build process is complete
RUN apk del .builds-deps

# packages are in dist
FROM build as assets

WORKDIR /app

COPY --from=build /build/packages/server/dist .

# install dependencies
RUN yarn

# generate dependencies
RUN yarn prisma generate

# run the server
CMD ["yarn", "serve"]
