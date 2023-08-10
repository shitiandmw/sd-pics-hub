/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1673064796027_4890';

  // 中间件
  config.middleware = ["responseHandler"];

  // socket模块
  config.io = {
    // Egg Socket 内部默认使用 ws 引擎，uws 因为某些原因被废止。如坚持需要使用，请按照以下配置即可：
    // init: { wsEngine: 'uws' }, // default: ws
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        // 针对连接事件的授权处理
        connectionMiddleware: ['connection'],
        // 针对消息的处理 （暂时不实现）
        packetMiddleware: ['packet'],
      },
      '/example': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
    redis: {
      host: 'redis',
      port: 6379,
      auth_pass: 'lfluYk4reffZDjzzXfeNA2ub9odfJ1Ic',
      db: 0,
    },
  };

  config.mongoose = {
    client: {
      url: `mongodb://mongodb:27017/sd_pics_hub?authSource=admin`,
      options: {
        user: 'dbroot',
        pass: 'Gri42Mvyk3j2PXIiTdn6CCA8JDSST7yv',
        useUnifiedTopology:true
      },
    },
  };


  // 参数验证模块
  config.validate  = {
    // convert: false,
    // validateRoot: false,
  };

  // 跨域访问配置
  config.cors = {
    origin:'*',
    allowMethods: 'GET,POST'
  };
  config.security = {
    csrf:{
      enable:false
    }
  }

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: "redis",       // Redis host
      password: 'lfluYk4reffZDjzzXfeNA2ub9odfJ1Ic',
      db: 0,
    },
  }

  config.logger = {
    consoleLevel: 'DEBUG',
  };
  config.cluster = {
    listen: {
      port: 7002,
      hostname: '0.0.0.0'
    },
  }


  // add your user config here
  const userConfig = {
    
    // myAppName: 'egg',
  };

  // // # 注意，开启此模式后，应用就默认自己处于反向代理之后，
  // // # 会支持通过解析约定的请求头来获取用户真实的 IP，协议和域名。
  // // # 如果你的服务未部署在反向代理之后，请不要开启此配置，以防被恶意用户伪造请求 IP 等信息。
  config.proxy = true;
  
  return {
    ...config,
    ...userConfig,
  };
};
