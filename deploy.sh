#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
# cd dist

git init
git add -A
git commit -m 'deploy'

# git config --global user.name "xxx"
# git  --global user.email "xxx@xx.com"