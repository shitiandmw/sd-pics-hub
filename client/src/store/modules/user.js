import config from '../../config';
import http_client from '../../util/http_client';
import image from '../../util/image';

export default {
  namespaced: true,
  //Vuex 使用单一状态树——是的，用一个对象就包含了全部的应用层级状态。
  //至此它便作为一个“唯一数据源 (SSOT)”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。
  //单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。
  state: {
    user: null,
  },
  //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
  //Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
  //这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
  mutations: {
    SET_USER_INFO(state, user) {
      state.user = user;
    },
  },
  //Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态。 Action 可以包含任意异步操作。
  actions: {
    async load_user_info({ commit }) {
      let url = `/user/myinfo`;
      let params = {};
      let res = await http_client.get(url, params, 2);
      if (res.code == 1) {
        res.data.avatar = image.format_path(res.data.avatar);
        commit('SET_USER_INFO', res.data);
        return res.data;
      } else return null;
    },
  },
};
