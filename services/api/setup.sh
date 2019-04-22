#!/bin/sh

curdir=$(pwd)

## ui
cd $curdir
rm yarn*
rm -rf node_modules
yarn cache clean
yarn --no-lockfile
yarn global add sails
cd node_modules ln -s ../../../oftien-tools @oftien-tools && cd ..
cd ../../ && git checkout oftien-tools
#
cd $curdir
echo "db.dropDatabase()" | mongo oftien
mongorestore --host localhost --archive=./db/oftien --nsFrom "oftien.*" --nsTo "oftien.*"

cd $curdir
