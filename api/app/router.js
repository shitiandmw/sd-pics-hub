'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io  } = app;
  router.get('/', controller.home.index);
  // 手机号验证码登录
  router.post('/account/phone_login', controller.account.phoneLogin);
  router.post('/account/send_sms', controller.account.sendSMS);

  /**---------------- 写真模板 ----------------**/
  router.get('/template/list', controller.template.getList);       // 获取模板列表
  router.get('/template/info', controller.template.getInfo);       // 获取模板详情

  
  /**---------------- 数字分身 ----------------**/
  router.post('/doppelganger/create', controller.doppelganger.create); // 创建数字分身
  router.post('/doppelganger/list', controller.doppelganger.getList);    // 查看数字分身列表

  /**---------------- 任务相关 ----------------**/
  router.post('/task/create', controller.task.create); // 创建任务 (生成写真、高清修图)
  router.post('/task/list', controller.task.getList);  // 查看任务列表
  router.post('/task/info', controller.task.getInfo);  // 查看任务详情
  

  router.post('/account/register', controller.account.register);
  router.post('/account/userkey_login', controller.account.login);
  router.get('/default/getnowtime', controller.default.getnowtime);
  router.get('/default/test', controller.default.test);
  router.post('/default/test', controller.default.test);

  router.get('/user/myinfo', controller.user.getMyInfo);
  router.get('/user/getuser', controller.user.getUserInfoById);
  

  // socket.io
  io.of('/').route('exchange', io.controller.nsp.exchange);
};
