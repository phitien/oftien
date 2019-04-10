#!/bin/sh

ssh-add -l
ssh-add -d ~/.ssh/id_rsa_oftien
git add .
git commit -m "$1"
git push
