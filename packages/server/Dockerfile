# node for server and build.
FROM node:19.5-alpine as base

# set base path
WORKDIR /root/app

ARG PACKAGE_NAME

# copy meta files over
COPY ./meta .

# install remote dependencies
# RUN --mount=type=cache,id=yarn-cache,target=/root/app/.yarn/cache \
RUN yarn workspaces focus "${PACKAGE_NAME}"

# copy dependencies
COPY ./deps .

# build dependencies
RUN yarn workspaces foreach --exclude "${PACKAGE_NAME}" run build

# copy source files
COPY ./pkg .

# build package
RUN yarn workspace "${PACKAGE_NAME}" run build

# packages are in dist
FROM base as assets

# run the server
CMD ["yarn", "workspace", "${PACKAGE_NAME}", "run", "start"]
