const { Service } = require('egg');

class TemplateSevice extends Service {
      
    async create(info)
    {
        let template = new this.ctx.model.Template();
        template.name = info.name||"";
        template.desc = info.desc||"";
        template.type = info.type||"";
        template.tags = info.tags||[];
        template.creator = "admin";
        template.create_time = new Date().valueOf();
        template.params = info.params||{};
        template.hot = 0;
        template.imgs = info.imgs||[];
        await template.save();
    }

    async list()
    {

    }

    async info()
    {

    }
 

}

module.exports = TemplateSevice;
