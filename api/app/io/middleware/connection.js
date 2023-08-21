const PREFIX = 'room';
const ROOM = 'default_room';
module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    // socket.to(id).emit("welcome","你好靓仔，我是EGG");

    socket.emit('welcome', 'hello worker,i am shitian');
    socket.join(ROOM);
    const query = socket.handshake.query;
    logger.debug('#connent socket id', id);
    logger.debug('#connent socket query', query);
    const nsp = app.io.of('/');
    const tick = (id, msg) => {
      logger.debug('#tick', id, msg);

      // 踢出用户前发送消息
      socket.emit("message", helper.parseMsg('deny', msg));

      // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
      nsp.adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
      });
    };
    console.log("client query", query)
    // 验证失败，踢出用户
    if (app.config.io.token!=query.token){
      tick(id, {
        code: 401,
        message: '请先登录',
        data: null,
      });
      return;
    }
    // 记录工人上线
    await ctx.service.worker.workderOnline(
      query.device_id, 
      id, 
      socket.handshake.address, 
      query.source, 
      query.state,
      query.task_types);
    // 用户加入自己的房间
    socket.join(query.device_id);
    logger.debug('#join', query.device_id);
    // // 用户信息
    // const { room, userId } = query;
    // const rooms = [room];

    // logger.debug('#user_info', id, room, userId);

    // // 检查房间是否存在，不存在则踢出用户
    // // 备注：此处 app.redis 与插件无关，可用其他存储代替
    // const hasRoom = await app.redis.get(`${PREFIX}:${room}`);

    // logger.debug('#has_exist', hasRoom);

    // if (!hasRoom) {
    //   tick(id, {
    //     type: 'deleted',
    //     message: 'deleted, room has been deleted.',
    //   });
    //   return;
    // }

    // // 用户加入
    // logger.debug('#join', room);
    // socket.join(room);

    // // 在线列表
    // nsp.adapter.clients(rooms, (err, clients) => {
    //   logger.debug('#online_join', clients);

    //   // 更新在线用户列表
    //   nsp.to(room).emit('online', {
    //     clients,
    //     action: 'join',
    //     target: 'participator',
    //     message: `User(${id}) joined.`,
    //   });
    // });

    await next();

    // 用户离开
    logger.debug('#leave', `socketid: ${id}, device_id: ${query.device_id}`);
    // 记录工人下线
    await ctx.service.worker.workerOffline(id);
    // // 在线列表
    // nsp.adapter.clients(rooms, (err, clients) => {
    //   logger.debug('#online_leave', clients);

    //   // 获取 client 信息
    //   // const clientsDetail = {};
    //   // clients.forEach(client => {
    //   //   const _client = app.io.sockets.sockets[client];
    //   //   const _query = _client.handshake.query;
    //   //   clientsDetail[client] = _query;
    //   // });

    //   // 更新在线用户列表
    //   nsp.to(room).emit('online', {
    //     clients,
    //     action: 'leave',
    //     target: 'participator',
    //     message: `User(${id}) leaved.`,
    //   });
    // });
  };
};
