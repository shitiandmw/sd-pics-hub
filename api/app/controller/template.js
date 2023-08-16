/**
 * 写真模板相关
 */

'use strict';
const { Controller } = require('egg');

class TemplateController extends Controller {
    /**
     * 初始化模板
     */
    async getList(){
        let page = this.ctx.request.query.page || 1;
        let result = await this.ctx.service.template.list(page);
        this.ctx.body = result || {};
    }
    /**
     * 获得模板详情
     */
    async getInfo(){
        let id = this.ctx.request.query.id;
        let result = await this.ctx.service.template.info(id);
        this.ctx.body = result || {};
    }
}

module.exports = TemplateController;
