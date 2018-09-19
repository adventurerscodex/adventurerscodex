FROM node:8.9.1
MAINTAINER Brian Schrader

WORKDIR /app

# Copy in the dependencies first so Docker can cache them
COPY package.json .
RUN npm install --production

# Build the project
COPY . .
CMD ./docker-entrypoint.sh
