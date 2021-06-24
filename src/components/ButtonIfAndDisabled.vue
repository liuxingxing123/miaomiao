<!--
适用情况：表格操作列按钮比较多且受权限控制
参数说明：
params  数组 按钮相关信息
data    对象 表格当前行信息
maxActions  number 直观显示按钮数，大于这个值时，部分按钮将放到更多里面
示例：
js
opeButtons:[
{
  title: this.$t('buttons.del'),
  action: (item) => {
    this.appDel(item);
  },
  check:this.$checkAuth(''),
  disabled:
},
{
  title: '编辑',
  action: (item) => {
    this.appDel(item);
  }
},
{
  title: '添加',
  action: (item) => {
    this.appDel(item);
  }
},
{
  title: '查看',
  action: (item) => {
    this.appDel(item);
  }
}
]
html:
<ButtonIfAndDisabled :opeButtons="opeButtons" :data="scope.row" :max-actions="3"></ButtonIfAndDisabled>
-->
<template>
    <div class="tableOPe btnComponent">
        <template v-for="(action,index) in actions">
            <el-tooltip class="item" effect="dark" v-if="textType&&textType=='icon'"
                        :content="typeof action.title === 'function' ? action.title(data) : action.title" placement="top"
                        :key="i">
                <el-button :id="action.id"  type="text" size="small" :style="(index==0?`padding-right:6px;`:'') + (index==2?`padding-left:6px;`:'')"
                           :icon="action.icon"
                           :disabled="typeof action.disabled === 'function' ? action.disabled(data) : action.disabled" @click.native.prevent="typeof action.disabled === 'function' ? (action.disabled(data) ? null : action.action(data)) : (action.disabled ? null : action.action(data))">
                </el-button>
            </el-tooltip>
            <el-button :id="action.id"  type="text" size="small" v-else
                       :style="(index==0?`padding-right:6px;`:'') + (index==2?`padding-left:6px;`:'')"
                       :disabled="typeof action.disabled === 'function' ? action.disabled(data) : action.disabled"
                       @click.native.prevent="typeof action.disabled === 'function' ? (action.disabled(data) ? null : action.action(data)) : (action.disabled ? null : action.action(data))">
                {{typeof action.title === 'function' ? action.title(data) : action.title}}
            </el-button>
        </template>
        <el-dropdown v-if="moreActions.length>0" style="margin-left: -5px;" trigger="hover" size="small">
            <el-tooltip class="item" effect="dark" content="更多" v-if="textType&&textType=='icon'"  placement="top">
                <el-button icon="bn bnmore"  type="text" size="small">
                </el-button>
            </el-tooltip>
            <el-button v-else  type="text" size="small">{{$t('buttons.more')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" size="small">
                <template v-for="action in moreActions">
                    <el-dropdown-item size="small" @click.native="typeof action.disabled === 'function' ? (action.disabled(data) ? null : action.action(data)) : (action.disabled ? null : action.action(data))"
                                   :disabled="typeof action.disabled === 'function' ? action.disabled(data) : action.disabled">
                        <el-button :id="action.id" type="text" :icon="action.icon"
                                   :disabled="typeof action.disabled === 'function' ? action.disabled(data) : action.disabled">
                            {{typeof action.title === 'function' ? action.title(data) : action.title}}</el-button>
                    </el-dropdown-item>
                </template>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
export default {
    props: ['opeButtons', 'data', 'maxActions', 'textType'],
    computed: {
        buttons(){
            const arr = []
            this.opeButtons.forEach(item => {
                if (typeof item.check === 'function' ? item.check(this.data) : item.check){
                    arr.push(item)
                }
            })
            return arr
        },
        actions() {
            const arr = this.buttons
            return arr.length <= this.maxActions ? arr : arr.slice(0, this.maxActions - 1)
        },
        moreActions(){
            const arr = this.buttons
            return arr.length <= this.maxActions ? [] : arr.slice(this.maxActions - 1)
        }
    }
}
</script>
<style scoped type="less">
    .btnPd{
        padding-right: 6px;
    }
    .el-button i {
        font-size: 15px!important;
    }
</style>
