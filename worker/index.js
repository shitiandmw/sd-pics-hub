/**
 * 工人找事做的模式
 * 由worker告诉服务器我处于空闲状态/工作状态
 * 服务器收到信息，安排工作
 */
const io = require('socket.io-client');
// 状态 0 空闲 1 工作
let worker_state = 0;
let worker_thread = null;

// 每隔一段时间更新当前工人的状态给服务器
function scheduleUpdate() {
  updState(socket);
  if (worker_thread) clearTimeout(worker_thread);
  worker_thread = setTimeout(() => {
    scheduleUpdate(socket);
  }, 10000);
}
/**
 * 更新状态
 * @param {*} socket_
 * @returns
 */
function updState(socket_) {
  socket_.emit('exchange', {
    action: 'state',
    data: worker_state,
  });
}

const socket = io('http://127.0.0.1:7002', {
  autoConnect: true,
  query: {
    token: '123456',
    source: 'aliyun',
    // 随机一个id
    deviceid: 'aliyun_' + Math.random().toString(36).substr(2),
  },
});
socket.on('connect', data => {
  console.log('connect', data);
  scheduleUpdate(socket);
});
socket.on('disconnect', data => {
  console.log('### disconnect', data);
});
socket.on('disconnect', data => {
  console.log('### disconnect', data);
});
socket.on('connect_timeout', data => {
  console.log('### connect_timeout', data);
});
socket.on('welcome', data => {
  console.log('### welcome', data);
});
socket.on('message', data => {
  console.log('### message', data);
});
