const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/service/template.test.js', () => {
    let ctx;

    before(async () => {
      ctx = app.mockContext();
    });
  
    it('create()', async () => {
      let template_info = {
        name:"雪山写真"
      };
      const res = await ctx.service.template.create(template_info);
      console.log("res",res);
      assert(true);
    });
   
    // it('findUserbyId()', async () => {
    //     const user = await ctx.service.user.findUserbyId('6406a2de2150111ba8d98170');
    //     assert(user!=null && user.account == '284485094@qq.com');
    // });
  });