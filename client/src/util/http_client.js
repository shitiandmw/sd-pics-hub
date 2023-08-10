/**
 * request请求封装
 * 包括 get、post等方式
 */
import qs from 'qs';
import cache from './LCache';
import { sign, rsa } from './crypto';
import store from '../store';

var baseURL_ = `${process.env.VUE_APP_API_HOST}`;

//时间偏移量
var time_offset = 0;

/**
 * get方式请求，url传参
 * @param url 请求url
 * @param params 参数
 * @param level 0:无加密，1：参数加密，2: 签名+时间戳； 默认0
 */
const get = (url, params, level, pubkey, depth) =>
  new Promise((resolve, reject) => {
    const refunc = depth_ => {
      return get(url, params, level, pubkey, depth_);
    };
    const config = getConfig(url, 'GET', true, params, level, pubkey);
    uni.request(
      Object.assign(
        {
          success: res => {
            successback(res, depth, refunc, config).then(data => {
              resolve(data);
            });
          },
          fail: error => {
            errback(error, config).then(() => {
              reject(error);
            });
          },
        },
        config
      )
    );
  });
/**
 * post方式请求 json方式传参
 * @param url 请求url
 * @param params 参数
 * @param level 0:无加密，1：参数加密，2: 签名+时间戳； 默认0
 */
const post = (url, params, level, pubkey, depth) =>
  new Promise((resolve, reject) => {
    const refunc = depth_ => {
      return get(url, params, level, pubkey, depth_);
    };
    const config = getConfig(url, 'POST', true, params, level, pubkey);
    uni.request(
      Object.assign(
        {
          success: res => {
            successback(res, depth, refunc, config).then(data => {
              resolve(data);
            });
          },
          fail: error => {
            errback(error, config).then(() => {
              reject(error);
            });
          },
        },
        config
      )
    );
  });

/**
 * 同步服务器时间
 * @param url 请求url
 * @param params 参数
 * @param level 0:无加密，1：参数加密，2: 签名+时间戳； 默认0
 */
const inittime = () =>
  new Promise((resolve, reject) => {
    const config = getConfig(
      '/default/getnowtime?d=' + new Date().valueOf(),
      'GET',
      true,
      {},
      0
    );
    uni.request(
      Object.assign(
        {
          success: res => {
            if (res.data.code == 1) {
              let timestamp = new Date().getTime();
              uni.setStorageSync(
                'time_offset_cache',
                res.data.data - timestamp
              );
              resolve(timestamp);
            } else
              errback(error, config).then(() => {
                reject(error);
              });
          },
          fail: error => {
            errback(error, config).then(() => {
              reject(error);
            });
          },
        },
        config
      )
    );
  });

// 错误回调函数
const errback = (error, config) => {
  console.log(`[${config.method}]${config.url} error:`, error);
  if ('code' in error) {
    // 未登录
    if (error.code === 30001) {
      localStorage.clear();
      // window.location.href = "/";
      //   return;
    }
    return Promise.resolve(error);
  }
  return Promise.resolve({
    data: error.message,
  });
};
// 成功回调函数
const successback = async (res, depth, refunc, config) => {
  depth = depth || 1;
  console.log(`[${config.method}]${config.url} res:`, res.data);
  if (res.data.code == 401) {
    store.commit('user/SET_LOGIN_TYPE', true);
    res.data.errorMsg = '登录过期，请重新登录';
    // localStorage.removeItem("app_login_user");
    // window.location.href = "./#/401";
  } else if (res.data.code == '4001') {
    if (depth < 2 && typeof refunc == 'function') {
      await inittime();
      return await refunc(depth + 1);
    } else inittime();
  } else if (res.data.code == '4050' || res.data.code == '4051') {
    cache.del('server_pubkey_v1', () => {});
    // localStorage.removeItem("server_pubkey_v1");
  }
  return res.data;
};

/**
 * @param url 请求url
 * @param method get,post,put,delete
 * @param isjson 是否json提交参数
 * @param params 参数
 * @param level 0:无加密，1：参数加密，2: 签名+时间戳； 默认0
 * @param pubkey 加密用的公钥
 */
const getConfig = (url, method, isjson, params, level = 0, pubkey = '') => {
  console.log(`[${method}]${baseURL_ + url} params:`, params);
  let config_ = {
    url: `${baseURL_}${url}`,
    method,
    timeout: 120000,
    // params, data,
    header: {},
  };

  // 时间戳
  if (pubkey) {
    // rsa 加密
    var pubkey_ = pubkey.replace('-----BEGIN PUBLIC KEY-----\n', '');
    pubkey_ = pubkey_.replace('\n-----END PUBLIC KEY-----', '');
    params = {
      content: rsa.encrypt_pub(pubkey, JSON.stringify(params)),
      p: pubkey_,
    };
  }
  if (level === 2) {
    var time_offset_cache = uni.getStorageSync('time_offset_cache');
    if (time_offset_cache) time_offset = parseInt(time_offset_cache);
    // 签名
    let timestamp = new Date().getTime() + time_offset;
    // 获取token
    var login_user = uni.getStorageSync('app_login_user');
    let token, userid, logintype;
    if (login_user) {
      login_user = JSON.parse(login_user);
      token = login_user.token;
      userid = login_user.userid;
      logintype = login_user.logintype || 'h5';
    }
    // console.log(`token:${token};timestamp:${timestamp};params:${params}`)
    let signstr = sign(token, timestamp, params);
    // 签名串
    // if (method == 'POST') params = qs.stringify(params);
    // console.log('token', token);
    // console.log('signstr', signstr);
    config_.header['userid'] = userid;
    config_.header['timestamp'] = timestamp;
    config_.header['signstr'] = signstr;
    config_.header['logintype'] = logintype;
    // console.log(`[${method}]${baseURL_ + url} header:`,config_.header);
  }

  config_.data = params;

  // console.log(`[${method}]${baseURL_ + url} signInfo:`)
  console.log("config_",config_);
  return config_;
};
// 统一方法输出口
export default {
  get,
  post,
  inittime,
};
