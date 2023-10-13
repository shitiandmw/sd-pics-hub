const Controller = require('egg').Controller;

class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    // ctx.logger.debug(`[${socket.id}]exchange`,message);
    // ctx.logger.debug("client handshake",socket.handshake);
    // ctx.logger.debug("client rooms",socket.rooms);
    try {
      switch (message.action) {
        case 'state':
          await this.workerState(socket.id, message.data);
          break;
        case 'device_info':
          await this.updateDeviceInfo(socket.id, message.data);
          break;
        case 'task_result':
          await this.taskResult(socket.id, message.data);
          break;
        default:
          break;
      }
    } catch (error) {
      app.logger.error(error);
    }
  }

  /**
   * 处理工人发送的工作状态信息
   */
  async workerState(socket_id, data) {
    const { ctx, app } = this;
    // 记录上次数据是否有变化
    let cache_key = `workerState_${socket_id}`;
    // 加个锁，防止并发
    const selfMark = await app.redis.sLock(cache_key, 20);
    if (selfMark) {
      try {
        let data_key = ctx.ltool.md5(JSON.stringify(data));
        let data_old = await app.redis.sGet(cache_key, () => {
          return null;
        });
        let data_key_changed = !data_old || data_old.data_key != data_key;

        console.log(
          `[${socket_id}${(new Date()).valueOf()}]workerState`,
          data_key_changed ? data : 'no update'
        );

        // 如果上次的状态是发布任务，需要锁定状态，在工人回复接收或工作中之前，不能再次发布任务
        if (data_old && data_old.data.state == 1 && data.state < 1)
          data.state = 1;
        await app.redis.sSet(cache_key, { data_key: data_key, data: data },300)
        // 更新工人状态信息到数据库
        let work_info = await ctx.service.worker.updateWorkerState(
          socket_id,
          data
        );
        console.log(`work_info:${work_info!=null};data.state:${data.state};data.memory_info:${data.memory_info != '{}'}` )
        
        // 如果是空闲状态，尝试取任务
        if (data.state == 0 && work_info && data.memory_info != '{}') {
          for (let i = 0; i < work_info.task_types.length; i++) {
            let task = await ctx.service.task.popTaskFromQueue(
              work_info.task_types[i]
            );
            if (task) {
              let task_token = await ctx.service.task.createTaskToken(task);
              // 发送任务信息给工人
              ctx.socket.emit('message', {
                action: 'task',
                data: task,
                cos_host: app.config.tencent.cos.host || '',
                token: task_token,
              });
              // 记录工人状态
              data.state = 1;
              // 更新状态到数据库
              await ctx.service.worker.updateWorkerState(socket_id, {
                state: 1,
              });
              break;
            }
            else console.log("no task")
          }

        
        }

      } catch (error) {
      } finally {
        // 解锁
        app.redis.sUnLock(cache_key, selfMark);
      }
    }
  }

  /**
   * 更新设备信息
   * @param {*} socket_id
   * @param {*} data
   */
  async updateDeviceInfo(socket_id, data) {
    const { ctx, app } = this;
    let device_info = JSON.parse(data);
    console.log(`[${socket_id}]updateDeviceInfo`, device_info.Platform);
    await ctx.service.worker.updateDeviceInfo(socket_id, device_info);
  }


  /**
   * 更新任务结果 
   * @param {*} socket_id 
   * @param {*} data 
   */
  async taskResult(socket_id, data) {
    const { ctx, app } = this;
    let task_result = JSON.parse(data);
    console.log(`[${socket_id}]taskResult`, task_result);
    await ctx.service.task.updateTaskResult(task_result);

  }

}

module.exports = NspController;
