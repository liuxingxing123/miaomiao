let crypto = require("crypto");
let captcha = require("trek-captcha");

let setCrypto = (info)=>{
    return crypto.createHmac("sha256",'$%$%^jskads')
        .update(info).digest('hex');
}

let createVerifyImg = (req,res)=>{
    return captcha().then((info)=>{
        req.session.verifyImg = info.token;
        return info.buffer;
    }).catch(()=>{
        return false;
    })
}
module.exports = {
    setCrypto,createVerifyImg
}