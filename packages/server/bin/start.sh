#!/usr/bin/env sh
set -eu

PACKAGE_NAME=${PACKAGE_NAME:-"@syllogi/server"}

yarn workspace "$PACKAGE_NAME" run start
