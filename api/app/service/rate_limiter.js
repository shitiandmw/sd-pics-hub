const { Service } = require('egg');
/**
 * 频率控制
 */
class RateLimiterSevice extends Service {
    /**
     * 检查频率 
     * @param {*} key 校验频率的key  
     * @param {*} max 最大次数
     * @param {*} duration 频率时间间隔 单位秒
     * @returns 
     */
    async check(key, max, duration) {
        const { ctx, app } = this;
        let count = await app.redis.incrby(key, 1);
        if(count > max) return false;
        app.redis.expire(key, duration);
        return true;
    }
}
module.exports = RateLimiterSevice;
