/*
 * 缓存帮助类
 * lu xiangqun 2019.11.15
 */

/*
 * 获取一个缓存数据，如果没有这个缓存，则从传入的noHaveFunc函数中获取，并存入缓存
 * @key : 缓存key
 * @noHaveFunc : 没有这个缓存的时候获取数据的方法  需要一个回调参数 callback : 函数返回的数据结果
 * @timeout : 缓存过期时间
 * @callback : 得到数据后的回调函数  需要接收回调结果 res : 数据结果
 */
var Get = function(key, noHaveFunc, timeout, callback) {
    if (!timeout) timeout = 10000;
    //重新获取数据，并存入缓存
    var reload_data = function() {
      var new_result = null;
      if (typeof noHaveFunc == "function") {
        noHaveFunc(function(res) {
          new_result = res;
          if (new_result) {
            uni.setStorageSync(
              key,
              JSON.stringify({
                Data: new_result,
                exp: new Date().valueOf() + timeout,
              })
            );
          }
          typeof callback == "function" && callback(new_result);
        });
      } else typeof callback == "function" && callback(new_result);
    };
  
    var result = uni.getStorageSync(key);
    if (result) {
      var result_ = {
        exp: new Date().valueOf(),
      };
      try {
        console.log("sessionStorage", result);
        result_ = JSON.parse(result);
      } catch (err) {}
      //验证数据是否已经过期
      if (result_ && result_.exp > new Date().valueOf()) {
        typeof callback == "function" && callback(result_.Data);
      } else {
        //清除过期数据
        uni.removeStorageSync(key);
        //获取新的数据
        reload_data();
      }
    } else reload_data();
  };
  //判断一个对象是否是json
  var IsJson = function(str, pass_object) {
    if (pass_object && isObject(str)) return true;
    if (!isString(str)) return false;
    str = str.replace(/\s/g, "").replace(/\n|\r/, "");
    if (/^\{(.*?)\}$/.test(str)) return /"(.*?)":(.*?)/g.test(str);
    if (/^\[(.*?)\]$/.test(str)) {
      return str
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .replace(/},{/g, "}\n{")
        .split(/\n/)
        .map(function(s) {
          return isJSON(s);
        })
        .reduce(function(prev, curr) {
          return !!curr;
        });
    }
    return false;
  };
  /*
   * 添加一个缓存数据到本地
   * @key : 缓存key
   * @data : 缓存的数据
   * @timeout : 缓存过期时间
   * @callback : 设置缓存成功后的回调函数 需要接收回调结果 res : true|false
   */
  var Set = function(key, data, timeout, callback) {
    uni.setStorageSync(
      key,
      JSON.stringify({
        Data: data,
        exp: new Date().valueOf() + timeout,
      })
    );
    typeof callback == "function" && callback(true);
  };
  /*
   * 是否存在某个缓存数据
   * @key : 缓存key
   * @callback : 得到结果后的回调 需要接收回调结果 res : true|false
   */
  var Exist = function(key, callback) {
    typeof callback == "function" && callback(true);
  };
  /*
   * 删除某个缓存数据
   * @key : 缓存key
   * @callback : 删除后的回调 需要接收回调结果 res: true:false, err: 错误信息
   */
  var Del = function(key, callback) {
    uni.removeStorageSync(key);
    typeof callback == "function" && callback(true, "");
  };
  var result = {
    get: Get,
    set: Set,
    exist: Exist,
    del: Del,
  };
  // 统一方法输出口
  export default result;
  