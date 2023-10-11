/**
 * 数字分身相关
 */

"use strict";

const { Controller } = require("egg");

class DoppelgangerController extends Controller {
  async create() {
    const { ctx, app } = this;
    const input = ctx.request.body;
    // 验证参数合法性
    const errors = app.validator.validate(
      {
        // name: { type: 'string', max: 50},
        type: { type: "enum", values: [1, 2] },
        train_imgs: {
          type: "array",
          required: true,
          itemType: "string",
          rule: { type: "string", allowEmpty: false },
        },
      },
      input
    );
    if (errors && errors.length > 0)
      throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);

    // 压缩图片（这里比较耗时，后期可以考虑放到队列中）
    let train_imgs = [];
    for (let index = 0; index < input.train_imgs.length; index++) {
      let origin_img = input.train_imgs[index];
      let compress_img_path = `/r/doppelganger/${ctx.user.id}/compress/`;
      let format_img_path = `/r/doppelganger/${ctx.user.id}/format/`;
      let compress_img = await ctx.service.doppelganger.compressUploadImg(
        origin_img,
        compress_img_path,
        350,
        0,
        85
      );
      let format_img = await ctx.service.doppelganger.compressUploadImg(
        origin_img,
        format_img_path,
        768,
        768,
        85
      );
      train_imgs.push({
        compress_img: compress_img,
        origin_img: origin_img,
        format_img: format_img,
      });
    }

    let doppelganger = await ctx.service.doppelganger.create(
      ctx.user.id,
      input.name,
      input.type,
      train_imgs
    );
    if (!doppelganger) throw ctx.ltool.err("创建数字分身失败", 40012);
    ctx.body = doppelganger._id;
  }

  async getList() {
    const { ctx } = this;
    let list = await ctx.service.doppelganger.getList(ctx.user.id);
    ctx.body = list;
  }

  async getCosToken() {
    const { ctx, app } = this;
    const input = ctx.request.query;
    // 验证参数合法性
    const errors = app.validator.validate(
      {
        ext: {
          type: "enum",
          values: ["jpg", "jpeg", "png", "gif", "bmp"],
          required: true,
        },
      },
      input
    );
    if (errors && errors.length > 0)
      throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);

    let res = await ctx.service.tencentCos.getUniDoppelgangerUploadInfo(
      ctx.user.id,
      input.ext
    );
    ctx.body = res;
  }
}

module.exports = DoppelgangerController;
