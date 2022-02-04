#
# Build Step
#

FROM node:14 as builder
MAINTAINER Brian Schrader
WORKDIR /app

ARG ENVIRONMENT
ENV ENVIRONMENT ${ENVIRONMENT}

ARG CLIENT_ID
ENV CLIENT_ID ${CLIENT_ID}

ARG HOST_URL
ENV HOST_URL ${HOST_URL}

ARG HOME_URL
ENV HOME_URL ${HOME_URL}

ARG ACCOUNT_URL
ENV ACCOUNT_URL ${ACCOUNT_URL}

ARG LOGIN_URL
ENV LOGIN_URL ${LOGIN_URL}

ARG WS_URL
ENV WS_URL ${WS_URL}

# Copy in the dependencies first so Docker can cache them
COPY package.json .
RUN npm install

# Build the project
COPY . .
RUN npm run build

#
# Deploy Step
#

FROM nginx:stable
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
RUN rm /etc/nginx/conf.d/*
COPY nginx.static.conf /etc/nginx/conf.d/
RUN chown nginx.nginx /usr/share/nginx/html/ -R
