#!/bin/sh

ssh-add -l
ssh-add ~/.ssh/id_rsa_oftien
git add .
git commit -m "$1"
git push --set-upstream origin ${2:-master}
