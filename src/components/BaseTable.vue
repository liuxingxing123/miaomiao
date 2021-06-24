<template>
  <div>
    <el-table
      ref="table"
      :data="tableData"
      v-loading="tableLoading"
      header-row-class-name="tableHeader"
      :height="tableWidth"
      @sort-change="sortChange"
      @selection-change="handleSeletionChange" :row-key="getRowKey"
    >
    <!-- 表格列表前面做的操作，可以多选 -->
        <template v-if="selectShow">
          <el-table-column :reserve-selection="true" type="selection" width="55">
          </el-table-column>
        </template>
      <template v-for="(item) in tableList">
        <!-- 列表中复杂操作 -->
        <slot v-if="item.slot" :name="item.prop"></slot>
        <el-table-column v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.showOverflowTooltip"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <label v-if="item.filter">{{calcFilter(scope.row[item.prop], item.filter, scope.row[item.filterData])}} </label>
            <label v-else>{{item.prefix}}{{scope.row[item.prop]}}{{item.suffix}}</label>
          </template>
        </el-table-column>
      </template>
      <!-- 表格里面的末尾操作列 -->
      <template>
        <slot></slot>
      </template>
      <div slot="empty">
        <no-data style="padding-bottom: 20px" />
      </div>
    </el-table>
    <div v-if="showPage">
      <div class="line" />
      <my-pagination
        :pageParams="pageParams"
        @pageParamsChange="pageParamsChange"
      ></my-pagination>
    </div>
  </div>
</template>

<script>
import myPagination from './myPagination';
import filterOptions from './filterOptions'
/* 
<my-table
      :tableList="tableList"
      :tableLoading="tableLoading"
      :tableData="tableData"
      :pageParams="{
          currPageNum: query.currPageNum,
          pageSize: query.pageSize,
          total: total
      }"
      @pageParamsChange="pageParamsChange"
    >
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <ButtonIfAndDisabled
            :ope-buttons="tagSetting"
            text-type="icon"
            :data="scope.row"
            :max-actions="3"
          />
        </template>
      </el-table-column>
    </my-table>
    
    // 改变页码
        pageParamsChange(pages){
            const { currPageNum , pageSize } = pages;
            this.pageParams = {
                ...this.pageParams,
                currPageNum,
                pageSize
            }
            this.getPublishList()
        },
 */
export default {
  name: 'BaseTable',
  props: {
    tableWidth: {
      default: null
    },
    tableLoading:{
      type:Boolean,
      default:false
    },
    tableList: {
      required: true,
      type: Array,
    },
    tableData: {
      type: Array,
      default() {
        return []
      },
    },
    pageParams:{
        type:Object,
        default:{
            currPageNum:1,
            pageSize:10,
            total:0
        }
    },
    selectShow: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: String,
    },
    showPage:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      filterOptions:filterOptions
    }
  },
  components: {
    myPagination,
  },
  methods: {
    calcFilter(data,filter, filterData) {
      if(filterData) {
        return this.filterOptions[filter](data, filterData);
      } else {
        return this.filterOptions[filter](data);
      }

    },
    //当前页展示条数变化 页数改变
    pageParamsChange(page) {
      this.$emit('pageParamsChange', page);
    },
    sortChange(column) {
      let orders = column.order == 'ascending' ? column.order.substr(0, 3) : column.order.substr(0, 4)
      let sort = {
        sortFiled: column.prop,
        sortValue: orders,
      };
      this.$emit('refresh',sort);
    },
    handleSeletionChange(val) {
      this.$emit('handleSeletionChange', val);
    },
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    getRowKey(row) {
      if(this.selectShow) {
        return row[this.rowKey];
      }
    },
    clearSort() {
      this.$refs.table.clearSort();
    },
    //
    toggleAllSelection() {
      this.$refs.table.toggleAllSelection();
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
