import axios from "axios"
import Vue from "vue"
import {MessageBox,Message} from "element-ui"
import {
    getToken,
    getTaqWs,//xspdc秘钥
    clearLocalUserInfo} from "@/utils/auth"
import i18n from "@/lang"
import store from "@/store"
import { request } from "http"

const service = axios.create({
    baseURL:'',
    timeout:100 * 1000
})

service.interceptors.request.use(
    config=>{
        config.headers['Authoriazation'] = getToken()
        config.headers['xspdc'] = getTaqWs()
        return config
    },
    error=>{
        return Promise.reject(error)
    }
)
//用户登出 清除资源
function logoutClearResource(){
    clearLocalUserInfo()
    store.dispatch('user/toggleLoginStatus',false)
    //清除可能存在的定时器
    const timers = store.getters.timers
    //倒序移除
    for(let i = timers.length-1;i>=0;i--){
        clearTimeout(timers[i])
        clearInterval(timer[i])
        timers.pop();
    }
}

//控制弹窗只会弹出一次
const onceReloadAlert = (()=>{
    let isAlerting = false
    return (message)=>{
        if(!isAlerting){
            isAlerting = true
            MessageBox.alert(
                message || i18n.t('utils.tokenBeOverdue'),
                i18n.t('public.title'),
                {
                    confirmButtonText:i18n.t('public.button.confirm'),
                    callback:action=>{
                        isAlerting = true
                        window.location.reload()
                    }
                }
            )
        }
    }
})()

//普通弹窗
const commonAlert = (message,title)=>{
    MessageBox.alert(
        message || i18n.t('utils.tokenBeOverdue'),
        i18n.t('public.title'),
        {
            confirmButtonText:i18n.t('public.button.confirm'),
            callback:action=>{
            }
        }
    )
}

//连接服务器失败提示  确保只会弹出一个提示框
const networkErrorAlert = (()=>{
    let isAlerted = false
    return ()=>{
        if(!isAlerted){
            isAlerted = true
            Vue.prototype.$showInfoAlert({
                message:i18n.t('utils.requestNetworkError'),
                callback:()=>{
                    //确保reload时不会弹出后面的提示
                    setTimeout(() => {
                        isAlerted = false
                    }, 50);
                    window.location.reload()
                }
            })
        }
    }
})()

//控制定时器请求 连接服务器失败弹窗控制器
const timerController = {
    count:0,
    isNetworkError(error){
        return error && error.toString().indexOf('Network')>=0
    },
    alertNetworkError(){
        if(++this.count === 3){
            networkErrorAlert()
            logoutClearResource()
        }
    },
    reset(){
        this.count = 0
    }
}

//超时提示 确保2s钟内只会提示一次
const timeoutAlert = (()=>{
    let isAlerted = false
    return ()=>{
        if(!isAlerted){
            isAlerted = true
            Vue.prototype.$showInfoAlert({
                message:i18n.t('utils.requestTimeout'),
                callback(){
                    isAlerted = false
                }
            })
        }
    }
})()

//转换错误信息
function convertError(error){
    const [response] = error
    if(response){
        const [status] = response
        if([401,403,405].includes(status)){
            const {data={}} = response
            const {detail} = data
            return new Error(detail || i18n.t('utils.tokenBeOverdue'))
        }
        //其他服务器错误
        return new Error(i18n.t('utils.serverError'))
    }
    //判断请求超时
    if(error && error.toString().indexOf('timeout')>=0){
        return new Error(i18n.t('utils.requestTimeout'))
    }
    //网络原因导致失败
    if(timerController.isNetworkError(error)){
        return new Error(i18n.t('utils.requestNetworkError'))
    }
}

//响应error处理
const err = (error)=>{
    const {config={}} = error
    const {headers = {}} = config
    const {'Response-No-Intercept':noIntercept,timer=false} = headers
    if(noIntercept){
        return Promise.reject(convertError(error))
    }
    if(error.response){
        const {status,data,config} = error.response
        if([401,403].includes(status)){
            logoutClearResource()
            onceReloadAlert(data.detail)
        }else if(status === 405){
            commonAlert(data.detail)
        }else if(status === 404){
            switch(config.url){
                case '/api/auth': //用户登录
                case 'api/auth/secure/check': //check定时检查
                break
            }
        }else{
            Message.closeAll()
            Message({
                message:error.description || i18n.t('utils.serverError'),
                type:'info',
                duration:5*1000
            })
        }
    }
    if(error && error.toString().indexOf('timeout')>=0){
        timeoutAlert()
        return Promise.reject(new Error(i18n.t('utils.requestTimeout')))
    }
    if(timerController.isNetworkError(error)){
        if(timer){
            timerController.alertNetworkError()
        }else{
            Message.closeAll()
            Message.info(i18n.t('utils.requestNetworkError'))
        }
        return Promise.reject(new Error(i18n.t('utils.requestNetworkError')))
    }
    return Promise.reject(error)
}

