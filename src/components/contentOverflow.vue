<template>
  <div v-if="contentValue">
    <el-popover
      popper-class="configValueTip"
      placement="bottom"
      width="350"
      trigger="hover"
    >
      <!--<div v-html="scope.row.entity.firstEntity.value.replace(/[(\r\n)\r\n]+/g,'<br/>')" />-->
      <div class="stringBreak">{{contentValue}}</div>
      <el-button slot="reference" type="text">
        <span class="hasTagOverflow">{{contentValue}}</span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
//api文档自动生成模板
/**
  <contentOverflow :rowData="row" :rowDataFileds="['entity', 'firstEntity', 'value']"/>
   */

export default {
  name:'contentOverflow',
  components: {},
  props: {
    rowData:{
      type:Object,
      default:()=>({})
    },
    rowDataFileds:{
      type:Array,
      default:()=>[]
    }
  },
  data () {
    return {

    };
  },
  //监听属性 类似于data概念
  computed: {
    contentValue(){
      return this.getIn(this.rowDataFileds, this.rowData)
    }
  },
  //监控data中的数据变化
  watch: {},

  methods: {
      getIn(fieldArr, obj) {
        return fieldArr.reduce(function(prev, next) {
          return (prev && prev[next]) ? prev[next] : null;
        }, obj);
      }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () { },
  beforeMount () { },
  beforeUpdate () { },
  updated () { },
  beforeDestroy () { },
  destroyed () { },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated () { },
}
</script>
