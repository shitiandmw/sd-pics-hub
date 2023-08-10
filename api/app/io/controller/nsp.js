
const Controller = require('egg').Controller;

class NspController extends Controller {
    async exchange() {
      const { ctx, app } = this;
      const nsp = app.io.of('/');
      const message = ctx.args[0] || {};
      const socket = ctx.socket;
      const client = socket.id;
  
      ctx.logger.debug(`[${socket.id}]exchange`,message);
      // ctx.logger.debug("client handshake",socket.handshake);
      // ctx.logger.debug("client rooms",socket.rooms);
      try {
        // const { target, payload } = message;
        // if (!target) return;
        // const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
        // nsp.emit(target, msg);
      } catch (error) {
        app.logger.error(error);
      }
    }
  }
  
  module.exports = NspController;