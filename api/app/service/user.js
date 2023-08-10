const { Service } = require('egg');

class UserSevice extends Service {
  /**
   * 验证用户token是否有效
   * @param {string} userid 用户id
   * @param {string} logintype 登录类型
   * @param {string} timestamp 时间戳
   * @param {string} signstr 签名
   * @param {object} data 签名的数据
   * @param {string} random 随机数 可不传
   * @returns
   */
  async verifyPermission(
    userid,
    logintype,
    timestamp,
    signstr,
    data,
    random = null
  ) {
    let fag = false;
    do {
      // console.log("signstr:",signstr)
      // console.log("timestamp:",timestamp)
      if (!userid || !timestamp || !signstr) break;
      // 获得token
      const token = await this.getSessionID(userid, logintype);
      if (!token) break;
      const signstr_local = this.ctx.ltool.sign(timestamp, token, data, random);
      if (signstr_local != signstr) break;

      fag = true;
    } while (false);
    return fag;
  }

  /**
   * 用户签名验证登陆
   * @param {object} input 登录信息
   * @param {string} ip 登录ip地址
   * @returns  登录是否成功
   */
  async userKeyLogin(input, ip) {
    const { ctx, app } = this;
    const nowtime = new Date().valueOf();

    // 验证连续登录次数，防止暴力登录
    const userVa = await app.redis.sGet(
      'userKeyLoginCheck_' + input.user_name,
      async () => {
        return null;
      }
    );
    if (userVa && userVa.FirstVaDate + 60 >= nowtime && userVa.FailCount >= 5)
      throw ctx.ltool.err('休息一会再试吧', 2001);

    // 前后端时间相差过大
    if (Math.abs(input.timestamp - nowtime) > 360000)
      throw ctx.ltool.err('登录失败', 2002);

    // 随机数不能使用多次
    const isRe = await app.redis.sGet(
      'userKeyLogin_random_number_' + input.random_number,
      async () => {
        return -1;
      },
      ctx.lconst.hour1
    );
    if (isRe > 0) throw ctx.ltool.err('登录失败', 2003);
    await app.redis.sSet(
      'userKeyLogin_random_number_' + input.random_number,
      1,
      360
    );

    // 获得用户信息
    const userinfo = await this.findByNameDB(input.user_name);
    if (!userinfo) throw ctx.ltool.err('您的账号或密码不正确', 2004);

    console.warn('userinfo', userinfo);
    const sign = ctx.ltool
      .sign(
        input.timestamp,
        userinfo.pwd,
        `username=${input.user_name}&random_number=${input.random_number}`
      )
      .toLowerCase();
    if (sign != input.user_key)
      throw ctx.ltool.err('您的账号或密码不正确', 2005);

    // 登陆成功后清空错误登陆的次数
    app.redis.del('userKeyLoginCheck_' + input.user_name);

    return userinfo;
  }

  /**
   * 注册账号
   * @param {*} input 用户信息
   * @param {string} ip ip地址
   * @returns 注册结果
   */
  async register(input, ip) {
    const { ctx, app } = this;

    // 获得用户信息
    const userinfo = await this.findByNameDB(input.account);
    if (userinfo) throw ctx.ltool.err('已经有这个账号了', 1004);

    let newuser = new ctx.model.User();

    newuser.account = input.account;
    newuser.nick_name = input.nick_name;

    // 处理一下密码
    newuser.pwd = ctx.ltool.md5(input.pwd).toLowerCase().substr(5, 23);

    // 设置注册时间和注册ip字段
    newuser.reg_time = new Date().valueOf();
    newuser.reg_ip = ip;

    // 生成一个随机的联系号码
    newuser.contact_num = await this.newContactNum();

    // 添加用户
    await newuser.save();

    return newuser;
  }

  /**
   * 获得一个新的联系号码（随机）
   */
  async newContactNum() {
    const { ctx } = this;
    let exist = false;
    let index = 0;
    let contactNum = '';
    while (true) {
      if (index >= 10) throw ctx.ltool.err('联系号码已用完，请修改此模块', 500);
      contactNum = this.ctx.ltool.nonceNumer(6);
      exist = await this.existContactNum(contactNum);
      if (!exist) break;
      index++;
    }
    return contactNum.toString();
  }

  /**
   * 是否已存在此联系号码
   * @param {string} num 联系号码
   * @returns
   */
  async existContactNum(num) {
    const userinfo = await this.ctx.model.User.findOne({ contact_num: num });
    if (userinfo) return true;
    else return false;
  }
  /**
   * 更新用户的登录token
   * @param {string} userid 用户id
   * @param {string} token_3rd_session token
   * @param {string} logintype 登录类型
   */
  async updateSessionID(userid, token_3rd_session, logintype) {
    await this.app.redis.sSet(
      `api_login_${logintype}_${userid}`,
      token_3rd_session,
      this.ctx.lconst.year1
    );
  }

  /**
   * 获得用户的登录token
   */
  async getSessionID(userid, logintype) {
    return await this.app.redis.sGet(
      `api_login_${logintype}_${userid}`,
      async () => {
        return '';
      }
    );
  }

  /**
   * 根据用户id获得用户信息
   * @param {string} userid 用户id
   * @returns
   */
  async findUserbyId(userid) {
    return await this.app.redis.sGet('user:' + userid, async () => {
      let user = await this.findUserByIdDB(userid);
      // 删除不用存在redis中的字段
      if (user) {
        user = user.toObject();
        delete user.friend_list;
      }
      return user;
    });
  }

  /**
   * 更新用户数据
   * @param {string} userid 用户id
   * @param {object} data 要更新的数据
   */
  async updateUserById(userid, data) {
    // 更新数据到数据库
    const result = await this.ctx.model.User.updateOne({ _id: userid }, data);
    // 清除缓存
    await this.app.redis.del('user:' + userid);
    if ('friend_list' in data)
      await this.app.redis.del('userfriendlist:' + userid);
    return result;
  }
  /**
   * 根据用户id获得用户信息
   * @param {string} userid 用户id
   * @returns
   */
  async findUserByIdDB(userid) {
    return await this.ctx.model.User.findOne({ _id: userid });
  }

  /**
   * 根据账号查找用户
   * @param {string} account 账号
   * @returns
   */
  async findByNameDB(account) {
    return await this.ctx.model.User.findOne({ account: account });
  }
  /**
   * 根据联系号码查找用户
   * @param {string} num 联系号码
   * @returns
   */
  async findByNumDB(num) {
    return await this.ctx.model.User.findOne({ contact_num: num });
  }

}

module.exports = UserSevice;
