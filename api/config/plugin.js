'use strict';
const path = require('path')

let egg_plugin = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
};

// 分布式缓存redis客户端
egg_plugin.redis = {
  enable: true,
  path: path.join(__dirname,`../lib/plugins/egg-lu-redis`)
}

// 通用工具类
egg_plugin.ltool = {
  enable: true,
  path: path.join(__dirname, '../lib/plugins/egg-lu-tool'),
}

// 开启 socket 插件
egg_plugin.io = {
  enable: true,
  package: 'egg-socket.io',
};

// 开启mongo插件
egg_plugin.mongoose = {
  enable: true, // 开启插件
  package: 'egg-mongoose'
}

// 开启验证插件
egg_plugin.validate = {
  enable: true,
  package: 'egg-validate',
};

// 允许跨域插件
egg_plugin.cors = {
  enable: true,
  package: 'egg-cors',
};
/** @type Egg.EggPlugin */
module.exports = egg_plugin;
