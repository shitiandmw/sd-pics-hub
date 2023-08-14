const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/service/tencent_cos.test.js', () => {
  let ctx;

  before(async () => {
    ctx = app.mockContext();
  });

  // it('getToken()', async () => {
  //   const res = await ctx.service.tencentCos.getToken("/r/*");
  //   assert(true);
  // });

 
  it('uploadFile()', async () => {
    // 获得程序运行目录
    let path = app.baseDir+"\\file\\images\\f4.png";
    let cos_path = "/r/2023081411/f5.png";
    const res = await ctx.service.tencentCos.uploadFile(path,cos_path);
    console.log("res",res);
    assert(true);
  });

});
