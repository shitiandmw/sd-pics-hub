var COS = require('cos-nodejs-sdk-v5');
var ltool = require('./ltool');
var path = require('path');
const ll = path.sep;
function tencent_cos(options) {
  this.getToken = options.getToken || null;

  /**
   * 压缩图片，上传cos
   * @param {*} path
   * @param {*} cos_path
   */
  this.uploadImage = async function (
    sys_path,
    cos_path,
    width = 0,
    height = 0,
    quality = 0
  ) {
    if (width || height) {
      // 临时压缩目录 \\tmp\\compress\\YYYYmmdd
      let compress_path = __dirname + `${ll}tmp${ll}compress`;
      let day = ltool.formatTime2(new Date().valueOf(), 'YYYYMMDD');
      // 删除临时压缩目录下所有不是以 day 命名的文件夹
      await ltool.deleteDir(compress_path, day);

      // 从info.imgs[i]中获得后缀名
      let ext = path.basename(sys_path).split('.').pop();

      compress_path = `${compress_path}${ll}${day}${ll}${ltool.uuid()}.${ext}`;

      // 压缩图片
      let compress_res = await ltool.compressImg(
        sys_path,
        compress_path,
        width,
        height,
        quality
      );

      if (!compress_res) throw new Error('图片压缩失败', 10012);
      sys_path = compress_path;
    }
    // 上传图片
    return await this.uploadFile(sys_path, cos_path);
  };

  /**
   * 上传文件
   * @param {*} path
   * @param {*} cos_path
   * @returns
   */
  this.uploadFile = async function (path, cos_path) {
    let token = await this.getToken();
    if (!token) throw new Error('获得临时token失败');
    if (!token.config || !token.config.bucket || !token.config.region)
      throw new Error('腾讯云配置获取失败');
    let cos = new COS({
      getAuthorization: function (options, callback) {
        let tokeninfo = {
          TmpSecretId: token.credentials.tmpSecretId, // 临时密钥的 tmpSecretId
          TmpSecretKey: token.credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
          SecurityToken: token.credentials.sessionToken, // 临时密钥的 sessionToken
          ExpiredTime: token.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
        };
        callback(tokeninfo);
      },
    });
    let result = await new Promise((resolve, reject) => {
      let upload_config = {
        Bucket:
          token.config.bucket /* 填入您自己的存储桶，必须字段 */,
        Region:
          token.config.region /* 存储桶所在地域，例如 ap-beijing，必须字段 */,
        Key: cos_path /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        FilePath: path /* 必须 */,
        SliceSize:
          1024 * 1024 * 5 /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */,
        onTaskReady: function (taskId) {
          /* 非必须 */
          // console.log(taskId);
        },
        onProgress: function (progressData) {
          /* 非必须 */
          // console.log(JSON.stringify(progressData));
        },
        onFileFinish: function (err, data, options) {},
      };
      cos.uploadFile(upload_config, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
    return result && result.statusCode == 200;
  };
}

module.exports = tencent_cos;
