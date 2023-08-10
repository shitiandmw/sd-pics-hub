'use strict';

const { Controller } = require('egg');

class DefaultController extends Controller {
    async getnowtime() {
        this.ctx.body = new Date().getTime();
    }
    async test() {
        const { ctx , app} = this;
        const user = await this.ctx.service.user.findByNameDB('284485094@qq.com');
        ctx.body = user?user:"";
    }

    async pubChat() {
        const { ctx, app } = this;
        const { messages} = ctx.request.body;
        const result = await ctx.service.chatgpt.SendMsg(messages);
        ctx.body = result;
      }
}

module.exports = DefaultController;