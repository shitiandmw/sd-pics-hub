const { app, mock, assert } = require('egg-mock/bootstrap');
const path = require('path');


describe('test/app/service/doppelganger.test.js', () => {
  let ctx;

  before(async () => {
    ctx = app.mockContext();
  });

  // it('create()', async () => {
  //   let userid = "141151515";
  //   let train_imgs_ = await ctx.service.template.listFilesInFolder("\\file\\images\\doppelganger\\f1");
  //   let train_imgs = [];

  //   for(let i=0;i<train_imgs_.length;i++){
  //       let compress_img = `/r/doppelganger/${userid}/compress/${path.basename(train_imgs_[i])}`;
  //       let origin_img = `/r/doppelganger/${userid}/${path.basename(train_imgs_[i])}`;
  //       let format_img = `/r/doppelganger/${userid}/format/${path.basename(train_imgs_[i])}`;
  //       await ctx.service.tencentCos.uploadImage(
  //           train_imgs_[i],
  //           compress_img,
  //           350,0,85);
  //       await ctx.service.tencentCos.uploadImage(
  //           train_imgs_[i],
  //           origin_img,
  //           350,0,85);
  //       await ctx.service.tencentCos.uploadImage(
  //           train_imgs_[i],
  //           format_img,
  //           768,768,85);
  //       train_imgs.push({
  //           compress_img:compress_img,
  //           origin_img:origin_img,
  //           format_img:format_img,
  //       });
  //   }
    
  //   console.log("train_imgs",train_imgs)

  //   const res = await ctx.service.doppelganger.create(
  //       "1111",
  //       "数字分身111",
  //       1,
  //       train_imgs
  //   );
  //   console.log("create res:",res);
  //   assert(true);
  // });


});
