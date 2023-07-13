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
RUN yarn workspaces foreach --exclude "${PACKAGE_NAME}" run build:ci

# copy source files
COPY ./pkg .
RUN yarn workspace "${PACKAGE_NAME}" run build:ci

# nginx to serve the client
FROM nginx:1.23.3-alpine as server

# copy nginx config
COPY --from=base /root/app/packages/client/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

# copy web files
COPY --from=base /root/app/packages/client/dist /usr/share/nginx/html

# expose port
EXPOSE 8080

# run the server
CMD ["nginx", "-g", "daemon off;"]
