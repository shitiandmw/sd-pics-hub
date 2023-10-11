const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/service/template.test.js', () => {
    let ctx;

    before(async () => {
      ctx = app.mockContext();
    });
  
    // it('compressImg()', async () => {
    //   const res =await ctx.ltool.compressImg(app.baseDir + '\\file\\images\\template\\XZ_00003\\output-1692065853-2.png' , app.baseDir + '\\file\\images\\template\\XZ_00003\\compress\\output-1692065853-2.png', 350,0,85);
    //   console.log("res",res);
    //   assert(true);
    // });

    // it('init()', async () => {
    //   const res = await ctx.service.template.init();
    //   console.log("res",res);
    //   assert(true);
    // });
   
    // it('list()', async () => {
    //   const res = await ctx.service.template.list();
    //   console.log("res",res);
    //   assert(true);
    // });
    
    // it('info()', async () => {
    //   const res = await ctx.service.template.info("64daf1c3ec9f0c3cdcc5c688");
    //   console.log("res",res);
    //   assert(true);
    // });
    // it('findUserbyId()', async () => {
    //     const user = await ctx.service.user.findUserbyId('6406a2de2150111ba8d98170');
    //     assert(user!=null && user.account == '284485094@qq.com');
    // });
  });