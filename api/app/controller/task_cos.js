'use strict';

const { Controller } = require('egg');

class TaskCosController extends Controller {
    async getToken(){
        this.ctx.body = await this.ctx.service.task.getTaskToken(this.ctx.query.token);
    }
}

module.exports = TaskCosController;
