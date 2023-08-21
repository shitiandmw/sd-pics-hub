/**
 * 记录SD绘图工人端口情况的模型
 * @param {*} app 
 * @returns 
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const WorkSchema = new Schema({
        // 来源
        source: {type: String, default: ''},
        // 设备id
        device_id: {type: String, default: ''},
        // socket id
        socket_id: {type: String, default: ''},
        // 工作状态 0: 空闲 1: 已发布任务 2: 已接受任务 3: 工作中
        state: {type: Number, default: 0},
        // 可以接受的任务类型 1数字分身 2写真 3图片精修
        task_types : [
            {type: Number}
        ],
        // 最后一次连接时间
        last_heartbeat_time: {type: Number, default: 0},
        // 最后一次连接ip
        last_heartbeat_ip: {type: String, default: ''},
        // 设备信息
        device_info: {type:Object, default: {}},
        // 工作进度
        progress: {type:Object, default: {}},
        // 内存信息
        memory_info: {type:Object, default: {}},
        // 是否在线
        is_online: {type: Boolean, default: true},
    });
  
    
  
    let schema = mongoose.model('Worker', WorkSchema);
  
    return schema;
  };
  
  