#!/bin/sh

curdir=$(pwd)

## ui
cd $curdir
rm yarn*
rm -rf node_modules
yarn cache clean
yarn --no-lockfile
yarn global add
yarn global add babel-cli
yarn global add forever
yarn remove node-sass && yarn add node-sass@latest
cp -rf $curdir/node_modules_override/. $curdir/node_modules
cd node_modules && ln -s ../oftien-tools @oftien-tools && cd ..
git checkout oftien-tools
## backend
cd $curdir/services/api
yarn run setup

cd $curdir
