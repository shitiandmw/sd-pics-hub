const axios = require('axios');
 /**
* http 基础请求
* @param {*} url
* @param {*} method
* @param {*} data
* @param {*} timeout
*/
exports.request = function (url, method, data, timeout = 3000, responseType = null) {
 return new Promise((resolve, reject) => {
   if (!url.startsWith('http://') && !url.startsWith('https://'))
     url = config.sd_base_url + url;
   let axios_config = {
     url: url,
     method: method,
     data: data,
     timeout: timeout,
   };
   if (responseType) axios_config.responseType = responseType;
   axios(axios_config)
     .then(res => {
       resolve(res);
     })
     .catch(err => {
       reject(err);
     });
 });
}