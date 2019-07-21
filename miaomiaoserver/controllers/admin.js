let UserModel = require("../models/users.js");

let index = async (req,res,next)=>{
    res.send({
        msg:"管理员权限",
        status:0
    })
}
let usersList = async (req,res,next)=>{
    let result = await  UserModel.usersList();
    if(result){
        res.send({
            msg:"所有用户信息",
            status:0,
            data:{
                usersList:result
            }
        })
    }else{
        res.send({
            msg:"获取用户信息失败",
            status:-1
        })
    }
}

let updateFreeze = async (req,res,next)=>{
    let {email,isFreeze} = req.body;
    let result = await  UserModel.updateFreeze(email,isFreeze);
    if(result){
        res.send({
            msg:"账号冻结操作成功",
            status:0
        })
    }else{
        res.send({
            msg:"账号冻结操作失败",
            status:-1
        })
    }
}
let deleteUser = async (req,res,next)=>{
    let {email} = req.body;
    let result = await  UserModel.deleteUser(email);
    if(result){
        res.send({
            msg:"账号删除操作成功",
            status:0
        })
    }else{
        res.send({
            msg:"账号删除操作失败",
            status:-1
        })
    }
}
module.exports = {
    index,usersList,updateFreeze,deleteUser
}