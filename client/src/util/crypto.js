/**
 * 通过crypto-js实现 加解密工具
 * AES、HASH(MD5、SHA256)、base64
 * @author: ldy
 */
import CryptoJS from "crypto-js";

import NodeRSA from 'node-rsa'
const KP = {
  key: "1234567812345678", // 秘钥 16*n:
  iv: "1234567812345678" // 偏移量
};
//生成一个32位的随机名称
function newname() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "" + S4() + "" + S4() + "" + S4() + "" + S4() + S4() + S4());
}
function getAesString(data, key, iv) {
  // 加密
  key = CryptoJS.enc.Utf8.parse(key);
  // alert(key）;
  iv = CryptoJS.enc.Utf8.parse(iv);
  let encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString(); // 返回的是base64格式的密文
}
function getDAesString(encrypted, key, iv) {
  // 解密
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8); //
}
// AES 对称秘钥加密
const aes = {
  en: data => getAesString(data, KP.key, KP.iv),
  de: data => getDAesString(data, KP.key, KP.iv)
};
// BASE64
const base64 = {
  en: data => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: data => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
};
// SHA256
const sha256 = data => {
  return CryptoJS.SHA256(data).toString();
};
// MD5
const md5 = data => {
  return CryptoJS.MD5(data).toString();
};

var rsa_key;
const rsa = {
  /*
   * 重置密钥对
   * @param key:存储密钥对的key
   */
  reload: (key) => {
    key = key || "rsa_key_info";
    rsa_key = new NodeRSA({ b: 1024 });
    var rsa_key_info = {
      pubkey: rsa_key.exportKey("pkcs8-public-pem"),
      prikey: rsa_key.exportKey("pkcs8-private-pem")
    };
    console.log("rsa_key_info.prikey", rsa_key_info.prikey)
    sessionStorage.setItem(key, JSON.stringify(rsa_key_info));
  },
  /*
   * 获得公钥
   * @param key:存储密钥对的key
   */
  getpubkey: (key) => {
    var t = this;
    var ret = "";
    key = key || "rsa_key_info";
    var rsa_key_info = sessionStorage.getItem(key);
    if (!rsa_key_info) {
      rsa.reload(key);
      ret = rsa_key.exportKey("pkcs8-public-pem");
    }
    else {
      rsa_key_info = JSON.parse(rsa_key_info);
      ret = rsa_key_info.pubkey;
    }
    return ret;
  },
  /*
   * 获得公钥
   * @param key:存储密钥对的key
   */
  getpubkey_string: (key) => {
    var ret = rsa.getpubkey(key);
    ret = ret.replace(/\n/g, '');
    ret = ret.replace('-----BEGIN PUBLIC KEY-----', '');
    ret = ret.replace('-----END PUBLIC KEY-----', '');
    console.log("getpubkey_string.pubkey", ret)
    return ret;
  },
  /*
   * 加密
   * @param key:存储密钥对的key
   * @param content:准备加密的内容
   */
  encrypt: (key, content) => {
    key = key || "rsa_key_info";
    var rsa_key_info = sessionStorage.getItem(key);
    if (!rsa_key_info) throw '不存在这个key，加密失败';
    rsa_key_info = JSON.parse(rsa_key_info);
    const nodersa = new NodeRSA(rsa_key_info.prikey);
    nodersa.setOptions({ encryptionScheme: 'pkcs1' }); // 必须加上，加密方式问题。
    return nodersa.encrypt(content, 'base64');
  },
  /*
   * 传入公钥加密
   * @param pubkey:公钥
   * @param content:准备加密的内容
   */
  encrypt_pub: (pubkey, content) => {
    const nodersa = new NodeRSA(pubkey);
    nodersa.setOptions({ encryptionScheme: 'pkcs1' }); // 必须加上，加密方式问题。
    return nodersa.encrypt(content, 'base64');
  },
  /*
   * 解密
   * @param key:存储密钥对的key
   * @param en_content:准备解密的内容
   */
  decrypt: (key, en_content) => {
    key = key || "rsa_key_info";
    var rsa_key_info = sessionStorage.getItem(key);
    if (!rsa_key_info) throw '不存在这个key，解密失败';
    rsa_key_info = JSON.parse(rsa_key_info);
    console.log("rsa_key_info.prikey", rsa_key_info.prikey)
    const nodersa = new NodeRSA(rsa_key_info.prikey);
    nodersa.setOptions({ encryptionScheme: 'pkcs1' }); // 必须加上，加密方式问题。
    return nodersa.decrypt(en_content, 'utf8');
  }
}
/**
 * 签名
 * @param token 身份令牌
 * @param timestamp 签名时间戳
 * @param data 签名数据
 */
const sign = (token, timestamp, data) => {
  // 签名格式： timestamp + token + data(字典升序)
  var convertData = data;
  // console.log("sign data",data);
  if (typeof data == "object") {
    convertData="";
    var dataJson = {};
    //把所有key值改成小写
    for (let it in data) {
      if (it.toLowerCase() == "file") continue;
      dataJson[it.toLowerCase()] = data[it];
    }
    //获得字典序键
    var keys = Object.keys(dataJson).sort();
    for (let index = 0; index < keys.length; index++) {
      const it = keys[index];
      let val = dataJson[it];
      if (
        typeof val === "object" && //
        (!(val instanceof Array) ||
          (val.length > 0 && typeof val[0] === "object"))
      ) {
        val = JSON.stringify(val);
      }
      convertData += (it.toLowerCase() + ((val == null || val == 'null' || typeof val == 'undefined') ? "" : val));
    }
  }
  // console.log("convertData",convertData)
  let signsrc = timestamp + token + convertData;
  // console.log("sign begin")
  console.log(signsrc)
  return md5(signsrc);
};
export { aes, rsa, md5, sha256, base64, sign, newname };
