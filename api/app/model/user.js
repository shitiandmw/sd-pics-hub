module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    account: {type: String,},
    nick_name: {type: String,},
    avatar:{ type:String ,},
    pwd: {type: String,},
    contact_num :{ type:String},

    reg_time: {type: Number,},
    reg_ip: {type: String,},

    last_login_ip: { type: String,},
    last_login_time: { type: Number,},

    // 好友列表
    friend_list: [],
    // 黑名单
    black_list: []

  });

  
  UserSchema.post('findOne', function (doc) {
    if (doc) {
      // 如果不存在avatar字段
      if (!('avatar' in doc) || !doc.avatar) {
        doc.avatar = "default_avatar";
      }
    }
  });

  let schema = mongoose.model('User', UserSchema);

  return schema;
};

