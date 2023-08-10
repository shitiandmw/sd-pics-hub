import config from '../../config';

const print = (msg, param) => {
  if (config.debug == 1) console.log(msg, param);
};

export default [
  // socket 连接
  {
    event_key: 'connect',
    state_function: (state, data) => {
      print('#### connect');
      state.state = 1;
      state.timeout = 0;
    },
  },
  // socket 断开连接
  {
    event_key: 'disconnect',
    state_function: (state, data) => {
      print('#### disconnect', data);
      state.state = 0;
      state.timeout = 0;
    },
  },
  // socket 连接超时
  {
    event_key: 'connect_timeout',
    state_function: (state, data) => {
      print('#### connect_timeout', data);
      state.timeout = 1;
    },
  },
  // 服务端发送欢迎信息
  {
    event_key: 'welcome',
    state_function: (state, data) => {
      print('#### welcome', data);
    },
  },
  // 服务端发送消息
  {
    event_key: 'message',
    state_function: (state, data) => {
      print('#### message', data);
    },
  },
];
