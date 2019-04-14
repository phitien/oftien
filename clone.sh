#!/bin/sh

while [ ! -d "$dest" ]
do
  read -p "Enter a existing destination: " dest;
done
while [[ ! "$app" ]] || [[ ! -d "src/apps/$app" ]]
do
  read -p "Enter existing app: " app;
done
read -p "Enter a non existing folder in $destination (Enter to keep take $app): " newname;
if [ ! "$newname" ]
then
  newname=$app
fi
while [[ "$newname" ]] && [[ -d "$dest/$newname" ]]
do
  read -p "Enter a non existing folder in $destination (Enter to keep take $app): " newname;
done
destination="$dest/$newname"
#
echo "Cloning to $destination ...";
#
mkdir -p "$destination"
# copy config
cp -rf config "$destination"
rm -rf "$destination/config/.env*"
cp -rf "config/.env.$app" "$destination/config/.env.$app"
cp -rf "config/.env.$app" "$destination/config/.env.local"
cp -rf "config/.env.$app" "$destination/config/.env.development"
cp -rf "config/.env.$app" "$destination/config/.env.test"
# copy pm2
cp -rf pm2 "$destination"
# copy src
cp -rf src "$destination"
rm -rf "$destination/src/apps"
mkdir -p  "$destination/src/apps"
cp -rf "src/apps/$app" "$destination/src/apps"
rm -rf "$destination/src/gg-analytics"
mkdir -p "$destination/src/gg-analytics"
touch "$destination/src/gg-analytics/$app.js"
cp -rf "src/gg-analytics/$app.js" "$destination/src/gg-analytics"
# copy files
cp -rf .babelrc "$destination"
cp -rf bootstrap.js "$destination"
# copy public
cp -rf public "$destination"
rm -rf "$destination/public/routes"
rm -rf "$destination/public/static/apps"
mkdir -p "$destination/public/static/apps"
cp -rf "public/static/apps/$app" "$destination/public/static/apps"
#
yes | cp -rf single/* "$destination"
#
read -p "Enter git url: " giturl;
if [ "$giturl" ]
then
  cd "$destination"
  yes | git init
  git remote add origin $giturl
fi
#
#
echo "Done";
