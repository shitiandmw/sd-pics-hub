const { Service } = require('egg');

class DoppelgangerSevice extends Service {
  /**
   * 创建数字分身
   * @param {*} user_id 
   * @param {*} name 
   * @param {*} type 
   * @param {*} train_imgs 
   */
  async create(user_id, name, type, train_imgs){
    if(!name)
    {
      let user = await this.ctx.service.user.findUserbyId(user_id);
      let count = await this.getUserCount(user_id);
      name = `${user.nick_name}的数字分身${count+1}`;
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
      is_delete: 0
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
  async getList(user_id){
    return await this.ctx.model.Doppelganger.find({user_id:user_id, is_delete:0},"name type train_imgs train_status");
  }



  /**
   * 获得数字分身详情
   * @param {*} id 
   * @returns 
   */
  async getInfo(id){
    return await this.ctx.model.Doppelganger.findOne({_id:id, is_delete:0});
  }

  /**
   * 删除数字分身
   * @param {*} id 
   * @returns 
   */
  async del(id){
    return await this.ctx.model.Doppelganger.updateOne({_id:id}, {is_delete:1});
  }

  /**
   * 获得某用户的数字分身数量
   * @param {*} user_id 
   * @returns 
   */
  async getUserCount(user_id){
    return await this.ctx.model.Doppelganger.countDocuments({user_id:user_id, is_delete:0});
  }
}

module.exports = DoppelgangerSevice;
