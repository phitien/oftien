#!/bin/sh

rm -rf ./db/mongodump
mongodump --host localhost --db rpa --archive=./db/archive
