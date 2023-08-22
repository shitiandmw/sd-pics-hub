// 验证权限
async function verifyPermission(ctx) {
  let fag = false;
  do {
    // 控制器 account、default 下的接口不需要认证
    const ignore = ['/account/','/default/','/task_cos/'];
    console.log("ctx.request.url",ctx.request.url)
    console.log("ctx.request.url",ctx.request.url == '/')
    for (let index = 0; index < ignore.length; index++) {
      const route = ignore[index];
      if (ctx.request.url.indexOf(route) == 0 || ctx.request.url == '/') {
        fag = true;
        break;
      }
    }

    if (fag == true) break;
    
    fag = await ctx.service.user.verifyPermission(
      ctx.request.header.userid,
      ctx.request.header.logintype || 'web',
      ctx.request.header.timestamp,
      ctx.request.header.signstr,
      ctx.request.method == 'POST' ? ctx.request.body : ctx.request.query
    );

    if (!fag) break;

    ctx.user = {
      id: ctx.request.header.userid,
      logintype: ctx.request.header.logintype || 'web',
    };
  } while (false);
  return fag;
}


module.exports = options => {
  return async function responseHandler(ctx, next) {
    let code = 1;
    try {
      // 打印domain
      console.warn(`[${ctx.request.method}]${ctx.request.url}`);
      let auth_res =  await verifyPermission(ctx);
      if (!auth_res) {
        code = 401;
        throw new Error('请先登录');
      }
      await next();
      if (ctx.status == 404) {
        code = 404;
        throw new Error('接口路径错误');
      }

      ctx.body = {
        status: 'Success',
        code: code,
        message: '',
        data: ctx.body ? ctx.body : '',
      };
    } catch (err) {
      ctx.body = {
        status: 'Fail',
        code: err.code || code || ctx.status || 500,
        // code: 4001,
        message: err.message,
        data: null,
      };
      ctx.status = 200;
    }
  };
};
