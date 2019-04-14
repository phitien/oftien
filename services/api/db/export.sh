#!/bin/sh

rm -rf ./db/mongodump
mongodump --host localhost --db oftien --archive=./db/archive
