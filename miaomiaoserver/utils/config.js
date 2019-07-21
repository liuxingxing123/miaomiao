let mongoose = require("mongoose");
let nodemailer = require("nodemailer");

let Mongoose = {
    url:"mongodb://localhost:27017/miaomiao",
    connect(){
        mongoose.connect(this.url,{useNewUrlParser: true},(err)=>{
            if(err){
                console.log("数据库连接失败");
                return ;
            }
            console.log("数据库连接成功");
        })
    }
}
let Email = {
    config:{
        server: "smtp.qq.com",
        port: 587,
        auth: {
            user: "1562052471@qq.com", // generated ethereal user
            pass: "rqpxmqfyusaqhgca"// generated ethereal password
        }
    },
    get transporter(){
        return nodemailer.createTransport(this.config);
    },
    get verify(){
        return Math.random().toString().substring(2,6);
    },

    get time(){
        return Date.now();
    }
}

let Head = {
    baseUrl:"http://localhost:3000/uploads/"
}
module.exports = {Mongoose,Email,Head}