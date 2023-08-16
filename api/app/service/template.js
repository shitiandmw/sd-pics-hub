const { Service } = require('egg');
const fsPromises = require('fs').promises;
const path = require('path');

class TemplateSevice extends Service {
  /**
   * 列出文件夹下的所有文件
   * @param {*} folderPath
   * @returns
   */
  async listFilesInFolder(folderPath) {
    try {
      const files = await fsPromises.readdir(this.app.baseDir + folderPath); // Use fsPromises instead of fs
      const fileNames = [];
      for (const file of files) {
        let filename = path.join(this.app.baseDir + folderPath, file);
        const fileStat = await fsPromises.stat(filename); // Also use fsPromises here
        if (fileStat.isFile()) {
          fileNames.push(filename);
        }
      }

      return fileNames;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  }
  /**
   * 初始化模板
   */
  async init() {
    // 雪山写真
    let templates = [
      {
        code: 'XZ_00001',
        name: '半身雪景',
        type: 'SD1.5',
        tags: ['雪山', '写真', '真人'],
        imgs: await this.listFilesInFolder(
          '\\file\\images\\template\\XZ_00001'
        ),
        version: 1.03,
        sex:0,
        params: {
          prompt:
            'RAW photo, subject, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3, Screen Space Refraction, hyperdetailed, hyper quality, high detail, natural skin texture , 1 girl, (Snow Mountain:0.8), beautiful , Upper body, Snowing, Down jacket, (Beautiful woman:1.5), (pretty:1.5) ,',
          negative_prompt:
            '(nsfw:1.5),verybadimagenegative_v1.3, ng_deepnegative_v1_75t, (ugly face:0.8),cross-eyed,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, bad anatomy, DeepNegative, facing away, tilted head, {Multiple people}, lowres, bad anatomy, bad hands, text, error, (missing fingers:1.3), extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, username, blurry, bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, extra fingers, fewer digits, extra limbs, extra arms,extra legs, malformed limbs, (fused fingers:1.2), (too many fingers:1.2), long neck, cross-eyed,mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, (missing fingers:1.5), missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, ((repeating hair)),nsfw, ',
          seed: -1,
          batch_size: 3,
          n_iter: 1,
          steps: 30,
          cfg_scale: 7,
          width: 512,
          height: 512,
          send_images: true,
          save_images: false,
          sampler_index: 'Euler a',
          override_settings: {
            sd_model_checkpoint: 'realisticVisionV51_v51VAE.safetensors',
            CLIP_stop_at_last_layers: 2,
            sd_vae: 'vae-ft-mse-840000-ema-pruned_v10.0.pt',
          },
        },
      },
      {
        code: 'XZ_00002',
        name: '半身未来战士',
        type: 'SD1.5',
        tags: ['未来', '机甲', '真人'],
        imgs: await this.listFilesInFolder(
          '\\file\\images\\template\\XZ_00002'
        ),
        sex:0,
        version: 1.03,
        params: {
          prompt:
            '(detailed face, detailed eyes, clear skin, clear eyes), cgmech, beautiful eyes, upper body, portrait, robot, armor, 1girl, Chinese female, white shimmering hair, neon light, 8K, RAW, best quality, masterpiece, ultra high res, colorful, (medium wide shot), (dynamic perspective), sharp focus , (depth of field, bokeh:1.3), extremely detailed eyes and face, beautiful detailed eyes,(black gold, trimmed gear:1.2),(In a futuristic weapons factory:1.2), ((masterpiece, best quality)), <lora:more_details:0.3> Detailed background, spaceship interior <lora:menpo_offset:0.2>  <lora:Niji:0.6>',
          negative_prompt:
            '(nsfw:1.5),verybadimagenegative_v1.3, ng_deepnegative_v1_75t, (ugly face:0.8),cross-eyed,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, bad anatomy, DeepNegative, facing away, tilted head, {Multiple people}, lowres, bad anatomy, bad hands, text, error, (missing fingers:1.3), extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, username, blurry, bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, extra fingers, fewer digits, extra limbs, extra arms,extra legs, malformed limbs, (fused fingers:1.2), (too many fingers:1.2), long neck, cross-eyed,mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, (missing fingers:1.5), missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, ((repeating hair))',
          seed: -1,
          batch_size: 3,
          n_iter: 1,
          steps: 30,
          cfg_scale: 7,
          width: 512,
          height: 768,
          send_images: true,
          save_images: false,
          sampler_index: 'DPM++ 2M Karras',
          override_settings: {
            sd_model_checkpoint: 'absolutereality_v181.safetensors',
            CLIP_stop_at_last_layers: 2,
            sd_vae: 'vae-ft-mse-840000-ema-pruned_v10.0.pt',
          },
        },
      },
      {
        code: 'XZ_00003',
        name: '半身中世纪盔甲',
        type: 'SD1.5',
        tags: ['盔甲', '战士', '中世纪'],
        imgs: await this.listFilesInFolder(
          '\\file\\images\\template\\XZ_00003'
        ),
        sex:0,
        version: 1.03,
        params: {
          prompt:
            '(masterpiece), (extremely intricate:1.3), (realistic), Chinese female, portrait of a girl, the most beautiful in the world, silver armor, (medieval armor), metal reflections, upper body, outdoors, intense sunlight, far away castle, professional photograph of a stunning woman detailed, sharp focus, dramatic, award winning, cinematic lighting, octane render, unreal engine, volumetrics dtx, (film grain, bokeh, blurry foreground, blurry background)',
          negative_prompt:
            '(UnrealisticDream:1.3),(nsfw:1.5),hat,(helmet:1.2),verybadimagenegative_v1.3, ng_deepnegative_v1_75t, (ugly face:0.8),cross-eyed,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, bad anatomy, DeepNegative, facing away, tilted head, Multiple people, lowres, bad anatomy, bad hands, text, error, (missing fingers:1.3), extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, username, blurry, bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, extra fingers, fewer digits, extra limbs, extra arms,extra legs, malformed limbs, (fused fingers:1.2), (too many fingers:1.2), long neck, cross-eyed,mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, (missing fingers:1.5), missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, ((repeating hair))',
          seed: -1,
          batch_size: 3,
          n_iter: 1,
          steps: 30,
          cfg_scale: 7,
          width: 512,
          height: 768,
          send_images: true,
          save_images: false,
          sampler_index: 'DPM++ 2M Karras',
          override_settings: {
            sd_model_checkpoint: 'absolutereality_v181.safetensors',
            CLIP_stop_at_last_layers: 2,
            sd_vae: 'vae-ft-mse-840000-ema-pruned_v10.0.pt',
          },
        },
      },
    ];

    for (let i = 0; i < templates.length; i++) {
      await this.saveByCode(templates[i]);
    }

    return true;
  }

  /**
   * 添加或更新模板信息
   * @param {*} info
   */
  async saveByCode(info) {
    let ctx = this.ctx;
    let app = this.app;
    let template = await ctx.model.Template.findOne({ code: info.code });
    if ((template && template.version < info.version) || !template) {
      // console.log('info.imgs', info.imgs);
      // 上传图片
      if (info.imgs && info.imgs.length > 0) {
        let cos_path = `/r/template/${info.code}`;
        for (let i = 0; i < info.imgs.length; i++) {
          // 从info.imgs[i]中获得图片目录
          let img_path = path.dirname(info.imgs[i]);
          // 从info.imgs[i]中获得文件名
          let img_name = path.basename(info.imgs[i]);
          // 从info.imgs[i]中获得后缀名
          let ext = info.imgs[i].split('.').pop();

          // 压缩图片
          let compress_path = `${img_path}\\compress\\${img_name}`;
          let compress_res = await ctx.ltool.compressImg(info.imgs[i], compress_path, 350,0,90);
          if(!compress_res) throw ctx.ltool.err('压缩图片失败', 10002);
          let cos_filename = ctx.ltool.uuid();
          let cos_file = `${cos_path}/${cos_filename}.${ext}`;
          let cos_compress_file = `${cos_path}/compress/${cos_filename}.${ext}`;
          let upload_res = false;
          // 调用上传模块上传文件
          upload_res = await ctx.service.tencentCos.uploadFile(
            info.imgs[i],
            cos_file
          );
          if (!upload_res) throw ctx.ltool.err('上传原图失败', 10003);
          // 调用上传模块上传文件
          upload_res = await ctx.service.tencentCos.uploadFile(
            compress_path,
            cos_compress_file
          );
          if (!upload_res) throw ctx.ltool.err('上传缩略图失败', 10003);
          info.imgs[i] = {
            compress_img: cos_compress_file,
            origin_img: cos_file,
          };
        }
      }
      if (!template) template = new ctx.model.Template();
      template.code = info.code;
      template.name = info.name || '';
      template.desc = info.desc || '';
      template.type = info.type || '';
      template.tags = info.tags || [];
      template.creator = info.creator || 'admin';
      template.create_time = info.create_time || new Date().valueOf();
      template.params = info.params || {};
      template.hot = info.hot || 0;
      template.imgs = info.imgs || [];
      template.version = info.version || 0;
      await template.save();
    }
  }

  async create(info) {
    let template = new this.ctx.model.Template();
    template.name = info.name || '';
    template.desc = info.desc || '';
    template.type = info.type || '';
    template.tags = info.tags || [];
    template.creator = 'admin';
    template.create_time = new Date().valueOf();
    template.params = info.params || {};
    template.hot = 0;
    template.imgs = info.imgs || [];
    await template.save();
  }

  /**
   * 模板列表
   * @param {*} page 
   * @returns 
   */
  async list(page = 1) {
    let ctx = this.ctx;
    let pageSize = 10;
    let total = await ctx.model.Template.countDocuments({});
    let list = await ctx.model.Template.find({},"imgs name")
      .sort({ create_time: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return {
      total: total,
      list: list,
    };
  }

  /**
   * 模板详情（用于显示）
   * @param {*} id 
   */
  async info(id) {
    let ctx = this.ctx;
    let template = await ctx.model.Template.findOne({ _id: id },"name imgs desc");
    if (!template) throw ctx.ltool.err('模板不存在', 10001);
    return template;
  }

  /**
   * 模板详情，可用于生成任务
   * @param {*} id 
   * @returns 
   */
  async detail (id) {
    let ctx = this.ctx;
    let template = await ctx.model.Template.findOne({ _id: id });
    if (!template) throw ctx.ltool.err('模板不存在', 10001);
    return template;
  }
}

module.exports = TemplateSevice;