service.interceptors.response.use(
    response =>{
        const res = response.data
        if(res){
            res.headers = response.headers
        }
        //单独处理部分操作的异常状态202
        if(response.status === 202){
            Message.closeAll()
            Message({
                message:i18n.t('utils.requestSent'),
                type:'success',
                duration:5*1000
            })
            return
        }
        const {config:{headers:requestHeaders}} = response
        const {'Response-No-Intercept':noIntercept,timer=false} = requestHeaders
        if(timer){
            timerController.reset()
        }
        if(noIntercept){
            return res
        }
        if(response.config.url === '/api/auth'){
            return res
        }
        //以下为正常请求
        const errCodes = [-10,0,1,2]
        const configUrls = [
            '/api/iscsi/client_map_disks/add',
            '/api/iscsi/client_map_disks/remove',
            '/api/iscsi/host_group/disks',
            '/api/iscsi/host_group/clients',
            '/api/liscense/import_liscense'
        ]
        if(!res){
            return res
        }else if(response.config.url === '/api/image_bak/bak_config' && res.data && res.data.bak_ceph_conn === 1){
            return res
        }else if(typeof res.err_code === 'undefined'){
            return res
        }else if(errCodes.includes(res.err_code)){
            return res
        }else if(res.err_code === -1002){
            commonAlert(res.description)
            return res
        }else if(res.err_code === -1){
            Vue.prototype.$showInfoAlert({
                message:res.description || 'Error'
            })
            return Promise.reject(new Error(res.description || 'Error'))
        }else if(configUrls.includes(response.config.url)){
            return Promise.reject(res.description)
        }else if(response.config.url === '/api/image_bak/backup_connection_details'){
            return res
        }
        setTimeout(() => {
            Vue.prototype.$showInfoAlert({
                message:res.description || 'Error'
            })
        }, 0);
        return Promise.reject(new Error(res.description || 'Error'))
    },
    err=>console.log(err)
)

//采用弱引用  防止某些token未被移除掉 而导致内存泄漏
const tokenMap = new WeakMap()

//调用该函数生成取消的token
request.token = ()=>{
    let cancel = null
    const token = new axios.CancelToken(temp=>{
        cancel = temp
    })
    tokenMap.set(token,cancel)
    return token
}

//调用该函数 可以根据传入的 token取消指定token 可多传  如果不传值  则取消所有请求
request.cancel = (...args)=>{
    //不传递值  则取消所有请求
    args= args.length === 0?tokenMap.keys():args
    for(const token of args){
        if(tokenMap.has(token)){
            const cancel = tokenMap.get(token)
            cancel()
            tokenMap.delete(token)
        }
    }
}

//判断一个error是否是取消请求产生的错误
request.isCancel = error=>{
    return axios.isCancel(error)
}

//内部调用设置cancelToken方法
function _cancelToken(token=null){
    this.__cancelToken__ = token
    return this
}

//给请求头中添加Response-No-Intercept 默认为true
//如果参数为false 则会向请求头中添加Response-No-Intercept:true   否则不会添加该字段
function _intercept(flag =true){
    this.__intercept__ = flag
    return this
}
//给请求头添加timer字段 表示该请求会使用定时器轮询  参数不传默认为true 表示会添加定时器轮询操作
function _timer(flag=true){
    this.__timer__=flag
    return this
}

export default function request(options){
    const promise = Promise.resolve()
    const targetPromise = promise.then(()=>{
        //添加cancelToken
        if(targetPromise.__cancelToken__){
            Object.assign(options,{cancelToken:targetPromise.__cancelToken__})
        }
        //添加请求头Response-No-Intercept字段 表示该请求不需要再request中统一拦截处理
        if(!targetPromise.__intercept__){
            let {headers={}} = options
            headers = Object.assign(headers,{'Response-No-intercept':!targetPromise.__intercept__})
            Object.assign(options,{headers}) 
        }
        //添加请求头中timer字段  表示该请求会定时轮询请求
        if(targetPromise.__timer__){
            let {headers={}} = options
            headers = Object.assign(headers,{'timer':!targetPromise.__timer__})
            Object.assign(options,{headers})  
        }
        return service(options)
    })
    Object.assign(targetPromise,{
        cancelToken:_cancelToken,
        intercept:_intercept,
        timer:_timer,
    })
    return targetPromise
}
