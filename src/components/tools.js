import { Message } from 'element-ui';
import CryptoJS from 'crypto-js'
// 下载
function download(address, name) {
    if (!address || address === 'null') {
        Message.warning('搜索结果为空，无需下载！');
        return false;
    }
    const pdfUrl = window.URL.createObjectURL(new Blob([address], { type: 'application/vnd.ms-excel,charset=utf-8' }));
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
}
// 判断是否是生产环境变量
function noProEnv(envData){
    let Data = {};
    if(envData){
        Data = envData
    }else{
        Data = localStorage.envData? JSON.parse(localStorage.envData):{};
    }
    const { enName } = Data;
    if(!['PROD1','PROD2'].includes(enName)&&process.env.NODE_ENV==='PRO')
        return true;
    else
        return false
}
//加密
function Encrypt(word) {
  let key = 'wwwbocloudcnv587';
  let iv = 'bocloudcomnbv587';

  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);

  let srcs = CryptoJS.enc.Utf8.parse(word);
  // 加密模式为CBC，补码方式为PKCS5Padding（也就是PKCS7）
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  //返回base64
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

}
//解密
function Decrypt(word) {
  let key = 'wwwbocloudcnv587';
  let iv = 'bocloudcomnbv587';

  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);

  let base64 = CryptoJS.enc.Base64.parse(word);

  let src = CryptoJS.enc.Base64.stringify(base64);

  // 解密模式为CBC，补码方式为PKCS5Padding（也就是PKCS7）
  let decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();

}
//时间格式转换
function format () {
  let time = new Date()
  time = time.getFullYear().toString() +
    (time.getMonth().toString().length==2?time.getMonth()+1:'0'+(time.getMonth()+1)) +
    ( time.getDate().toString().length==2?time.getDate():'0'+time.getDate()) +
    ( time.getHours().toString().length==2?time.getHours():'0'+time.getHours()) +
    ( time.getMinutes().toString().length==2?time.getMinutes():'0'+time.getMinutes()) +
    ( time.getSeconds().toString().length==2?time.getSeconds():'0'+time.getSeconds())
  return time;
}
const nameArr = [
    'resourceM',
    'release',
    'configManage',
    'resourceManage',
    'configCenter',
    'deployRelease',
    'serviceHistoryDetail',
    'releasecreateId',
    'releaseExecuteDetailEdit',
    // 'releaseExecuteDetail',
    'releaseCreate',
    'systemHistoryDetail',
    'deployReleaseHistoryDetailEditId',
    'deployReleaseHistoryDetailEdit',
    'deployReleaseCreate',
    'deployReleaseEdit',
    'deployReleaseHistory',
    'releaseHistoryId'
]
export default {
    download,
    noProEnv,
    nameArr,
    Encrypt,
    Decrypt,
    format
}
