'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
    /**
     * 获得自己的信息
     */
    async getMyInfo() {
        const { ctx, app } = this;
        const user_id = ctx.user.id;
        const user = await ctx.service.user.findUserbyId(user_id);
        if (!user) throw ctx.ltool.err('用户不存在', 40004);
        ctx.body = user;
    }

    /**
     * 根据用户id获得用户信息
     */
    async getUserInfoById() {
        const { ctx, app } = this;
        const { user_id } = ctx.request.query;
        // 验证参数合法性
        const errors = app.validator.validate(
            {
                user_id: { type: 'string', required: true },
            },
            { user_id }
        );

        if (errors && errors.length > 0)
            throw ctx.ltool.err(`"${errors[0].field}"${errors[0].message}`, 4011);

        const user = await ctx.service.user.findUserbyId(user_id);
        if (!user) throw ctx.ltool.err('用户不存在', 40004);

        let result = {
            _id: user._id,
            nick_name:user.nick_name,
            avatar:user.avatar,
            contact_num:user.contact_num,
            is_friend : await ctx.service.friend.isFriend(ctx.user.id, user._id)
        }
        ctx.body = result;
    }
}

module.exports = UserController;