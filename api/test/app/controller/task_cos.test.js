'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/task_cos.test.js', () => {
  // it('should assert', async () => {
  //   const pkg = require('../../../package.json');
  //   assert(app.config.keys.startsWith(pkg.name));

  //   // const ctx = app.mockContext({});
  //   // yield ctx.service.xx();
  // });

  it('should GET /task_cos/gettoken', async () => {
    let result = await app.httpRequest().get('/task_cos/gettoken?token=ade3d6af-d3dc-41d2-99b2-6fdbd50670ff').expect(200);
    console.log('gettoken result', result.text);
    assert(result.status === 200);
  });
});
