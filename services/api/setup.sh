#!/bin/sh

curdir=$(pwd)

## ui
cd $curdir
npm install
npm install -g sails

echo "db.dropDatabase()" | mongo oftien
mongorestore --host localhost --archive=./db/oftien --nsFrom "oftien.*" --nsTo "oftien.*"

cd $curdir
