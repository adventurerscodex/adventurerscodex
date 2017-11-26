#! /bin/bash
# Push to the nightly build repo.
# Note: Accounts on the server must already exist.
#
# Author: Brian Schrader
# Since: 2017-11-25


do_push() {
    URL="$1"

    git remote add origin "$URL"
    git push -u -f origin develop
}


if [[ "$TRAVIS_BRANCH" -eq "develop" ]]; then
    if [ -z "$NIGHTLY_URL" ]; then
        echo "No value for variable NIGHTLY_URL was set. Nowhere to push."
        exit 0;
    fi

    do_push $NIGHTLY_URL
    exit 0;
fi

if [[ "$TRAVIS_BRANCH" -eq "master" ]]; then
    if [ -z "$MASTER_URL" ]; then
        echo "No value for variable MASTER_URL was set. Nowhere to push."
        exit 0;
    fi

    do_push $MASTER_URL
    exit 0;
fi


echo "No relevant branch to push to... use either `develop` or `master`."
