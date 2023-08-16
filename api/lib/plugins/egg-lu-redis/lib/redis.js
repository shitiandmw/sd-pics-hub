'use strict';

const { v4:uuid } = require('uuid');
const assert = require('assert');
const awaitFirst = require('await-first');

module.exports = app => {
  app.addSingleton('redis', createClient);
};

let count = 0;
function createClient(config, app) {
  const Redis = app.config.redis.Redis || require('ioredis');

  let client;

  if (config.cluster === true) {
    assert(
      config.nodes && config.nodes.length !== 0,
      '[egg-redis] cluster nodes configuration is required when use cluster redis'
    );

    config.nodes.forEach(client => {
      assert(
        client.host &&
          client.port &&
          client.password !== undefined &&
          client.db !== undefined,
        `[egg-redis] 'host: ${client.host}', 'port: ${client.port}', 'password: ${client.password}', 'db: ${client.db}' are required on config`
      );
    });
    app.coreLogger.info('[egg-redis] cluster connecting');
    client = new Redis.Cluster(config.nodes, config);
  } else if (config.sentinels) {
    assert(
      config.sentinels && config.sentinels.length !== 0,
      '[egg-redis] sentinels configuration is required when use redis sentinel'
    );

    config.sentinels.forEach(sentinel => {
      assert(
        sentinel.host && sentinel.port,
        `[egg-redis] 'host: ${sentinel.host}', 'port: ${sentinel.port}' are required on config`
      );
    });

    assert(
      config.name && config.password !== undefined && config.db !== undefined,
      `[egg-redis] 'name of master: ${config.name}', 'password: ${config.password}', 'db: ${config.db}' are required on config`
    );

    app.coreLogger.info('[egg-redis] sentinel connecting start');
    client = new Redis(config);
  } else {
    assert(
      config.host &&
        config.port &&
        config.password !== undefined &&
        config.db !== undefined,
      `[egg-redis] 'host: ${config.host}', 'port: ${config.port}', 'password: ${config.password}', 'db: ${config.db}' are required on config`
    );
    app.coreLogger.info(
      '[egg-redis] server connecting redis://:***@%s:%s/%s',
      config.host,
      config.port,
      config.db
    );
    client = new Redis(config);
  }

  client.on('connect', () => {
    app.coreLogger.info('[egg-redis] client connect success');
  });
  client.on('error', err => {
    app.coreLogger.error('[egg-redis] client error: %s', err);
    app.coreLogger.error(err);
  });

  app.beforeStart(async () => {
    const index = count++;
    if (config.weakDependent) {
      app.coreLogger.info(
        `[egg-redis] instance[${index}] is weak dependent and won't block app start`
      );
      client.once('ready', () => {
        app.coreLogger.info(`[egg-redis] instance[${index}] status OK`);
      });
      return;
    }

    await awaitFirst(client, ['ready', 'error']);
    app.coreLogger.info(
      `[egg-redis] instance[${index}] status OK, client ready`
    );
  });

  // 缓存的过期时间 （默认1分钟）
  const _ExpSeconds = 60;

  async function setValue(keyName,keyValue,expSeconds = _ExpSeconds,noNull = false) {
    let keyValue_ = keyValue;
    if(typeof keyValue == 'object') keyValue_ = JSON.stringify(keyValue);
    if(noNull && !keyValue || !keyValue_ || keyValue_== "{}" || keyValue_== "[]") return;
    if (expSeconds > 0)
      return await client.set(keyName, keyValue_, 'EX', expSeconds);
    else return await client.set(keyName, keyValue_);
  }

  // 获得某个Key的值，如果不存在这个key，则从noHaveFunc中获得，并存入缓存
  client.sGet = async (
    keyName,
    noHaveFunc = null,
    expSeconds = _ExpSeconds
  ) => {
    let result = await client.get(keyName);
    if (!result && typeof noHaveFunc == 'function') {
      result = await noHaveFunc();
      setValue(keyName,result,expSeconds,true);
    }
    else if (result && ((result.startsWith('{') && result.endsWith('}')) || (result.startsWith('[') && result.endsWith(']')))) 
      result = JSON.parse(result);
    return result;
  };


  // 设置某个缓存
  client.sSet = async (keyName, keyValue, expSeconds = _ExpSeconds) => {
    setValue(keyName,keyValue,expSeconds,false);
  };

  // 添加一个加锁的批处理命令
  client.defineCommand('addlock', {
    numberOfKeys: 2,
    lua: `if redis.call('SETNX', KEYS[1], ARGV[1]) == 1 then redis.call('PEXPIRE',KEYS[1],ARGV[2]) return 1 else return 0 end`,
  });
  // 获取分布式锁（非阻塞）
  // 使用示例：const selfMark = await app.redis.sLock("lock1",20);
  client.sLock = async (keyName, lockExpirySeconds = 10) => {
    const selfMark = uuid();
    const lockKey = 'Lock:' + keyName;
    const expMS = lockExpirySeconds * 1000;
    const result = await client.addlock(lockKey, '', selfMark, expMS, () => {});
    if (result) return selfMark;
    else return result;
  };

  // 添加一个解锁的批处理命令
  client.defineCommand('dellock', {
    numberOfKeys: 1,
    lua: `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`,
  });
  // 释放锁 selfMark:解锁标记，加锁的时候返回
  // 使用示例：if(selfMark) app.redis.sUnLock("lock1",selfMark)
  client.sUnLock = async (keyName, selfMark) => {
    const lockKey = 'Lock:' + keyName;
    return await client.dellock(lockKey, selfMark, () => {});
  };

  return client;
}
