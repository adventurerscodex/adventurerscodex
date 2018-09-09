FROM node:8.9.1
MAINTAINER Brian Schrader

WORKDIR /app

# Build the project
COPY . .

RUN npm install --production
CMD ./docker-entrypoint.sh
