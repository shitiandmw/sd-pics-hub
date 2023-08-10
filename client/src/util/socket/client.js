// import io from 'socket.io-client';
import io from '@hyoga/uni-socket.io';
import config from '../../config'
import events from './event';
import { md5 } from "@/util/crypto";

export default function Socket($store) {

  // 获得连接socket的参数
  const connQuery = ()=> {
    let query = {};
    // 获得登录信息
    let logininfo = uni.getStorageSync("app_login_user");
    if(logininfo)
    {
      logininfo = JSON.parse(logininfo);
      const timestamp = new Date().valueOf();
      const random_number = Math.floor(Math.random() * 100000000);
      const sign_content = `${timestamp}${logininfo.token}userid${logininfo.userid}&random_number=${random_number}`;
      console.log("sign_content",sign_content)
      const sign = md5(sign_content).toLowerCase();
      query = {
        userid: logininfo.userid,
        logintype: logininfo.logintype,
        timestamp,
        random_number,
        sign,
      };
    } 
    return query;
  }

  const socket = io(process.env.VUE_APP_SOCKET_HOST, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    query: connQuery(),
  });
  for (let index = 0; index < events.length; index++) {
    const event = events[index].event_key;
    socket.on(event, data => {
      $store.commit("socket/"+config.socket.prefix + event,data)
    });
  }
  return socket;
};

// export default socket;

// import io from '@hyoga/uni-socket.io';
// import events from './event';

// const socket = io('http://192.168.1.131:3000', {
//   query: {},
//   transports: [ 'websocket', 'polling' ],
//   timeout: 5000,
//   autoConnect: false,
// });

// for (let index = 0; index < events.length; index++) {
//   const event = events[index];
//   socket.on(event, data => {
//     uni.showToast({
//         title: event,
//         duration: 2000
//     });
//     console.log(event, data); //
//   });
// }

// export default socket;
