module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DoppelgangerSchema = new Schema({
    // 所属用户id
    user_id: { type: String },
    // 数字分身名称
    name: { type: String },
    // 类型 1 体验模式 2 高级模式
    type: { type: Number },
    // 用于训练的图片
    train_imgs: [{
        // 压缩图片地址
        compress_img: { type: String },
        // 原图地址
        origin_img: { type: String },
        // 格式化后的图片地址（用于训练）
        format_img: { type: String },
    }],
    // 训练好的模型文件地址
    model_file: { type: String },
    // 训练好的模型名称
    model_name: { type: String },
    // 创建时间
    create_time: { type: Number },
    // 训练开始时间
    train_start_time: { type: Number },
    // 训练结束时间
    train_end_time: { type: Number },
    // 训练状态 0:未开始 1:训练中 2:训练完成
    train_status: { type: Number },
    // 是否删除 0:未删除 1:已删除
    is_delete: { type: Number },
  });

  let schema = mongoose.model('Doppelganger', DoppelgangerSchema);

  return schema;
};
