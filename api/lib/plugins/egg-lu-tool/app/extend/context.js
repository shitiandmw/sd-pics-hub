const CryptoJS = require('crypto-js');
const Crypto = require('crypto');
const moment = require('moment');
const luxon = require('luxon');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {rimraf} = require('rimraf');

class LuError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = {
  get ltool() {
    return {
      err(message, code) {
        return new LuError(message, code);
      },
      md5(content) {
        return CryptoJS.MD5(content).toString();
      },
      // 时间戳格式化成可读时间
      formatTime2(timestamp, format) {
        if (!format) format = 'YYYY-MM-DD HH:mm:ss';
        console.log('timestamp', new Date().valueOf());
        let result = new Date();
        console.log('timestamp', result);
        if (typeof timestamp == 'number') result = new Date(timestamp);
        result = moment(result).format(format);
        return result;
      },
      // 时间戳格式化成可读时间
      formatTime(timestamp, type = 1) {
        let round = true;
        // 计算tiestamp与当前时间的差值绝对值
        let diff = Math.abs(new Date().valueOf() - timestamp);
        // 如果差值大于1小时，不取整
        if (diff > 60 * 60 * 1000 && type == 1) round = false;
        return luxon.DateTime.fromMillis(timestamp)
          .setLocale('zh')
          .toRelative({ round: round });
        // console.log("timestamp",(new Date()).valueOf())
        // let result = new Date();
        // console.log("timestamp",result)
        // if (typeof timestamp == 'number')
        //   result = new Date(timestamp);
        // result = moment(result).format('HH点mm分');
        // return result;
      },
      // 时间格式化成时间戳
      formatTimeStamp(time) {
        let result = new Date().valueOf();
        // 正则验证time是否是时间格式
        const reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
        if (reg.test(time)) result = new Date(time).valueOf();
        return result;
      },
      sign(timestamp, key, data, random = null) {
        let convertData = data;
        if (typeof data == 'object' && data) {
          convertData = '';
          let dataJson = {};
          //把所有key值改成小写
          for (let it in data) {
            if (it.toLowerCase() == 'file') continue;
            dataJson[it.toLowerCase()] = data[it];
          }

          //获得字典序键
          var keys = Object.keys(dataJson).sort();
          for (let index = 0; index < keys.length; index++) {
            const it = keys[index];
            let val = dataJson[it];
            if (
              typeof val === 'object' && //
              (!(val instanceof Array) ||
                (val.length > 0 && typeof val[0] === 'object'))
            ) {
              val = JSON.stringify(val);
            }
            convertData +=
              it.toLowerCase() +
              (val == null || val == 'null' || typeof val == 'undefined'
                ? ''
                : val);
          }
        }
        if (!convertData) convertData = '';
        let sign_content = `${timestamp}${key}${convertData}`;
        if (random) sign_content += `&random_number=${random}`;
        // console.log("sign_content",sign_content);
        return CryptoJS.MD5(sign_content).toString();
      },
      uuid() {
        return Crypto.randomUUID();
      },
      isJson(str) {
        let fag = false;
        try {
          let json_str = JSON.parse(str);
          fag = true;
        } catch (error) {}
        return fag;
      },
      // 获得一个随机的8|length长度的数字
      nonceNumer(length = 8) {
        const randomChar = '0123456789';
        let result = '';
        for (let index = 0; index < length; index++) {
          result += randomChar[Crypto.randomInt(0, randomChar.length - 1)];
        }
        return result;
      },
      // 获得一个随机的8|length长度的字符串
      nonceString(length = 8, isVCode = false, format = '*') {
        let randomChar =
          '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        switch (format) {
          case 'ABC123':
            randomChar = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
            break;
          case 'abc123':
            randomChar = '0123456789qwertyuiopasdfghjklzxcvbnm';
            break;
          case 'ABC':
            randomChar = 'QWERTYUIOPASDFGHJKLZXCVBNM';
            break;
          case 'abc':
            randomChar = 'qwertyuiopasdfghjklzxcvbnm';
            break;
          default:
            if (isVCode)
              randomChar =
                '0123456789qwertyuipasdfghjklzxcvbnmQWERTYUIPASDFGHJKLZXCVBNM';
            break;
        }
        let result = '';
        for (let index = 0; index < length; index++) {
          result += randomChar[Crypto.randomInt(0, randomChar.length - 1)];
        }
        return result;
      },

      isNotEmptyString(value) {
        return typeof value === 'string' && value.length > 0;
      },
      isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
      },
      isNumber(value) {
        return Object.prototype.toString.call(value) === '[object Number]';
      },
      isBoolean(value) {
        return Object.prototype.toString.call(value) === '[object Boolean]';
      },
      isFunction(value) {
        return Object.prototype.toString.call(value) === '[object Function]';
      },
      /**
       *
       * @param {*} img_path 原图地址
       * @param {*} compress_path 压缩后的图片地址
       * @param {*} width 压缩后的图片宽度 为零则不压缩
       * @param {*} height 压缩后的图片高度 为零则不压缩
       * @param {*} quality 压缩图片质量 0-100
       */
      async compressImg(img_path, compress_path, width, height, quality) {
        // compress_path 文件是否已经存在
        if (fs.existsSync(compress_path)) return true;
        // 原图是否存在
        if (!fs.existsSync(img_path)) return false;
        // 压缩目录是否存在
        let compress_dir_path = path.dirname(compress_path);
        if (!fs.existsSync(compress_dir_path)) fs.mkdirSync(compress_dir_path,{ recursive: true });

        // 大小调整配置
        const resizeOptions = {
          fit: sharp.fit.inside, // 调整模式：保持宽高比，适应目标尺寸
        };
        if (width) resizeOptions.width = width;
        if (height) resizeOptions.height = height;
        // 压缩配置
        const compressOptions = {
          // compressionLevel:7,
          // palette:true,
          quality: quality, // 压缩质量（0-100）
        };
        let sharp_res =  await sharp(img_path)
          .resize(resizeOptions)
          .png(compressOptions)
          .toFile(compress_path);
        return true;
      },

      /**
       * 删除目录下所有不是以 ignore 命名的文件夹（包含文件夹中的文件）
       * @param {*} directory 
       * @param {*} ignore 
       */
      async deleteDir(directory, ignore) {
        if (fs.existsSync(directory)) {
          let files = fs.readdirSync(directory);
          for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const filePath = `${directory}\\${file}`;
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory() && file != ignore) {
              await rimraf(filePath);
            } 
          } 
        }
      }
     
    };
  },
  get lconst() {
    return {
      minute1: 60,
      minute2: 120,
      minute10: 600,
      hour1: 3600,
      hour2: 7200,
      hour3: 10800,
      day1: 86400,
      day2: 172800,
      day2_8: 241920,
      day15: 1296000,
      day28: 2419200,
      day30: 2592000,
      day60: 5184000,
      day179: 15465600,
      year1: 31104000,
      year2: 62208000,
    };
  },
};
