'use strict';

const { Controller } = require('egg');
const { v4:uuid } = require('uuid');

class HomeController extends Controller {
  async index() {
    const { ctx , app} = this;
    const nsp = app.io.of('/');
    // app.redis.sGet("lalal",100,async ()=>{ 
    //   return (new Date()).valueOf();
    // });
    // const selfMark = await app.redis.sLock("test1",20);
    // if(selfMark){
    //   setTimeout(() => {
    //     app.redis.sUnLock("test1",selfMark)
    //   }, 2000);
    // }
    // console.log(app.cerror.g("dsfsfd",1111))
    // throw ctx.ltool.err("dsfsdf",100);
    const clients =  nsp.adapter.clients('default_room', (err, clients) => {
    ctx.logger.warn('##########online_leave', clients.length);

      // 获取 client 信息
      // const clientsDetail = {};
      // clients.forEach(client => {
      //   const _client = app.io.sockets.sockets[client];
      //   const _query = _client.handshake.query;
      //   clientsDetail[client] = _query;
      // });

      // // 更新在线用户列表
      // nsp.to(room).emit('online', {
      //   clients,
      //   action: 'leave',
      //   target: 'participator',
      //   message: `User(${id}) leaved.`,
      // });
    });
    nsp.to('default_room').emit('welcome',"靓仔，现在是"+ Date.now())
    // throw new Error("test",{code:9808})
    // ctx.body = ctx.ltool.md5("dsfdsffs");
    // ctx.body = uuid();
    let numbers = [];
    for (let index = 0; index < 100; index++) {
      numbers.push(ctx.ltool.nonceString(22,false,"abc"));
    }
    ctx.body = numbers;  
  }
}

module.exports = HomeController;
