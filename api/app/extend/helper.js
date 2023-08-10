// 框架扩展用于封装数据格式
module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = Object.assign(
      {},
      {
        timestamp: Date.now(),
      },
      metadata
    );

    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },
};
/**
 * Format：
 {
  data: {
    action: 'exchange',  // 'deny' || 'exchange' || 'broadcast'
    payload: {},
  },
  meta:{
    timestamp: 1512116201597,
    client: 'nNx88r1c5WuHf9XuAAAB',
    target: 'nNx88r1c5WuHf9XuAAAB'
  },
 }
 */