const { Service } = require("egg");
const path = require("path");
const fs = require("fs");

class DoppelgangerSevice extends Service {
  /**
   * 下载图片并压缩上传，获得压缩的图片地址
   * @param {*} url 远程图片地址(不带域名时默认使用cos域名)
   * @param {*} cos_path cos上传路径（不要带图片名称）
   * @param {*} width 
   * @param {*} height 
   * @param {*} quality 
   * @returns 
   */
  async compressUploadImg(url,cos_path,width, height, quality) {
    let {ctx,app} = this;
    // 系统文件分割符
    let __ = path.sep;
    let day = ctx.ltool.formatTime2(new Date().valueOf(), "YYYYMMDD");
    // 定义下载路径
    let download_path = this.app.baseDir + `${__}tmp${__}download`;
    // 删除临时压缩目录下所有不是以 day 命名的文件夹 , 节省空间
    await ctx.ltool.deleteDir(download_path, day);
    download_path += `${__}${day}`;
    // 若不存在，则创建此目录
    if (!fs.existsSync(download_path))
      fs.mkdirSync(download_path, { recursive: true });
    if (!url.startsWith('http://') && !url.startsWith('https://'))
      url = app.config.tencent.cos.host + url;
    // 下载图片到指定的目录（1分钟内不重复下载）
    let downloadFileName = await this.app.redis.sGet('download:' + ctx.ltool.md5(url), async () => {
      return await ctx.ltool.downloadImg(
        url,
        download_path
      );
    });
    let compress_img = `${cos_path}${downloadFileName}`;
    let system_img = `${download_path}${__}${downloadFileName}`;
    await ctx.service.tencentCos.uploadImage(
      system_img,
      compress_img,
      width,height,quality);
    return compress_img;
  }

  /**
   * 创建数字分身
   * @param {*} user_id
   * @param {*} name
   * @param {*} type
   * @param {*} train_imgs
   */
  async create(user_id, name, type, train_imgs) {
    if (!name) {
      let user = await this.ctx.service.user.findUserbyId(user_id);
      let count = await this.getUserCount(user_id);
      name = `${user.nick_name}的数字分身${count + 1}`;
    }
    let data = {
      user_id: user_id,
      name: name,
      type: type,
      train_imgs: train_imgs,
      model_file: "",
      model_name: "",
      create_time: new Date().getTime(),
      train_start_time: 0,
      train_end_time: 0,
      train_status: 0,
      is_delete: 0,
    };
    let doppelganger = new this.ctx.model.Doppelganger(data);
    let result = await doppelganger.save();
    return result;
    // 创建训练任务需要在支付成功后执行 （测试阶段直接开启）
  }

  /**
   * 获得用户的数字分身列表
   * @param {*} user_id
   */
  async getList(user_id) {
    return await this.ctx.model.Doppelganger.find(
      { user_id: user_id, is_delete: 0 },
      "name type train_imgs train_status"
    );
  }

  /**
   * 获得数字分身详情
   * @param {*} id
   * @returns
   */
  async getInfo(id) {
    return await this.ctx.model.Doppelganger.findOne({ _id: id, is_delete: 0 });
  }

  /**
   * 删除数字分身
   * @param {*} id
   * @returns
   */
  async del(id) {
    return await this.ctx.model.Doppelganger.updateOne(
      { _id: id },
      { is_delete: 1 }
    );
  }

  /**
   * 获得某用户的数字分身数量
   * @param {*} user_id
   * @returns
   */
  async getUserCount(user_id) {
    return await this.ctx.model.Doppelganger.countDocuments({
      user_id: user_id,
      is_delete: 0,
    });
  }
}

module.exports = DoppelgangerSevice;
