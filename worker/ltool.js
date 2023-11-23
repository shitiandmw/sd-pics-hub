const { rimraf } = require('rimraf');
const sharp = require('sharp');
const fs = require('fs');
const moment = require('moment');
const Crypto = require('crypto');
const path = require('path');

exports.compressImg = async function (
  img_path,
  compress_path,
  width,
  height,
  quality
) {
  // compress_path 文件是否已经存在
  if (fs.existsSync(compress_path)) return true;
  // 原图是否存在
  if (!fs.existsSync(img_path)) return false;
  // 压缩目录是否存在
  let compress_dir_path = path.dirname(compress_path);
  if (!fs.existsSync(compress_dir_path))
    fs.mkdirSync(compress_dir_path, { recursive: true });

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
  await sharp(img_path)
    .resize(resizeOptions)
    .png(compressOptions)
    .toFile(compress_path);
  return true;
};

exports.deleteDir = async function (directory, ignore) {
  if (fs.existsSync(directory)) {
    let files = fs.readdirSync(directory);
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const filePath = `${directory}${path.sep}${file}`;
      const fileStat = fs.statSync(filePath);
      if (fileStat.isDirectory() && file != ignore) {
        await rimraf(filePath);
      }
    }
  }
};

exports.formatTime2 = function (timestamp, format) {
  if (!format) format = 'YYYY-MM-DD HH:mm:ss';
  let result = new Date();
  if (typeof timestamp == 'number') result = new Date(timestamp);
  result = moment(result).format(format);
  return result;
};

exports.uuid = function (){
    return Crypto.randomUUID();
}
