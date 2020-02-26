#!/bin/sh

cd /usr/share/nginx/html

echo "RELEASE_ENV=${RELEASE_ENV}"

cp -v /config/$RELEASE_ENV/config.js /usr/share/nginx/html/config.js

cat /usr/share/nginx/html/config.js

echo "Starting nginx"
exec "$@"
