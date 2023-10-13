'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io  } = app;
  router.get('/', controller.home.index);
  // 手机号验证码登录 （短信成本过高，暂时不做）
  router.post('/account/phone_login', controller.account.phoneLogin);
  router.post('/account/send_sms', controller.account.sendSMS);

  /**---------------- 写真模板 ----------------**/
  router.get('/template/list', controller.template.getList);       // 获取模板列表
  router.get('/template/info', controller.template.getInfo);       // 获取模板详情

  
  /**---------------- 数字分身 ----------------**/
  router.post('/doppelganger/create', controller.doppelganger.create); // 创建数字分身
  router.get('/doppelganger/list', controller.doppelganger.getList);    // 查看数字分身列表
  router.get('/doppelganger/getcostoken', controller.doppelganger.getCosToken); 

  /**---------------- 任务相关 ----------------**/
  router.post('/task/generate_portrait', controller.task.generatePortrait); // 创建任务写真任务
  router.get('/task/list', controller.task.getList);  // 查看任务列表
  router.post('/task/del', controller.task.del);  // 删除任务
  // router.get('/task/info', controller.task.getInfo);  // 查看任务详情

  /**---------------- cos相关 ----------------**/
  router.get('/task_cos/gettoken', controller.taskCos.getToken);  // 获得任务的cos上传临时token
  

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
