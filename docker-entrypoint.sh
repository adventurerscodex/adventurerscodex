#! /bin/bash

set -e;

if [[ $ENVIRONMENT == 'prod' ]]; then
    echo "[$(date)] Building production version to dist/"
    npm run build
elif [[ $ENVIRONMENT == 'test' ]]; then
    echo "[$(date)] Building test version to dist/"
    npm run build:test
else
    echo "[$(date)] Starting dev server"
    npm run start
fi
