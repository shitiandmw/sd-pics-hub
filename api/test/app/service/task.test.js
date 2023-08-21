const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/service/task.test.js', () => {
  let ctx;

  before(async () => {
    ctx = app.mockContext();
  });

  it('generatePortrait()', async () => {
      const res = await ctx.service.task.generatePortrait("1111","64daf1c3ec9f0c3cdcc5c688","64dca1feb05cad63d8ceb438");
      console.log("generatePortrait res:",res);
      assert(true);
  });

  // it('addTaskToQueue()', async () => {
  //   const res = await ctx.service.task.addTaskToQueue({_id:"22222", type:2});
  //   console.log("addTaskToQueue res:",res);
  //   assert(true);
  // });
 
  it('popTaskFromQueue()', async () => {
    const res = await ctx.service.task.popTaskFromQueue(2);
    console.log("popTaskFromQueue res:",res);
    assert(true);
  });
 
  it('getTaskRanking()', async () => {
    const res = await ctx.service.task.getTaskRanking({_id:"22222", type:2});
    console.log("getTaskRanking res:",res);
    assert(true);
  });


  it('clearTaskQueue()', async () => {
    const res = await ctx.service.task.clearTaskQueue(2);
    console.log("clearTaskQueue res:",res);
    assert(true);
  });
  
  
  it('addTimeoutTaskToQueue()', async () => {
    const res = await ctx.service.task.addTimeoutTaskToQueue(2);
    console.log("res:",res);
    assert(true);
  });


  // 
  it('getTaskInfo()', async () => {
    const res = await ctx.service.task.getTaskInfo("64dd92c9cb739a3e8c61b23d");
    console.log("getTaskInfo res:",JSON.stringify(res));
    assert(true);
  });

});
