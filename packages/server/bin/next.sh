#!/usr/bin/env sh
set -eu

yarn build:dist
cd dist
yarn pack . alcides
tar -zxvf @sy-v1.0.0.tgz
target="../../../node_modules/@syllogi/server"

[ -e ${target} ] && rm -rf ${target}

mv package ../node_modules/alcides
cd ..
rm -rf dist
chmod +x node_modules/alcides/index.js

