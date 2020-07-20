import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from './stores'

import axios from "axios"
Vue.prototype.axios = axios

Vue.filter("setWH", (url, arg) => {
    return url.replace(/w\.h/, arg);
})

/**
 * 人性化时间处理 传入时间戳
 */
function beautify_time(timestamp){
    var mistiming = Math.round(new Date() / 1000)-timestamp;
    var postfix = mistiming>0 ? '前' : '后'
    mistiming = Math.abs(mistiming)
    var arrr = ['年','个月','星期','天','小时','分钟','秒'];
    var arrn = [31536000,2592000,604800,86400,3600,60,1];
 
    for(var i=0; i<7; i++){
        var inm = Math.floor(mistiming/arrn[i])
        if(inm!=0){
            return inm+arrr[i] + postfix
        }
    }
}

import Scroller from "@/components/Scroller";
Vue.component("Scroller", Scroller)

import Loading from "@/components/Loading";
Vue.component("Loading", Loading)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
