const { Service } = require('egg');

class WorkerSevice extends Service {
  /**
   * 工人上线
   * @param {*} device_id  设备id
   * @param {*} socket_id  socket id
   * @param {*} address  ip地址
   * @param {*} source 来源
   * @param {*} state 状态
   */
  async workderOnline(device_id, socket_id, address, source, state,task_types) {
    // 是否已经存在这个设备的数据
    let worker = await this.ctx.model.Worker.findOne({ device_id: device_id });
    if (!worker) worker = new this.ctx.model.Worker();
    worker.device_id = device_id;
    worker.socket_id = socket_id;
    worker.source = source;
    worker.state = state;
    worker.last_heartbeat_time = Date.now();
    worker.last_heartbeat_ip = address;
    worker.task_types = task_types?JSON.parse(task_types):[];
    worker.is_online = true;
    await worker.save();
  }

  /**
   * 工人状态更新
   * @param {*} socket_id
   * @param {*} data
   * @returns
   */
  async updateWorkerState(socket_id, data) {
    const { ctx } = this;
    let result = null;
    // 更新工人状态信息到数据库
    let worker = await ctx.model.Worker.findOne({ socket_id: socket_id });
    if (worker) {
      worker.state = data.state;
      if (data.memory_info && data.memory_info != '{}')
        worker.memory_info = JSON.parse(data.memory_info);
      if (data.progress && data.progress != '{}') worker.progress = JSON.parse(data.progress);
      worker.is_online = true;
      worker.save();
      result = worker;

      // 更新工人状态信息到缓存
      this.updateWorkerInfoToCache(worker);
    }

    // socket 发布状态更新 undo
    return result;
  }

  /**
   * 更新工人信息到缓存
   * @param {*} worker 
   */
  async updateWorkerInfoToCache(worker) {
    delete worker.device_info.Config;
    delete worker.device_info.Packages;
    delete worker.device_info.Extensions;
    this.app.redis.sSet(`worker_${worker.device_id}`, worker,300);
    this.app.redis.sSet(`worker_${worker.socket_id}`, worker,300);
  }

  /**
   * 更新设备信息
   * @param {*} socket_id
   * @param {*} data
   * @returns
   */
  async updateDeviceInfo(socket_id, device_info) {
    const { ctx } = this;
    let result = null;
    // 更新设备信息到数据库
    let worker = await ctx.model.Worker.findOne({ socket_id: socket_id });
    if (worker) {
      worker.device_info = device_info;
      worker.save();
      result = worker;
      // 更新工人状态信息到缓存
      this.updateWorkerInfoToCache(worker);
    }

    // socket 发布状态更新 undo
    return result;
  }

  /**
   * 工人下线
   * @param {*} socket_id
   * @returns
   */
  async workerOffline(socket_id) {
    const { ctx } = this;
    let result = false;
    let worker = await ctx.model.Worker.findOne({ socket_id: socket_id });
    if (worker) {
      worker.is_online = false;
      worker.save();
      result = true;
      // 更新工人状态信息到缓存
      this.updateWorkerInfoToCache(worker);
    }

    // socket 发布工人下线通知
    return result;
  }
}

module.exports = WorkerSevice;
