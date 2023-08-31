module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TaskSchema = new Schema({
    user_id: {type:String},
    // 任务名称
    name: { type: String },
    // 任务首图
    first_img: {
      // 压缩图片地址
      compress_img: { type: String },
      // 原图地址
      origin_img: { type: String },
    },
    // 任务类型 1 训练数字分身 2 生成写真 3 图片精修
    type: { type: Number },
    // 任务状态 0:未开始 1:进行中 2:已完成 3:任务执行超时，正在重新安排执行 4:任务执行失败 
    status: { type: Number },
    // 任务参数
    params: { type: Object },
    // 任务创建时间
    create_time: { type: Number },
    // 任务开始时间
    start_time: { type: Number },
    // 任务结束时间
    end_time: { type: Number },
    // 任务执行者
    executor: { type: String },
    // 任务执行结果 (图片)
    result: [
      {
        // 压缩图片地址
        compress_img: { type: String },
        // 原图地址
        origin_img: { type: String },
        // 高清化，精修处理后的图片地址
        hd_img: { type: String },
      },
    ],
    // 任务执行结果备注
    result_remark: { type: String },
    // 任务排名 （获取数据的时候从redis中获取）
    rank: { type: Number },
  });

  let schema = mongoose.model('Task', TaskSchema);

  return schema;
};
