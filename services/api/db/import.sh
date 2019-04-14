#!/bin/sh
echo "db.dropDatabase()" | mongo rpa
mongorestore --host localhost --db rpa --archive=./db/archive

#mongorestore --uri "mongodb://root:Password1234@apa-mongodb-shard-00-00-5woyl.gcp.mongodb.net:27017,apa-mongodb-shard-00-01-5woyl.gcp.mongodb.net:27017,apa-mongodb-shard-00-02-5woyl.gcp.mongodb.net:27017/rpa?ssl=true&replicaSet=APA-MongoDB-shard-0&authSource=admin&retryWrites=true" --ssl --db rpa --archive=./db/archive
