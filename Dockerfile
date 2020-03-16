# Stage 1 - build environment
FROM node:8 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn

COPY ./src/ ./src/
COPY ./public/ ./public/
COPY ./tsconfig.json ./tsconfig.json
COPY ./run.sh /run.sh

RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix /run.sh

RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.12-alpine

COPY ./config/ /config/
COPY --from=build-deps /run.sh /run.sh
COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/run.sh"]
CMD ["nginx", "-g", "daemon off;"]