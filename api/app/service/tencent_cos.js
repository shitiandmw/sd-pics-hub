const { Service } = require('egg');
const STS = require('qcloud-cos-sts');
var COS = require('cos-nodejs-sdk-v5');
const path = require('path');

class TencentCosSevice extends Service {
  /**
   * 获得相关路径的临时token
   * @param {*} path 授权上传路径前缀
   * @returns
   */
  async getToken(path, durationSeconds = 1800) {
    let cacheKey = 'tencent_cos_token_' + this.ctx.ltool.md5(path || '');
    let { app } = this.ctx;
    let token = await app.redis.sGet(
      cacheKey,
      async () => {
        try {
          let _getToken = (_config, _policy) => {
            return new Promise((resolve, reject) => {
              STS.getCredential(
                {
                  secretId: _config.secretId,
                  secretKey: _config.secretKey,
                  proxy: _config.proxy,
                  durationSeconds: _config.durationSeconds,
                  region: _config.region,
                  endpoint: _config.endpoint,
                  policy: _policy,
                  // roleArn: 'qcs::cam::uin/12345678:roleName/testRoleName', // 文档指引：https://cloud.tencent.com/document/product/1312/48197
                },
                function (err, credential) {
                  console.log(JSON.stringify(policy, null, '    '));
                  console.log(err || credential);
                  if (err) reject(err);
                  else resolve(credential);
                }
              );
            });
          };
          if (!app.config.tencent || !app.config.tencent.cos)
            throw this.ctx.ltool.err('腾讯云配置获取失败', 10011);
          // 配置参数
          var config = {
            secretId: app.config.tencent.SecretId, // 固定密钥
            secretKey: app.config.tencent.SecretKey, // 固定密钥
            proxy: '',
            host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
            // endpoint: 'sts.internal.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com
            durationSeconds: durationSeconds, // 密钥有效期
            // 放行判断相关参数
            bucket: app.config.tencent.cos.bucket, // 换成你的 bucket
            region: app.config.tencent.cos.region, // 换成 bucket 所在地区
            allowPrefix: path, // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
          };

          var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
          var policy = {
            version: '2.0',
            statement: [
              {
                action: [
                  // 简单上传
                  'name/cos:PutObject',
                  'name/cos:PostObject',
                  // 分片上传
                  'name/cos:InitiateMultipartUpload',
                  'name/cos:ListMultipartUploads',
                  'name/cos:ListParts',
                  'name/cos:UploadPart',
                  'name/cos:CompleteMultipartUpload',
                ],
                effect: 'allow',
                // principal: { qcs: ['*'] },
                resource: [
                  `qcs::cos:${config.region}:uid/${appId}:${config.bucket}${path}`,
                  `qcs::cos:${config.region}:uid/${appId}:${config.bucket}${path}/*`,
                ],
                // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
                // 'condition': {
                //   // 比如限定ip访问
                //   'ip_equal': {
                //     'qcs:ip': '10.121.2.10/24'
                //   }
                // }
              },
            ],
          };
          return await _getToken(config, policy);
        } catch (error) {
          throw this.ctx.ltool.err('获得临时token失败，错误：' + error, 10012);
        }
      },
      durationSeconds - 600
    );
    if (!token || !token.credentials || !token.credentials.sessionToken) {
      await app.redis.del(cacheKey);
    }
    return token;
  }

  /**
   * 压缩图片，上传cos
   * @param {*} path
   * @param {*} cos_path
   *
   */
  async uploadImage(sys_path, cos_path, width, height, quality) {
    if (width || height) {
      // 临时压缩目录 \\tmp\\compress\\YYYYmmdd
      let compress_path = this.app.baseDir + `\\tmp\\compress`;
      let day = this.ctx.ltool.formatTime2(new Date().valueOf(), 'YYYYMMDD');
      // 删除临时压缩目录下所有不是以 day 命名的文件夹
      await this.ctx.ltool.deleteDir(compress_path, day);

      // 从info.imgs[i]中获得后缀名
      let ext = path.basename(sys_path).split('.').pop();

      compress_path = `${compress_path}\\${day}\\${this.ctx.ltool.uuid()}.${ext}`;

      // 压缩图片
      let compress_res = await this.ctx.ltool.compressImg(
        sys_path,
        compress_path,
        width,
        height,
        quality
      );

      if (!compress_res) throw this.ctx.ltool.err('图片压缩失败', 10012);
      sys_path = compress_path;
    }
    // 上传图片
    return await this.uploadFile(sys_path, cos_path);
  }

  /**
   * 上传文件
   * @param {*} path 本地文件地址
   * @param {*} cos_path 要上传的文件路径
   * @returns 对象云存储的路径名
   */
  async uploadFile(path, cos_path) {
    let cos_path_dir = cos_path.substr(0, cos_path.lastIndexOf('/'));
    let token = await this.getToken(cos_path_dir);
    if (!token) throw this.ctx.ltool.err('获得临时token失败', 10012);
    let { app } = this.ctx;
    var cos = new COS({
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

    if (!app.config.tencent || !app.config.tencent.cos)
      throw this.ctx.ltool.err('腾讯云配置获取失败', 10011);
    let result = await new Promise((resolve, reject) => {
      let upload_config = {
        Bucket:
          app.config.tencent.cos.bucket /* 填入您自己的存储桶，必须字段 */,
        Region:
          app.config.tencent.cos
            .region /* 存储桶所在地域，例如 ap-beijing，必须字段 */,
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
  }
}

module.exports = TencentCosSevice;
