module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const TemplateSchema = new Schema({
        // 模板图片
        imgs:[
            {type: String,}
        ],
        // 模板名称
        name: {type: String,},
        // 模板描述
        desc:{ type:String ,},
        // 模板类型
        type: {type: String,},
        // 模板标签
        tags:[
            {type: String,}
        ],
        // 模板创建人
        creator: {type: String,},
        // 模板创建时间
        create_time: {type: Number,},

        // 模板参数
        params: { type: Object, },

        // 热度（使用次数）
        hot: { type: Number, default: 0 },
    });
  
    
  
    let schema = mongoose.model('Template', TemplateSchema);
  
    return schema;
  };
  
  