#!/usr/bin/env sh
set -eu

rm -rf dist
yarn tsc

# clean up
[ -e "./dist/test" ] && rm -rf ./dist/test
[ -e "./dist/coverage" ] && rm -rf ./dist/coverage
find dist -name "*ts" -exec rm -rf {} \;
find dist -name "*js.map" -exec rm -rf {} \;

cp -r README.md LICENSE.md prisma dist/
cp dist.package.json dist/package.json
cp .env dist/.env
