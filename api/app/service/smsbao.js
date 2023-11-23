const crypto = require('crypto');
const axios = require('axios');
const http = require('http');
const querystring = require('querystring');

const md5 = crypto.createHash('md5');
const { Service } = require('egg');

class SMSBaoSevice extends Service {
  /**
   * 发送验证码
   * @param {*} phone 手机号码
   * @param {*} code 验证码
   */
  async SendSMS(phone, code) {
    try {
      // 获得配置信息
      let config = this.ctx.app.config.smsinfo;
      if (!config) throw ctx.ltool.err('短信配置信息获取失败', 10011);

      var data = {
        u: config.user,
        p: md5.update(config.apikey).digest('hex'),
        m: phone,
        c: `[${
          config.signstr || ''
        }]你的验证码是${code}，如非本人操作，请忽略此短信`,
      };
      var content = querystring.stringify(data);

      let result = await axios.get(`http://${config.smsapi}/sms?${content}`).data;
      if(result != "0") throw ctx.ltool.err('发送短信失败', 10013);

      return true;

    } catch (error) {
        throw ctx.ltool.err('发送短信失败', 10012);
    }
  }
}

module.exports = SMSBaoSevice;

// var smsapi = 'api.smsbao.com';
// // 短信平台账号
// var user = 'lu_shitian';
// // 短信平台密码
// var password = 'fe99949b489b4bedb40a887fb0efd7dd';
// // 要发送的短信内容
// var content = '[圆梦照相馆]你的验证码是12415，如非本人操作，请忽略此短信';
// // 要发送短信的手机号码
// var phone = '17677132122';

// send_sms(smsapi, user, password, content, phone);

// function send_sms(smsapi, user, password, content, phone) {
//   var pass = md5.update(password).digest('hex');
//   var data = {
//     u: user,
//     p: pass,
//     m: phone,
//     c: content,
//   };
//   var content = querystring.stringify(data);
//   var sendmsg = '';
//   var options = {
//     hostname: smsapi,
//     path: '/sms?' + content,
//     method: 'GET',
//   };

//   var req = http.request(options, function (res) {
//     res.setEncoding('utf-8');
//     res.on('data', function (result) {
//       statusStr(result);
//     });
//     res.on('end', function () {});
//   });
//   req.on('error', function (err) {
//     console.error(err);
//   });
//   req.end();
// }

// function statusStr(result) {
//   switch (result) {
//     case '0':
//       console.log('短信发送成功');
//       break;
//     case '-1':
//       console.log('参数不全');
//       break;
//     case '-2':
//       console.log(
//         '服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！'
//       );
//       break;
//     case '30':
//       console.log('密码错误');
//       break;
//     case '40':
//       console.log('账户不存在');
//       break;
//     case '41':
//       console.log('余额不足');
//       break;
//     case '42':
//       console.log('账户已过期');
//       break;
//     case '43':
//       console.log('IP地址限制');
//       break;
//     case '50':
//       console.log('内容含有敏感字');
//       break;
//   }
// }
