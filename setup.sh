#!/bin/sh

curdir=$(pwd)

## ui
cd $curdir
npm install
npm install -g
npm rebuild node-sass
cp -rf $curdir/node_modules_override/. $curdir/node_modules

## backend
cd $curdir/public/services/api
npm run setup

cd $curdir
