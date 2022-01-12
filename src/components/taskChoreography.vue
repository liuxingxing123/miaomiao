<template>
    <div>
        <div v-if="!showHistory && !showHistoryDetail">
            <div style="margin-bottom:15px;">
               <el-button
                  v-if="true || $checkAuth('menu.check.addTask')"
                  type="primary"
                  icon="el-icon-plus"
                  @click="createTask()"
              >
                  新增任务
              </el-button>
                <el-form
                    :inline="true"
                    :model="query"
                    style="margin-top: 0;float:right"
                    @submit.native.prevent
                >
                    <el-form-item>
                        <el-input
                            v-model="query.taskName"
                            placeholder="请输入名称"
                            clearable
                            @keyup.enter.native="search()"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="button"
                            icon="el-icon-search"
                            class="el-button search-btn"
                            @click="search()"
                        >
                            搜索
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-card style="border:1px solid #e0e0e0;border-radius:6px;width:100%;">
                <el-table
                    v-loading="tableLoading"
                    :data="taskList"
                    max-height="320"
                >
                    <el-table-column
                        label="任务名称"
                        prop="taskName"
                        show-overflow-tooltip
                    >
                    <template slot-scope="{row}">
                        <span v-if="['EXECUTING','AWAIT_RUN'].includes(row.runStatus)">{{ row.taskName }}</span>
                        <el-link v-else style="color:#4072dc;font-size:12px;" :underline="false"  @click="history(row)">{{ row.taskName }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="检查项" show-overflow-tooltip>
                        <template slot-scope="scope">
                           {{ scope.row.checkNames.join(',') }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="对比周期"
                        prop="startTime"
                        show-overflow-tooltip
                    />
                    <el-table-column
                        label="执行状态"
                        prop="runStatus"
                    >
                        <template slot-scope="{row}">
                            <el-tag :type="statusDotObj(row).type">
                              <i :class="statusDotObj(row).icon"></i>
                              {{statusDotObj(row).label}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="是否启用"
                        prop="enable"
                    >
                        <template slot-scope="{row}">
                            <!-- <el-switch
                                v-model="scope.row.runStatus == 'EXECUTING'"
                                :disabled="scope.row.runStatus=='EXECUTED'"
                                @change="changeSudo(scope.row)"
                            /> -->
                            <span>{{row.enable?'是':'否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="160px"
                    >
                        <template slot-scope="scope">
                            <ButtonIfAndDisabled
                                :ope-buttons="opeButtons"
                                text-type="icon"
                                :data="scope.row"
                                :max-actions="3"
                            />
                        </template>
                    </el-table-column>
                    <template slot="empty">
                        <no-data style="padding-bottom:20px" />
                    </template>
                </el-table>
                <div class="line" />
                <el-pagination
                    :current-page.sync="query.currPageNum"
                    :page-size="query.pageSize"
                    background
                    class="pageCls"
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="total"
                    size="small"
                    @current-change="getList"
                    @size-change="changeSizeHandler"
                />
            </el-card>
        </div>
        <performHistory
            v-if="showHistory"
            :showHistoryRowData="showHistoryRowData"
            @closeShowHistory="closeShowHistory"
            @back="performHistoryback"
        />
        <performHistoryDetail
            v-if="showHistoryDetail"
            :showHistoryDetailRowData="showHistoryDetailRowData"
            @back="detailBack"
            :checkData="checkData"
            @backCompareResult="backCompareResult"
        />
        <createTask
            :activeTab="activeTab"
            :add-task-dialog="addTaskDialog"
            :task-data="taskData"
            @addTaskDone="addTaskDone"
            @cancelAddTask="cancelAddTask"
        />
    </div>
</template>

<script>
import ButtonIfAndDisabled from '@/components/ButtonIfAndDisabled.vue'
import performHistory from './performHistory'
import performHistoryDetail from './performHistoryDetail'
import createTask from './createTask'

export default {
    components: {
        ButtonIfAndDisabled,
        performHistory,
        createTask,
        performHistoryDetail
    },
    props: ['activeTab','checkData'],
    data() {
        return {
            addTaskDialog: false,
            orderStatusOptions:[
                {
                    label: '执行成功',
                    value: 'EXECUTED',
                    type: 'success',
                    icon:'el-icon-circle-check'
                },
                {
                    label: '执行中',
                    value: 'EXECUTING',
                    type: '',
                    icon:'el-icon-remove-outline'
                },
                {
                    label: '待执行',
                    value: 'AWAIT_RUN',
                    type: 'info',
                    icon:'bn bnweihuzhong'
                },
                {
                    label: '暂停',
                    value: 'SUSPEND',
                    type: 'danger',
                    icon:'bn bnfrozen'
                },
                {
                    label: '执行失败',
                    value: 'STATUS_FAIL',
                    type: 'warning',
                    icon:'el-icon-warning-outline'
                },
            ],
            taskData: null,
            total: 0,
            taskList: [],
            query: {
                currPageNum: 1,
                pageSize: 10,
                taskName: ''
            },
            taskTimer:null,
            tableLoading: false,
            showHistory: false,
            showHistoryRowData:null,
            showHistoryDetail:false,
            showHistoryDetailRowData:null,
            opeButtons: [
                {
                    icon: 'bn bnedit',
                    title: '编辑',
                    action: item => {
                        this.createTask(item)
                    },
                    check: item => true || this.$checkAuth('menu.check.editTask'),
                    disabled: item => false
                },
                {
                    icon: 'bn bndelete',
                    title: '删除',
                    action: item => {
                        this.deleteTask(item)
                    },
                    check: item =>true || this.$checkAuth('menu.check.delTask'),
                    disabled: item => false
                },
                {
                    title: '立即执行',
                    icon: 'el-icon-video-play',
                    check:(item) => {
                        return true || this.$checkAuth('menus.taskChoreography.performApi')
                    },
                    disabled:(item) => {
                        return false
                    },
                    action: (item) => {
                        this.perform(item);
                    }
                },
                {
                    title: '执行历史',
                    icon: 'el-icon-time',
                    check: item => true || this.$checkAuth('menu.check.taskHistory'),
                    disabled: item => ['EXECUTING','AWAIT_RUN'].includes(item.runStatus),
                    action: item => {
                        this.history(item)
                    }
                }
            ]
        }
    },

    computed: {
        
    },
    watch: {
        '$store.state.environmental': {
            handler(){
                this.search()
            }
        },
        "checkData":{
          handler(val){
            if(val){
              this.showHistory = false
              this.showHistoryDetail = true
              const {checkItemId,checkItemName,taskExecuteTime,taskId,taskName} = val
              this.showHistoryDetailRowData = {
                name:checkItemName,
                modifyTime:taskExecuteTime,
                id:checkItemId,
                taskId
              }
            }else{
              this.getList()
            }
          },
          immediate:true
        },
        "taskList":{
          handler(val){
           this.processData(val,'taskTimer','getList')
          },
          immediate:true,
          deep:true
        }
    },
    mounted(){
       
    },
    destroyed(){
      clearInterval(this.taskTimer)
    },
    methods: {
        processData(val,timer,method){
          if(val.length){
            this[timer] = setTimeout(()=>{
              this[method]()
            },10000)
          }else{
            clearTimeout(this[timer])
          }
        },
        backCompareResult(){
          this.$emit("goCompareResult")
        },
        statusDotObj(row){
          return this.orderStatusOptions?.find(item=>item.value===row.runStatus)??{
                    label: '执行成功',
                    value: 'EXECUTED',
                    type: 'success',
                    icon:'el-icon-circle-check'
                }
        },
        closeShowHistory(rowData){
          this.showHistory = false
          this.showHistoryDetail = true
          this.showHistoryDetailRowData = rowData
          this.taskList = []
        },
        detailBack(){
          this.showHistory = true
          this.showHistoryDetail = false
          this.taskList = []
        },
        performHistoryback(){
          this.showHistory = false
          this.showHistoryDetail = false
          this.getList()
        },
        createTask(row) {
            this.addTaskDialog = true
            if (row) {
                this.taskData = JSON.parse(JSON.stringify(row))
            } else {
                this.taskData = null
            }
        },
        addTaskDone(){
            this.addTaskDialog = false
            this.getList()
        },
        cancelAddTask(){
            this.addTaskDialog = false
        },
        getList() {
            clearInterval(this.taskTimer)
            this.taskTimer = null
            this.tableLoading = true
            const { taskName,currPageNum ,pageSize} = this.query
            const params = {
                currPageNum,
                pageSize,
                sidx: '',
                sord: '',
                serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                taskName,
                //compareEnvId: this.activeTab,
                envId:localStorage.environmental || this.$store.state.environmental || 1
            }
            this.$http.getStandardCompareTaskList(params).then(res => {
                this.tableLoading = false
                if (res.data.success) {
                    const { totalCount, rows } = res.data
                    this.taskList = rows || []
                    this.total = totalCount || 0
                    this.taskList.forEach(item => {
                        item.checkNames = []
                        if (item.checkitemList){
                            item.checkitemList.forEach(i => {
                                item.checkNames.push(i.name)
                            })
                        }
                    })
                } else {
                    this.$popError(res.data.message)
                    this.taskList = []
                    this.total = 0
                }
            })
        },
        search() {
            this.query.currPageNum = 1
            this.getList()
        },
        deleteTask(row) {
            this.$confirm('是否确认删除该任务？', `删除 - ${row.taskName}`, {
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                this.$http.deleteStandardCompareTask({ taskId: row.id }).then(res => {
                    if (res.data.state === 'success') {
                        this.$popSuccess(res.data.message)
                        this.getList()
                    } else {
                        this.$popError(res.data.message)
                    }
                })
            }).catch(() => {
            })
        },
        changeSudo(row){
            const httpFun = row.runStatus == 'SUSPEND' ? 'startStandardCompareTask' : 'stopStandardCompareTask'
            this.$http[httpFun]({ taskId: row.id }).then(res => {
                if (res.data.state === 'success') {
                    this.$popSuccess(res.data.message)
                } else {
                    this.$popError(res.data.message)
                }
                this.getList()
            })
        },
        perform(row) {
            this.$confirm('是否确认立即执行该任务？', `立即执行 - ${row.taskName}`, {
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                this.$http.immediatelyStandardCompareTask( row.id ).then(res => {
                    if (res.data.state === 'success') {
                        this.$popSuccess(res.data.message)
                        this.getList()
                    } else {
                        this.$popError(res.data.message)
                    }
                })
            }).catch(() => {
            })
        },
        history(item) {
            this.showHistory = true
            this.showHistoryRowData = item
            this.taskList = []
        },
        changeSizeHandler(ps) {
            this.query.pageSize = ps
            this.search()
        }
    }
}
</script>
<style lang="scss" scoped>
.line {
  height: 1px;
  background-color: #e3e6eb;
}
</style>
