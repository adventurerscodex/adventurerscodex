#! /bin/bash
# Push to the nightly build repo.
# Note: Accounts on the server must already exist.
#
# Author: Brian Schrader
# Since: 2017-11-25

if [[ "$TRAVIS_BRANCH" -eq "develop" ]]; then
    if [ -z "$NIGHTLY_URL" ]; then
        echo "No value for variable NIGHTLY_URL was set. Nowhere to push."
        exit 0;
    fi

    git branch --set-upstream -f origin $NIGHTLY_URL
    exit 0;
fi

if [[ "$TRAVIS_BRANCH" -eq "master" ]]; then
    if [ -z "$MASTER_URL" ]; then
        echo "No value for variable MASTER_URL was set. Nowhere to push."
        exit 0;
    fi

    git branch --set-upstream -f origin $MASTER_URL
    exit 0;
fi


echo "No relevant branch to push to... use either `develop` or `master`."
