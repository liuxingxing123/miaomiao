<template>
    <div>  
        <div>个人中心:</div> 
        <div>当前用户:{{$store.state.user.name}}</div>
        <a href="javascript:void(0);" @touchstart="handleToLogout">退出</a>
        <div v-if="$store.state.user.isAdmin">用户身份:管理员
            <a href="/admin" target="_blank">进入管理后台</a>
        </div>
        <div v-else>用户身份:普通成员</div>
        <div>
            <input type="file" name="file" @change="handleToUpload" value="上传头像">
            <img class="userHead" :src="$store.state.user.userHead" alt="">
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {messageBox} from "@/components/JS";

export default {
    name:"center",
    methods:{
        handleToLogout(){
            this.axios.get("/api2/users/logout").then((res)=>{
                let status = res.data.status;
                if(status===0){
                    window.localStorage.removeItem("name");
                    window.localStorage.removeItem("isAdmin");
                    window.localStorage.removeItem("userHead");
                    
                    this.$store.commit("user/USER_NAME",{name:"",isAdmin:false,userHead:""});
                    this.$router.push("/mine/login");
                }
            })
        },
        handleToUpload(ev){
            let file = ev.target.files[0];
            let param = new FormData();
            param.append("file",file,file.name);
            let config={
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            };
            this.axios.post("/api2/users/uploadUserHead",param,config).then((res)=>{
                let status = res.data.status;
                let This = this;
                if(status ===0){
                    messageBox({
                        title:"信息",
                        content:"上传头像成功",
                        ok:"确定",
                        handleOk(){
                            This.$store.commit("user/USER_NAME",{
                                name:This.$store.state.user.name,
                                isAdmin:This.$store.state.user.isAdmin,
                             userHead:res.data.data.userHead+"?"+Math.random()
                            })
                        }
                    })
                }else{
                    messageBox({
                        title:"信息",
                        content:"上传头像失败",
                        ok:"确定"
                    })
                }
            })
        }
    },
    beforeRouteEnter(to,from,next){
        axios.get("/api2/users/getUser").then((res)=>{
            let status = res.data.status;
            console.log(res)
            if(status === 0){
                next(vm=>{
                    window.localStorage.setItem("name",res.data.data.username);
                    window.localStorage.setItem("isAdmin",res.data.data.isAdmin);
                    window.localStorage.setItem("userHead",res.data.data.userHead);
                    vm.$store.commit("user/USER_NAME",{name:res.data.data.username,
                    isAdmin:res.data.data.isAdmin,
                    userHead:res.data.data.userHead
                    })
                })
            }else{
                next("/mine/login");
            }
        })
    }
}
</script>

<style scoped>
.userHead{
    width:100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
}
</style>
