import Vue from 'vue'
import Router from 'vue-router'
import movieRouter from './movie'
import cinemaRouter from './cinema'
import mineRouter from './mine'

Vue.use(Router)

export default new Router({
    mode: 'history',
    //base: process.env.BASE_URL,
    base: "miaomiao",
    scrollBehavior(to, from, savePosition) { // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
        //console.log(to) // to：要进入的目标路由对象，到哪里去
        //console.log(from) // from：离开的路由对象，哪里来
        //console.log(savePosition) // savePosition：会记录滚动条的坐标，点击前进/后退的时候记录值{x:?,y:?}
        if (savePosition) {
            return savePosition;
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        movieRouter,
        cinemaRouter,
        mineRouter,
        {
            path: "/*",
            redirect: "/movie"
        }
    ]
})