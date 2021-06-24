<template>
  <el-pagination
    :current-page="pageParams.currPageNum"
    :page-sizes="pageSizes"
    background
    class="pageCls"
    :page-size="pageParams.pageSize"
    :total="pageParams.total"
    @size-change="onPageSizeChange"
    @current-change="onCurrentPageChange"
    layout="total, sizes, prev, pager, next, jumper"
    size="small"
  ></el-pagination>
</template>

<script>
const PAGE_SIZES = [10,20,30,40,50,100];

export default {
  name: 'Pagination',
  props: {
    pageParams:{
        type:Object,
        default:{
            currPageNum:1,
            pageSize:10,
            total:0
        }
    },
    pageSizes:{
        type: Array,
        default() {
            return PAGE_SIZES;
        },
    }
  },
  data() {
    return {
      PAGE_SIZES,
    };
  },
  computed: {
  },
  watch: {},
  methods: {
    onPageSizeChange(val) {
      this.$emit('pageParamsChange', {
        ...this.pageParams,
        pageSize: val
      });
    },
    onCurrentPageChange(val) {
      this.$emit('pageParamsChange', {
        ...this.pageParams,
        currPageNum:val
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
