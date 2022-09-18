sed -i "s/-p 80 -H/-p $(cat .env | grep "FRONT_PORT" | cut -d "=" -f 2) -H/g" ./package.json
sed -i "1,9 s/127.0.0.1:/127.0.0.1:$(cat .env | grep "FRONT_PORT" | cut -d "=" -f 2)/" ./docker/default.conf
sed -i "11,162 s/127.0.0.1:/127.0.0.1:$(cat .env | grep "BACK_PORT" | cut -d "=" -f 2)/g" ./docker/default.conf
mv ./docker/default.conf /etc/nginx/sites-enabled/default

yarn build;
/usr/sbin/service nginx restart;
pm2-runtime ./docker/config.json
