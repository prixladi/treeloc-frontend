#!/bin/sh

cd /usr/share/nginx/html

env
cp -v /config/docker/config.js /usr/share/nginx/html/config.js

sed -i "s~API_URL~$API_URL~" /usr/share/nginx/html/config.js
sed -i "s~SIGNAL_URL~$SIGNAL_URL~" /usr/share/nginx/html/config.js

cat /usr/share/nginx/html/config.js

echo "Starting nginx"
exec "$@"
