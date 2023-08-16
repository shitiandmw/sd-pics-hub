const Subscription = require('egg').Subscription;

class QueueCleaner extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1m', // 1 分钟间隔
      type: 'worker', // 只有一个 worker 执行
      immediate: true //项目启动时立即执行一次
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log(`[${new Date().toLocaleString()}]清理任务队列开始`);
    try {
      let result = 0;
      result += await this.ctx.service.task.clearTaskQueue(1);
      result += await this.ctx.service.task.clearTaskQueue(2);
      result += await this.ctx.service.task.clearTaskQueue(3);
      console.log(`[${new Date().toLocaleString()}]清理任务队列结束，共清理${result}条任务`);
    } catch (error) {
      console.log(`[${new Date().toLocaleString()}]清理任务队列失败，原因：${error}`);
    }
  }
}

module.exports = QueueCleaner;