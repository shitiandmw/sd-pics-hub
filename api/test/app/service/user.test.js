const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', () => {
    let ctx;

    before(async () => {
      ctx = app.mockContext();
    });
  
    // it('testRedis()', async () => {
    //   const res = await ctx.service.user.testRedis();
    //   assert(res);
    // });
   
    // it('findUserbyId()', async () => {
    //     const user = await ctx.service.user.findUserbyId('6406a2de2150111ba8d98170');
    //     assert(user!=null && user.account == '284485094@qq.com');
    // });
  });