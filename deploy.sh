#! /bin/bash

# Deploy AdventurersCodex/charactersheet
# author: Brian Schrader
# since: 2015-12-23

DOMAIN="adventurerscodex.com"
ARCHIVE="project.tar.gz"


set -e;

# Do setup. 
npm install; 
npm test; 

# Archive and remove the project files.
shopt -s extglob
tar --remove-files -zcvf $ARCHIVE !(charactersheet);
shopt -u extglob

# Extract the project.
mv ./charactersheet ./deploy

# Delete the temp files.
cp -R ./deploy/* .;
rm -rf deploy*

# Make CNAME File
echo "$DOMAIN" > CNAME
