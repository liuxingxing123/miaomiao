let mongoose = require("mongoose");
mongoose.set("useCreateIndex",true);
let {Head} = require("../utils/config.js");
let UserSchema= new mongoose.Schema({
    username:{type:String,required:true,index:{unique:true}},
    password:{type:String,required:true},
    email:{type:String,required:true,index:{unique:true}},
    date:{type:Date,default:Date.now()},
    isAdmin:{type:Boolean,default:false},
    isFreeze:{type:Boolean,default:false},
    userHead:{type:String,default:Head.baseUrl+"default.jpg"}
})

let UserModel = mongoose.model("user",UserSchema);
UserModel.createIndexes()
//UserModel.createIndex();
let save = (data)=>{
    let user = new UserModel(data);
    return user.save().
            then(()=>{
                return true;
            }).catch(()=>{
                return false;
            })
}

let findLogin = (data)=>{
    return UserModel.findOne(data);
}
let updatePassword = (email,password)=>{
    return UserModel.update({email},{$set:{password}})
        .then(()=>{
            return true;
        }).catch(()=>{
            return false;
        })
}

let usersList = ()=>{
    return UserModel.find();
}

let updateFreeze = (email,isFreeze)=>{
    return UserModel.update({email},{$set:{isFreeze}})
        .then(()=>{
            return true;
        }).catch(()=>{
            return false;
        })
}

let deleteUser = (email)=>{
    return UserModel.deleteOne({email});
}

let updateUserHead = (username,userHead)=>{
    console.log(username,userHead)
    return UserModel.update({username},{$set:{userHead}})
        .then(()=>{
            return true;
        }).catch(()=>{
            return false;
        })
}
module.exports = {
    save,findLogin,updatePassword,usersList,updateFreeze,deleteUser,updateUserHead
}