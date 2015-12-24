#! /bin/bash

# Deploy AdventurersCodex/charactersheet
ARCHIVE="project.tar.gz"


set -e;

# Do setup. 
#npm install; 
#npm test; 

# Archive and remove the project files.
shopt -s extglob
tar --remove-files -zcvf $ARCHIVE !(charactersheet);
shopt -u extglob

# Extract the project.
#cp -rp charactersheet/* .;
