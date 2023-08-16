// agent.js
module.exports = agent => {
  // 在这里写你的初始化逻辑

  // 也可以通过 messenger 对象发送消息给 App Worker
  // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失
  agent.messenger.on('egg-ready', () => {});


  /**
   * 扩展定时任务类型
   * 默认框架提供的定时任务只支持每台机器的单个进程执行和全部进程执行，有些情况下，我们的服务并不是单机部署的，这时候可能有一个集群的某一个进程执行一个定时任务的需求。
   * 框架并没有直接提供此功能，但开发者可以在上层框架自行扩展新的定时任务类型。
   * 在 agent.js 中继承 agent.ScheduleStrategy，然后通过 agent.schedule.use() 注册即可：
   */
//   class ClusterStrategy extends agent.ScheduleStrategy {
//     start() {
//       // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
//       // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
//       agent.mq.subscribe(this.schedule.scene, () => this.sendOne());
//     }
//   }
//   agent.schedule.use('cluster', ClusterStrategy);


};
