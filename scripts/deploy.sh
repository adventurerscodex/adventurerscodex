#! /bin/bash
# Push to the nightly build repo.
# Note: Accounts on the server must already exist.
#
# Author: Brian Schrader
# Since: 2017-11-25

if [ -z "$NIGHTLY_URL" ]; then
    echo "No value for variable NIGHLY_URL was set. Nowhere to push."
    exit -1;
fi

git branch --set-upstream -f origin $NIGHTLY_URL
