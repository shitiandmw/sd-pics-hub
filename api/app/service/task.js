const { Service } = require('egg');

class TaskSevice extends Service {
  /**
   * 创建数字分身
   */
  async createDigitalAvatar(user_id) {}

  /**
   * 创建写真任务
   * @param {*} user_id 用户id
   * @param {*} template_id 模板id
   * @param {*} doopelganger_id 数字分身id
   * @returns
   */
  async generatePortrait(user_id, template_id, doopelganger_id) {
    const { ctx } = this;
    let template = await this.ctx.service.template.detail(template_id);
    if (!template) throw ctx.ltool.err('模板不存在', 10001);

    // 每个人暂时只能有一个正在执行的同类型任务
    let task_count = await this.ctx.model.Task.count({
      user_id: user_id,
      type: 2,
    });
    if (task_count >= 1)
      throw ctx.ltool.err(
        '您有一个写真任务正在进行，请等待任务完成后再创建新的任务',
        10002
      );

    // 验证数字分身是否属于当前用户
    let doopelganger = await this.ctx.model.Doppelganger.findOne({
      _id: doopelganger_id,
      user_id: user_id,
    });
    if (!doopelganger) throw ctx.ltool.err('数字分身不存在', 10003); 
    
    let task = new this.ctx.model.Task({
      user_id: user_id,
      first_img: {
        compress_img: template.imgs[0].compress_img,
        origin_img: template.imgs[0].origin_img,
      },
      type: 2,
      status: 0,
      params: {
        template_id: template_id,
        doopelganger_id: doopelganger_id,
        template: template,
        doopelganger: doopelganger,
      },
      create_time: new Date().getTime(),
    });

    let result = await task.save();

    // 添加到任务队列
    await this.addTaskToQueue(result);
    return result;
  }

  /**
   * 创建高清修图任务
   */
  async enhanceHDImage() {}

  /**
   * 添加任务到队列
   * @param {*} task_info 任务信息
   */
  async addTaskToQueue(task_info) {
    // 以时间戳的反序为分数，任务id为值，添加到任务队列
    const { app } = this;
    if (!task_info || !task_info._id || !task_info.type)
      throw this.ctx.ltool.err('任务信息不完整', 20001);

    return await app.redis.lpush(
      'task_queue_' + task_info.type,
      task_info._id.toString(),
     );
  }

  /**
   * 获得任务排名
   * @param {*} task_info
   */
  async getTaskRanking(task_info) {
    const { app } = this;
    if (!task_info || !task_info._id || !task_info.type)
      throw this.ctx.ltool.err('任务信息不完整', 20001);
    
    let index = app.redis.lpos(
      'task_queue_' + task_info.type,
      task_info._id.toString()
    );
    
    if(typeof index == "undefined" || index == null ) return -1;
    return app.redis.llen('task_queue_' + task_info.type) - index;
  }

  /**
   * 从队列中弹出一个任务，并加入到执行队列
   * @param {*} type 
   * @returns 
   */
  async popTaskFromQueue(type) {
    const { app } = this;
    let task_id = await app.redis.rpoplpush(
      'task_queue_' + type,
      'task_queue_doing_' + type
    );

    if (!task_id) return null;

    let result = await this.ctx.model.Task.findOne({_id: task_id});
    // 记录任务开始时间 
    result.start_time = new Date().getTime();
    result.status = 1;
    await result.save();
    return result;
  }

  async getTaskInfo(task_id){
    return  await this.ctx.model.Task.findOne({_id: task_id});
  }
  /**
   * 清理任务队列
   * 主要是从doing队列中把任务加入到有序队列中，方便将超时的任务重新加入到任务队列中  
   * @param {*} type 
   */
  async clearTaskQueue(type){
    const { app } = this;
    let timeout = this.getTimeout(type);
    
    let tasks = [];
    while(true){
      let task_id = await app.redis.lpop('task_queue_doing_' + type);
      if(!task_id) break;
      tasks.push(task_id);
      if(tasks.length >= 1000) break;
    }
    
    if(tasks) {
      for(let i=0; i<tasks.length; i++){
        let task_id = tasks[i];
        let task = await this.ctx.model.Task.findOne({_id: task_id});
        if(task) await app.redis.zadd('reload:task_queue_doing_' + type, task.start_time + timeout, task_id);
      }
    }
    return tasks.length;    
  }

  /**
   * 将超时任务重新加入到任务队列中
   * @param {*} type 
   */
  async addTimeoutTaskToQueue(type){
    const { app } = this;
    let now = new Date().getTime();
    let tasks = await app.redis.zrangebyscore('reload:task_queue_doing_' + type, 0, now);
    await app.redis.zremrangebyscore('reload:task_queue_doing_' + type, 0, now);
    if(tasks){
      for(let i=0; i<tasks.length; i++){
        let task_id = tasks[i];
        let task = await this.ctx.model.Task.findOne({_id: task_id});
        if(task){
          await app.redis.lpush('task_queue_' + type, task_id);
          task.status = 3;
          await task.save();
        }
      }
    }
    return tasks.length;
  }

  getTimeout(type){
    let timeout = 0;
    switch(type){
      // 1 训练数字分身 超时时间 3个小时
      case 1:
        timeout = 3 * 60 * 60 * 1000;
        break;
      // 2 生成写真 超时时间 10分钟
      case 2:
        timeout = 10 * 60 * 1000;
        break;
      // 3 图片精修 超时时间 30分钟
      case 3:
        timeout = 30 * 60 * 1000;
        break;
    }
    return timeout;
  }
  /**
   * 获得我的任务列表
   */
  async getList(user_id) {}
}

module.exports = TaskSevice;
