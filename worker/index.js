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
    host: 'http://127.0.0.1:7002',
    token: '123456',
  },
  api: {
    host: 'http://127.0.0.1:7002',
  },
  sd_base_url: 'http://175.178.243.32:27301',
};

const io = require('socket.io-client');
const path = require('path');
// 状态  0: 空闲 1: 已发布任务 2: 已接受任务 3: 工作中 4: 任务完成正在上传结果
let worker_state = 0;
let worker_thread = null;
const ll = path.sep;

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
      1000
    );
    result = result.data;
  } catch (error) {}
  return result;
}

// 获得系统内存使用情况
async function getMemoryInfo() {
  let result = {};
  try {
    result = await request('/sdapi/v1/memory', 'GET', null, 1000);
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
        console.log("准备执行任务...");
        // 执行任务
        data.data.cos_host = data.cos_host;
        let task_result = await doTask2(data.data);
        console.log("任务执行完成，正在上传结果...");
        // 更新状态
        worker_state = 4;
        await updState(socket);

        // 上传结果
        if (task_result.code && task_result.code == 1) {
          // 保存图片到临时目录
          let compress_path = __dirname + `${ll}tmp${ll}result`;
          let day = ltool.formatTime2(new Date().valueOf(), 'YYYYMMDD');
          // 删除临时压缩目录下非当天的文件夹
          await ltool.deleteDir(compress_path, day);
          for (let index = 0; index < task_result.data.length; index++) {
            const element = task_result.data[index];
            let filename = ltool.uuid() + '.png';
            let filepath = `${compress_path}${ll}${day}${ll}${filename}`;
            if (!fs.existsSync(`${compress_path}${ll}${day}`))
              fs.mkdirSync(`${compress_path}${ll}${day}`, { recursive: true });
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
            await cos.uploadImage(element, cos_path);
            await cos.uploadImage(element, cos_compress_path, 350, 0, 85);
            result_images.push({
              origin_img: cos_path,
              compress_img: cos_compress_path,
            });
          }
          task_result.data = result_images;
        }
        task_result.token = data.token;
        socket.emit('exchange', {
          action: 'task_result',
          data: JSON.stringify(task_result),
        });
        console.log("结果上传完毕...",task_result);
        // 更新状态
        worker_state = 0;
        await updState(socket);
        break;
      default:
        break;
    }
  });
})();
