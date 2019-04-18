#!/bin/sh

curdir=$(pwd)

## ui
cd $curdir
npm i
npm i -g
npm i -g babel-cli
npm i forever -g
npm i concurrently -g
npm rebuild node-sass
cp -rf $curdir/node_modules_override/. $curdir/node_modules
ln -s "$(pwd)/oftien-utils" "$(pwd)/node_modules/@oftien-utils"
ln -s "$(pwd)/oftien-env" "$(pwd)/node_modules/@oftien-env"
## backend
cd $curdir/public/services/api
npm run setup

cd $curdir
