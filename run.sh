#!/bin/bash

if [[ ! -d "/apps/qelite" ]] || [[ "$rebuild" == "true" ]]; then
    echo "Cloning github token:${githubtoken} ...................................."

    git clone https://arminkardan:${githubtoken}@github.com/ArminKardan/qelite.git /apps/qelite

    cp -r /apps/linux/node /apps/qelite/node_modules

    sleep 1

    cd /apps/qelite

    sleep 1

    echo 'Building....................................'

    yarn build

    sleep 1
fi

cd /apps/qelite

yarn start

echo 'Nextjs crashed :-( ....................................'

node -e "setInterval(()=>{},1000)"
