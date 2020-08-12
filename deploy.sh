#!/bin/sh
# PROJ_PATH: 项目根目录

echo "PROJ_PATH: ${PROJ_PATH}"

# 判断环境变量是否存在
if [ -z $PROJ_PATH ]; then
    echo '[ERROR] PROJ_PATH is empty'
    exit 1
fi

# 项目构建
cd $PROJ_PATH/gamma-admin
npm install --registry=https://registry.npm.taobao.org
npm run build

# 部署前端项目
rm -rf /data/www/*
cp -rf $PROJ_PATH/gamma-admin/dist/* /data/www/

echo "部署完成"