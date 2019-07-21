let {Email,Head} = require("../utils/config.js");
let UserModel = require("../models/users.js");
let {setCrypto,createVerifyImg}  =require("../utils/base.js");
let fs = require("fs");

let login= async (req,res,next)=>{
    let {username,password} = req.body;
    let result = await UserModel.findLogin({
        username,password
    })

    if(result){
        req.session.username = username;
        req.session.isAdmin = result.isAdmin;
        req.session.userHead = result.userHead;
        if(result.isFreeze){
            res.send({
                msg:"账号已冻结 ",
                status:-2
            })
        }else{
            res.send({
                msg:"登陆成功",
                status:0
            })
        }

    }else{
        res.send({
            msg:"登录失败",
            status:-1
        })
    }
}

let register= async (req,res,next)=>{
    let {username,password,email,verify} = req.body;
    console.log(req.body)
    if(email!==req.session.email || verify!==req.session.verify){
        res.send({
            msg:"验证码错误",
            status:-1
        })
        return;
    }
    if((Email.time-req.session.time)/1000>60){
        res.send({
            msg:"验证码已过期",
            status:-3
        })
        return;
    }
    let result = await UserModel.save({
        username,password,email
    })
    if(result){
        res.send({
            msg:"注册成功",
            status:0
        })
    }else{
        res.send({
            msg:"注册失败",
            status:-2
        })
    }

}

let verify= async (req,res,next)=>{
    let email = req.query.email;
    let verify = Email.verfiy;

    req.session.verify = verify;
    req.session.email = email;
    req.session.time = Email.time;
    let mailOptions = {
        from: '"喵喵网 1562052471@qq.com', // sender address
        to:email , // list of receivers
        subject: "喵喵网邮箱验证码", // Subject line
        text: "验证码:"+verify, // plain text body
    };
    await Email.transporter.sendMail(mailOptions,(err)=>{
        if(err){
            console.log(err)
            res.send({
                msg:"验证码发送失败",
                status:-1
            })
        }else{
            res.send({
                msg:"验证码发送成功",
                status:0
            })
        }
    });

}

let logout= async (req,res,next)=>{
    req.session.username = "";
    res.send({
        msg:"退出成功",status:0
    })
}

let getUser= async (req,res,next)=>{
    if(req.session.username){
        console.log(req.session.userHead)
        res.send({
            msg:"获取用户信息成功",
            status:0,
            data:{
                username:req.session.username,
                isAdmin:req.session.isAdmin,
                userHead:req.session.userHead+"?"+Math.random()
            }
        })
    }else{
        res.send({
            msg:"获取用户信息失败",
            status:-1,
        })
    }
}

let findPassword= async (req,res,next)=>{
    let {email,password,verify} = req.body;
    if(email === req.session.email && verify === req.session.verify){
        let result= await UserModel.updatePassword(email,setCrypto(password));
        if(result){
            res.send({
                msg:"修改密码成功",
                status:0
            })
        }else{
            res.send({
                msg:"修改密码失败",
                status:-2
            })
        }
    }else{
        res.send({
            msg:"验证码失败",
            status:-1
        })
    }
}

let verifyImg = async (req,res)=>{
    let result = await createVerifyImg(req,res);
    if(result){
        res.send(result);
    }
}

let uploadUserHead = async (req,res,next)=>{
    console.log(req.file)
    await fs.rename("public/uploads/"+req.file.filename,"public/uploads/"+req.session.username+".jpg",(err)=>{
        console.log("重命名成功")
    });
    let result = await UserModel.updateUserHead(req.session.username,Head.baseUrl+req.session.username+".jpg");
    if(result){
        res.send({
            msg:"头像修改成功",
            status:0,
            data:{
                userHead:Head.baseUrl+req.session.username+".jpg"
            }
        })
    }else{
        res.send({
            msg:"头像修改失败",
            status:-1
        })
    }
}


module.exports = {
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword,
    verifyImg,
    uploadUserHead
}