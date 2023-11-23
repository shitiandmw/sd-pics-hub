/**
 * 工人找事做的模式
 * 由worker告诉服务器我处于空闲状态/工作状态
 * 服务器收到信息，安排工作
 */
const axios = require('axios');
const { randomUUID } = require('crypto');
const os = require('os');
const fs = require('fs');
const sharp = require('sharp');
const base64 = require('base64-js');
const tencent_cos = require('./tencent_cos');
var ltool = require('./ltool');

const config = {
  source: 'aliyun',
  socket: {
    host: 'http://127.0.0.1:17002',
    token: '123456',
  },
  api: {
    host: 'http://127.0.0.1:17002',
  },
  sd_base_url: 'http://175.178.243.32:27301',
};

const io = require('socket.io-client');
const path = require('path');
// 状态  0: 空闲 1: 已发布任务 2: 已接受任务 3: 工作中 4: 任务完成正在上传结果
let worker_state = 0;
let worker_thread = null;

/**
 * 读取配置信息
 * @returns
 */
function readConfig() {
  return new Promise((resolve, reject) => {
    try {
      let config_path = 'config.json';
      let config_data = null;
      // 文件是否存在
      if (fs.existsSync(config_path)) {
        // 读取文件
        config_data = fs.readFileSync(config_path, 'utf8');
        config_data = JSON.parse(config_data);
      } else {
        config_data = {
          device_id: randomUUID(),
        };
      }

      // 保存配置文件
      fs.writeFileSync(config_path, JSON.stringify(config_data));
      resolve(config_data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 更新状态
 * @param {*} socket_
 * @returns
 */
async function updState(socket_) {
  let memory_info = await getMemoryInfo();
  let progress = await getDrawProgress();
  socket_.emit('exchange', {
    action: 'state',
    data: {
      state: worker_state,
      memory_info: JSON.stringify(memory_info),
      progress: JSON.stringify(progress),
    },
  });
}

// 每隔一段时间更新当前工人的状态给服务器
async function scheduleUpdate(socket) {
  await updState(socket);
  if (worker_thread) clearTimeout(worker_thread);
  worker_thread = setTimeout(async () => {
    await scheduleUpdate(socket);
  }, 5000);
}
/**
 * http 基础请求
 * @param {*} url
 * @param {*} method
 * @param {*} data
 * @param {*} timeout
 */
function request(url, method, data, timeout = 3000, responseType = null) {
  return new Promise((resolve, reject) => {
    if (!url.startsWith('http://') && !url.startsWith('https://'))
      url = config.sd_base_url + url;
    let axios_config = {
      url: url,
      method: method,
      data: data,
      timeout: timeout,
    };
    if (responseType) axios_config.responseType = responseType;
    axios(axios_config)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// 获得当前设备系统信息
async function getDeviceInfo() {
  let result = {};
  try {
    result = await request('/internal/sysinfo', 'GET');
    result = result.data;
  } catch (error) {}
  return result;
}
// 获得当前设备的绘图进度
async function getDrawProgress() {
  let result = {};
  try {
    result = await request(
      '/sdapi/v1/progress?skip_current_image=true',
      'GET',
      null,
      500
    );
    result = result.data;
  } catch (error) {}
  return result;
}

// 获得系统内存使用情况
async function getMemoryInfo() {
  let result = {};
  try {
    result = await request('/sdapi/v1/memory', 'GET', null, 500);
    result = result.data;
  } catch (error) {}
  return result;
}

// 使用APItoken获得cos的临时token信息
async function getCosToken(api_token) {
  let result = null;
  try {
    result = await request(
      `${config.api.host}/task_cos/gettoken?token=${api_token}`,
      'GET',
      null,
      500
    );
    result = result.data;
    if (!result.status || result.code != 1) result = null;
    else result = result.data;
  } catch (error) {
    console.error(error);
  }
  return result;
}
/**
 * 执行任务
 * @param {*} socket_
 * @param {*} task_info
 */
async function doTask(socket_, task_info) {
  // 告诉服务器我开始工作了
  worker_state = 2;
  await updState(socket_);
  // 执行任务
  switch (task_info.type) {
    case 2:
      break;
    default:
      break;
  }
}

async function encodeImageToBase64(image_url) {
  let response = await request(image_url, 'GET', null, 5000, 'arraybuffer');
  // Encode into PNG and convert to Base64
  const encodedBuffer = await sharp(response.data).toFormat('png').toBuffer();

  const encodedImage = encodedBuffer.toString('base64');
  return encodedImage;
}

// 执行第二类任务
async function doTask2(task_info) {
  console.log('dotask ing....');
  let result = {
    code: 1,
  };

  try {
    // 获得任务参数
    let task_params = task_info.params.template.params;
    // 分身信息
    let clone_info = task_info.params.doopelganger;

    if (!task_params || !clone_info) throw new Error('任务参数不完整');

    // lora模式 ,lora 模型相关参数
    if (clone_info.type == 2) {
    }
    // roop 模式
    else if (clone_info.type == 1) {
      let image_data = await encodeImageToBase64(
        task_info.cos_host + clone_info.train_imgs[0].origin_img
      );
      task_params.alwayson_scripts = {
        roop: {
          args: [
            image_data,
            true,
            '0',
            '/mnt/workspace/stable-diffusion-webui/models/roop/inswapper_128.onnx',
            'GFPGAN',
            0.8,
          ],
        },
      };
    }

    // 执行
    let response = await request(
      '/sdapi/v1/txt2img',
      'POST',
      task_params,
      60000 * 10
    );
    result.data = response.data.images;
  } catch (error) {
    console.error(error);
    result = {
      code: 500,
      error: error,
    };
  }

  return result;
}

(async () => {
  let data = {
    action: 'task',
    data: {
      first_img: {
        compress_img:
          '/r/template/XZ_00003/compress/832e3a17-36ed-4d6c-b0dd-d6c796c4104e.png',
        origin_img:
          '/r/template/XZ_00003/832e3a17-36ed-4d6c-b0dd-d6c796c4104e.png',
      },
      _id: '64dd92c9cb739a3e8c61b23d',
      user_id: '1111',
      type: 2,
      status: 1,
      params: {
        template_id: '64daf1c3ec9f0c3cdcc5c688',
        doopelganger_id: '64dca1feb05cad63d8ceb438',
        template: {
          tags: ['盔甲', '战士', '中世纪'],
          version: 1.03,
          hot: 0,
          _id: '64daf1c3ec9f0c3cdcc5c688',
          imgs: [
            {
              _id: '64db305c4bb9424098aa1d97',
              compress_img:
                '/r/template/XZ_00003/compress/832e3a17-36ed-4d6c-b0dd-d6c796c4104e.png',
              origin_img:
                '/r/template/XZ_00003/832e3a17-36ed-4d6c-b0dd-d6c796c4104e.png',
            },
            {
              _id: '64db305c4bb9424098aa1d98',
              compress_img:
                '/r/template/XZ_00003/compress/c33685b9-2bc2-46de-954a-833410e6685f.png',
              origin_img:
                '/r/template/XZ_00003/c33685b9-2bc2-46de-954a-833410e6685f.png',
            },
            {
              _id: '64db305c4bb9424098aa1d99',
              compress_img:
                '/r/template/XZ_00003/compress/751dc612-0575-46bd-8ff2-cc7860ef6fec.png',
              origin_img:
                '/r/template/XZ_00003/751dc612-0575-46bd-8ff2-cc7860ef6fec.png',
            },
            {
              _id: '64db305c4bb9424098aa1d9a',
              compress_img:
                '/r/template/XZ_00003/compress/0d9025e1-0109-4ef5-8778-7eefef4c4e86.png',
              origin_img:
                '/r/template/XZ_00003/0d9025e1-0109-4ef5-8778-7eefef4c4e86.png',
            },
            {
              _id: '64db305c4bb9424098aa1d9b',
              compress_img:
                '/r/template/XZ_00003/compress/16068a46-1da6-40ff-9fc2-9d82811417ed.png',
              origin_img:
                '/r/template/XZ_00003/16068a46-1da6-40ff-9fc2-9d82811417ed.png',
            },
            {
              _id: '64db305c4bb9424098aa1d9c',
              compress_img:
                '/r/template/XZ_00003/compress/eade9cb7-2d09-463f-a754-b0eebdad37d4.png',
              origin_img:
                '/r/template/XZ_00003/eade9cb7-2d09-463f-a754-b0eebdad37d4.png',
            },
            {
              _id: '64db305c4bb9424098aa1d9d',
              compress_img:
                '/r/template/XZ_00003/compress/b795d1f7-486a-46fb-8a54-16aa9f475d8a.png',
              origin_img:
                '/r/template/XZ_00003/b795d1f7-486a-46fb-8a54-16aa9f475d8a.png',
            },
          ],
          code: 'XZ_00003',
          name: '半身中世纪盔甲',
          desc: '',
          type: 'SD1.5',
          creator: 'admin',
          create_time: 1692086364816,
          params: {
            prompt:
              '(masterpiece), (extremely intricate:1.3), (realistic), Chinese female, portrait of a girl, the most beautiful in the world, silver armor, (medieval armor), metal reflections, upper body, outdoors, intense sunlight, far away castle, professional photograph of a stunning woman detailed, sharp focus, dramatic, award winning, cinematic lighting, octane render, unreal engine, volumetrics dtx, (film grain, bokeh, blurry foreground, blurry background)',
            negative_prompt:
              '(UnrealisticDream:1.3),(nsfw:1.5),hat,(helmet:1.2),verybadimagenegative_v1.3, ng_deepnegative_v1_75t, (ugly face:0.8),cross-eyed,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, bad anatomy, DeepNegative, facing away, tilted head, Multiple people, lowres, bad anatomy, bad hands, text, error, (missing fingers:1.3), extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, username, blurry, bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, extra fingers, fewer digits, extra limbs, extra arms,extra legs, malformed limbs, (fused fingers:1.2), (too many fingers:1.2), long neck, cross-eyed,mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, (missing fingers:1.5), missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, ((repeating hair))',
            seed: -1,
            batch_size: 3,
            n_iter: 2,
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
          __v: 1,
        },
        doopelganger: {
          _id: '64dca1feb05cad63d8ceb438',
          user_id: '1111',
          name: '数字分身111',
          type: 1,
          train_imgs: [
            {
              _id: '64dca1feb05cad63d8ceb439',
              compress_img: '/r/doppelganger/141151515/compress/f4.png',
              origin_img: '/r/doppelganger/141151515/f4.png',
              format_img: '/r/doppelganger/141151515/format/f4.png',
            },
          ],
          model_file: '',
          model_name: '',
          create_time: 1692180990693,
          train_start_time: 0,
          train_end_time: 0,
          train_status: 0,
          is_delete: 0,
          __v: 0,
        },
      },
      create_time: 1692242633219,
      result: [],
      __v: 0,
      start_time: 1692603430061,
    },
    cos_host: 'http://cos.eyebright.net.cn',
    token: 'e26e142b-a360-4ce1-ba42-9c5a1c18a5e0',
  };
  // 执行任务
  data.data.cos_host = data.cos_host;
  let task_result = await doTask2(data.data);

  // 上传结果
  if (task_result.code && task_result.code == 1) {
    // 保存图片到临时目录
    let compress_path = __dirname + `\\tmp\\result`;
    let day = ltool.formatTime2(new Date().valueOf(), 'YYYYMMDD');
    // 删除临时压缩目录下非当天的文件夹
    await ltool.deleteDir(compress_path, day);
    for (let index = 0; index < task_result.data.length; index++) {
      const element = task_result.data[index];
      let filename = ltool.uuid() + '.png';
      let filepath = `${compress_path}\\${day}\\${filename}`;
      if (!fs.existsSync(`${compress_path}\\${day}`))
        fs.mkdirSync(`${compress_path}\\${day}`, { recursive: true });
      fs.writeFileSync(filepath, base64.toByteArray(element));
      task_result.data[index] = filepath;
    }
    // 将图片上传到cos
    let cos_token = await getCosToken(data.token);

    let cos = new tencent_cos({
      getToken: () => {
        return cos_token;
      },
    });
    let result_images = [];
    for (let index = 0; index < task_result.data.length; index++) {
      const element = task_result.data[index];
      const filename = path.basename(element);
      let cos_path = `${cos_token.path}/${filename}`;
      let cos_compress_path = `${cos_token.path}/compress/${filename}`;
      await cos.uploadFile(element, cos_path);
      await cos.uploadFile(element, cos_compress_path, 500, 0, 85);
      result_images.push({
        origin_img: cos_path,
        compress_img: cos_compress_path,
      });
    }
    task_result.data = result_images;
  }
  console.log('task_result', task_result);
  socket.emit('exchange', {
    action: 'task_result',
    token: data.token,
    data: JSON.stringify(task_result),
  });
  // 更新状态
  worker_state = 0;
  await updState(socket);
})();

(async () => {
  // 读取配置信息
  let device_config = await readConfig();
  // 获得当前设备系统信息
  let device_info = await getDeviceInfo();
  console.log(typeof device_info);
  const socket = io(config.socket.host, {
    autoConnect: true,
    query: {
      token: config.socket.token,
      source: config.source,
      device_id: device_config.device_id,
      state: worker_state,
      // 能执行的任务类型 1数字模型 2写真 3高清化
      task_types: JSON.stringify([2, 3]),
    },
  });
  socket.on('connect', async data => {
    console.log('connect', data);
    await scheduleUpdate(socket);
    socket.emit('exchange', {
      action: 'device_info',
      data: JSON.stringify(device_info),
    });
  });
  socket.on('disconnect', data => {
    console.log('### disconnect', data);
  });
  socket.on('disconnect', data => {
    console.log('### disconnect', data);
  });
  socket.on('connect_timeout', data => {
    console.log('### connect_timeout', data);
  });
  socket.on('welcome', data => {
    console.log('### welcome', data);
  });
  socket.on('message', async data => {
    console.log('### message', JSON.stringify(data));
    switch (data.action) {
      case 'task':
        // 更新状态
        worker_state = 3;
        await updState(socket);
        // 执行任务
        data.data.cos_host = data.cos_host;
        let task_result = await doTask2(socket, data.data);
        // 更新状态
        worker_state = 4;
        await updState(socket);

        // 上传结果
        if (task_result.code && task_result.code == 1) {
          // 保存图片到临时目录
          let compress_path = __dirname + `\\tmp\\result`;
          let day = ltool.formatTime2(new Date().valueOf(), 'YYYYMMDD');
          // 删除临时压缩目录下非当天的文件夹
          await ltool.deleteDir(compress_path, day);
          for (let index = 0; index < task_result.data.length; index++) {
            const element = task_result.data[index];
            let filename = ltool.uuid() + '.png';
            let filepath = `${compress_path}\\${day}\\${filename}`;
            if (!fs.existsSync(`${compress_path}\\${day}`))
              fs.mkdirSync(`${compress_path}\\${day}`, { recursive: true });
            fs.writeFileSync(filepath, base64.toByteArray(element));
            task_result.data[index] = filepath;
          }
          // 将图片上传到cos
          let cos_token = await getCosToken(data.token);

          let cos = new tencent_cos({
            getToken: () => {
              return cos_token;
            },
          });
          let result_images = [];
          for (let index = 0; index < task_result.data.length; index++) {
            const element = task_result.data[index];
            const filename = path.basename(element);
            let cos_path = `${cos_token.path}/${filename}`;
            let cos_compress_path = `${cos_token.path}/compress/${filename}`;
            await cos.uploadFile(element, cos_path);
            await cos.uploadFile(element, cos_compress_path, 500, 0, 85);
            result_images.push({
              origin_img: cos_path,
              compress_img: cos_compress_path,
            });
          }
          task_result.data = result_images;
        }
        socket.emit('exchange', {
          action: 'task_result',
          token: data.token,
          data: JSON.stringify(task_result),
        });
        // 更新状态
        worker_state = 0;
        await updState(socket);
        break;
      default:
        break;
    }
  });
})();
