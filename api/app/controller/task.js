/**
 * 任务相关（生成写真、高清修图等）
 */

'use strict';

const { Controller } = require('egg');

class TaskController extends Controller {
    
    async generatePortrait(){
        const { ctx, app } = this;
        const input = ctx.request.body;
        // 验证参数合法性
        const errors = app.validator.validate(
          {
            template_id: { type: 'string', required: true ,max: 24, min: 24},
            doopelganger_id: {type: 'string', required: true,max: 24, min: 24},
          },
          input
        );
        if (errors && errors.length > 0)
          throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);
        
        let task = await ctx.service.task.generatePortrait(ctx.user.id, input.template_id, input.doopelganger_id);
        if(!task) throw ctx.ltool.err('创建任务失败', 40012);
        ctx.body = task._id;
    }
    async getList(){
        const { ctx,app } = this;
        const input = ctx.request.query;
        // 验证参数合法性
        const errors = app.validator.validate(
         {
           last_id: { type: 'string' , required:false ,max: 24, min: 24},
         },
         input
       );
       if (errors && errors.length > 0)
         throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);
        let list = await ctx.service.task.getMyList(ctx.user.id,input.last_id);
        ctx.body = list;
    }

    async del(){
      const { ctx, app } = this;
      const input = ctx.request.body;
       // 验证参数合法性
       const errors = app.validator.validate(
        {
          id: { type: 'string', required: true ,max: 24, min: 24},
        },
        input
      );
      if (errors && errors.length > 0)
        throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 40011);
      return await ctx.service.task.del(input.id,ctx.user.id);
    }

    // async getInfo(){

    // }
}

module.exports = TaskController;

