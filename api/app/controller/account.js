'use strict';

const { Controller } = require('egg');

class AccountController extends Controller {

  /**
   * 验证码登录
   */
  async phoneLogin() {

  }

  /**
   * 发送短信验证码
   */ 
  async sendSMS() {

  }

  /**
   * 登录账号
   */
  async login() {
    const { ctx, app, service } = this;
    const input = ctx.request.body;
    // 验证参数合法性
    const errors = app.validator.validate(
      {
        user_name: { type: 'string', required: true },
        timestamp: { type: 'number', required: true },
        random_number: { type: 'number', required: true },
        user_key: { type: 'string', max: 32, min: 32, required: true },
      },
      input
    );
    if (errors && errors.length > 0)
      throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 4011);

    // 验证登录信息合法性
    const userinfo = await ctx.service.user.userKeyLogin(input, ctx.request.ip);
    const token_3rd_session = ctx.ltool.nonceString(22);

    // 更新用户登录token
    await ctx.service.user.updateSessionID(
      userinfo.id,
      token_3rd_session,
      input.logintype
    );

    //返回信息
    ctx.body = {
      token: token_3rd_session,
      userid: userinfo.id,
      logintype: input.logintype,
    };
  }
  /**
   * 注册账号
   */
  async register() {
    const { ctx, app } = this;
    const { account, nick_name, pwd, logintype } = ctx.request.body;
    const input = { account, nick_name, pwd ,logintype};

    // 验证参数合法性
    const errors = app.validator.validate(
      {
        account: { type: 'string', required: true },
        nick_name: { type: 'string', required: true },
        pwd: { type: 'password', required: true ,message:"密码格式不正确" },
      },
      input
    );
    if (errors && errors.length > 0)
      throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 4011);

    // 尝试注册
    const userinfo = await ctx.service.user.register(input, ctx.request.ip);

    // 生成token
    const token_3rd_session = ctx.ltool.nonceString(22);
    // 更新用户登录token
    await ctx.service.user.updateSessionID(
      userinfo.id,
      token_3rd_session,
      input.logintype
    );

    //返回信息
    ctx.body = {
      token: token_3rd_session,
      userid: userinfo.id,
      logintype: input.logintype,
    };
  }
}

module.exports = AccountController;
