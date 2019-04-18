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
cd node_modules && ln -s ../oftien-utils @oftien-utils && ln -s ../oftien-env @oftien-env
## backend
cd $curdir/public/services/api
npm run setup

cd $curdir
