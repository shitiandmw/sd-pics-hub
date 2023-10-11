/**
 * 数字分身相关
 */

'use strict';

const { Controller } = require('egg');

class DoppelgangerController extends Controller {

  async create() {
    const { ctx, app } = this;
    const input = ctx.request.body;
    // 验证参数合法性
    const errors = app.validator.validate(
      {
        // name: { type: 'string', max: 50},
        type: {type: 'enum', values: [1, 2]},
        train_imgs: { type: 'array', required: true, itemType: 'string', rule : { type:'string', allowEmpty: false} },
      },
      input
    );
    if (errors && errors.length > 0)
      throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);
    
    let doppelganger = await ctx.service.doppelganger.create(ctx.user.id, input.name, input.type, input.train_imgs);
    if(!doppelganger) throw ctx.ltool.err('创建数字分身失败', 40012);
    ctx.body = doppelganger._id;

  }
  
  async getList() {
    const { ctx } = this;
    let list = await ctx.service.doppelganger.getList(ctx.user.id);
    ctx.body = list;
  }

  async getCosToken(){
    const { ctx , app } = this;
    const input = ctx.request.query;
    // 验证参数合法性
    const errors = app.validator.validate(
      {
        ext: {type: 'enum', values: ["jpg", "jpeg", "png", "gif", "bmp"],required: true}
      },
      input
    );
    if (errors && errors.length > 0)
      throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);
    
    let res = await ctx.service.tencentCos.getUniDoppelgangerUploadInfo(ctx.user.id,input.ext);
    ctx.body = res;
  }
}

module.exports = DoppelgangerController;
