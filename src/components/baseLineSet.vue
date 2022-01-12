<template>
<div >
    <div  v-if="!fileListDetailFlag" class="baselineSetClass">
        <el-form
            :inline="true"
            @submit.native.prevent
        >
            <!--<el-form-item>
                <el-button
                    v-if="true || $checkAuth('menu.check.addFc')"
                    type="primary"
                    icon="el-icon-plus"
                    @click="createFile()"
                >
                    新增文件检查
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button
                    v-if="true || $checkAuth('menu.check.addVc')"
                    type="primary"
                    icon="el-icon-plus"
                    @click="createVar()"
                >
                    新增变量检查
                </el-button>
            </el-form-item>-->
        </el-form>
        <el-collapse
            v-for="item in batchAcquireCard"
            :key="item.cardId"
            v-model="activeBatchAcquire"
            class="collapse"
        >
            <el-collapse-item :name="item.id">
                <template slot="title">
                    批量基线管理
                </template>
                <el-table
                    v-loading="batchAcquireTableLoading"
                    :data="batchAcquireList"
                    max-height="335"
                    :span-method="objectSpanMethod"
                >
                    <el-table-column
                        label="检查项"
                        prop="name"
                        show-overflow-tooltip
                    />
                    <el-table-column
                        label="文件名称"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.content.fileName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="文件路径"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.content.filePath }}
                        </template>
                    </el-table-column>
                    <el-table-column label="适用部署单元" >
                        <template slot-scope="scope">
                          <el-tooltip placement="top">
                            <div slot="content"><div v-for="(op,idx) in scope.row.content.groups" :key="idx">{{op}}</div></div>
                            <span><div v-for="(op,idx) in scope.row.content.groups" :key="idx">{{op}}</div></span>
                          </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="文件查看">
                        <template slot-scope="scope">
                            <el-tooltip
                                v-if="true || $checkAuth('menu.check.viewF')"
                                class="item"
                                effect="dark"
                                content="文件查看"
                                placement="top"
                            >
                                <el-button
                                    :disabled="scope.row.content.status==2"
                                    type="text"
                                    @click="fileListDetailView(scope.row)"
                                >
                                    <i
                                        class="bn bnwenjianshangchuan"
                                        style="font-size: 20px;"
                                    />
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="基线数据状态">
                        <template slot-scope="scope">
                            {{ scope.row.content.status | baselineDataStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="修改时间"
                        width="140"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.createTime | date }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150px"
                    >
                        <template slot-scope="scope">
                            <ButtonIfAndDisabled
                                :ope-buttons="batchAcquireButtons"
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
                    :current-page.sync="queryBatchAcquire.currPageNum"
                    :page-size="queryBatchAcquire.pageSize"
                    background
                    class="pageCls"
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="batchAcquireTotal"
                    size="small"
                    @current-change="getBatchAcquireList"
                    @size-change="changeBatchAcquireSizeHandler"
                />
            </el-collapse-item>
        </el-collapse>
        <template v-if="false">
        <el-collapse
            v-for="item in fileCard"
            :key="item.cardId"
            v-model="activeFile"
            class="collapse"
           style="margin-top: 25px;"
        >
            <el-collapse-item :name="item.id">
                <template slot="title">
                    标准文件管理
                </template>
                <el-table
                    v-loading="fileTableLoading"
                    :data="fileList"
                    :span-method="objectSpanMethod"
                >
                    <el-table-column
                        label="检查项"
                        prop="name"
                        show-overflow-tooltip
                    />
                    <el-table-column
                        label="文件名称"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.content.fileName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="文件路径"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.content.filePath }}
                        </template>
                    </el-table-column>
                    <el-table-column label="适用标签" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.content.groups.join(',') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="基线数据来源">
                        <template slot-scope="scope">
                            {{ scope.row.source | baselineDataSource }}
                        </template>
                    </el-table-column>
                    <el-table-column label="文件查看">
                        <template slot-scope="scope">
                            <el-tooltip
                                v-if="true || $checkAuth('menu.check.viewF')"
                                class="item"
                                effect="dark"
                                content="文件查看"
                                placement="top"
                            >
                                <el-button
                                    :disabled="scope.row.content.status==2"
                                    type="text"
                                    @click="fileView(scope.row)"
                                >
                                    <i
                                        class="bn bnwenjianshangchuan"
                                        style="font-size: 20px;"
                                    />
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="基线数据状态">
                        <template slot-scope="scope">
                            {{ scope.row.content.status | baselineDataStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="修改时间"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.content.modifyTime | date }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150px"
                    >
                        <template slot-scope="scope">
                            <ButtonIfAndDisabled
                                :ope-buttons="fileOpeButtons"
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
                    :current-page.sync="queryFile.currPageNum"
                    :page-size="queryFile.pageSize"
                    background
                    class="pageCls"
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="flieTotal"
                    size="small"
                    @current-change="getFileList"
                    @size-change="changeFlieSizeHandler"
                />
            </el-collapse-item>
        </el-collapse>
        </template>
        <template v-if="false">
        <el-collapse
            v-for="item in varCard"
            :key="item.cardId"
            v-model="activeVar"
            style="margin-top: 25px;"
            class="collapse"
        >
            <el-collapse-item :name="item.id">
                <template slot="title">
                    变量管理
                </template>
                <el-table
                    v-loading="varTableLoading"
                    :data="varList"
                    :span-method="objectSpanMethod"
                >
                    <el-table-column
                        label="检查项"
                        prop="name"
                        show-overflow-tooltip
                    />
                    <el-table-column label="变量类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.content.variableType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="变量名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.content.variableKey }}
                        </template>
                    </el-table-column>
                    <el-table-column label="变量取值" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.content.variableValue }}
                        </template>
                    </el-table-column>
                    <el-table-column label="适用标签" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.content.groups.join(',') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="基线数据来源">
                        <template slot-scope="scope">
                            {{ scope.row.source | baselineDataSource }}
                        </template>
                    </el-table-column>
                    <el-table-column label="脚本查看">
                        <template slot-scope="scope">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="脚本查看"
                                placement="top"
                            >
                                <el-button :disabled="scope.row.content.status==2"
                                    type="text"
                                    @click="fileView(scope.row)"
                                >
                                    <i
                                        class="bn bnwenjianshangchuan"
                                        style="font-size: 20px;"
                                    />
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="基线数据状态">
                        <template slot-scope="scope">
                            {{ scope.row.content.status | baselineDataStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="修改时间"
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{ scope.row.content.modifyTime|date }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150px"
                    >
                        <template slot-scope="scope">
                            <ButtonIfAndDisabled
                                :ope-buttons="varOpeButtons"
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
                    :current-page.sync="queryVar.currPageNum"
                    :page-size="queryVar.pageSize"
                    background
                    class="pageCls"
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="varTotal"
                    size="small"
                    @current-change="getVarList"
                    @size-change="changeVarSizeHandler"
                />
            </el-collapse-item>
        </el-collapse>
        </template>
        <view-file
            :view-file-dialog="viewFileDialog"
            :flie-data="flieData"
            :check-type="checkType"
            @cancelFileView="cancelFileView"
        />
        <add-var
            :add-var-dialog="addVarDialog"
            :var-data="varData"
            :group-options="groupOptions"
            @addVarDone="addVarDone"
            @cancelAddVar="cancelAddVar"
        />
        <addBatchLine
            :addBatchLineDialog="addBatchLineDialog"
            :rowData="addBatchLineRowData"
            :group-options="groupOptions"
            @success="successHandler"
            @cancel="successHandler"
        />
        <add-file-check
            :add-file-check-dialog="addFileCheckDialog"
            :file-check-data="fileCheckData"
            :group-options="groupOptions"
            @addFileCheckDone="addFileCheckDone"
            @cancelAddFileCheck="cancelAddFileCheck"
        />
    </div>
    <fileListDetail
            v-if="fileListDetailFlag"
            :fileListDetailRowData="fileListDetailRowData"
            @back="fileListDetailBackHandler"
        />
</div>
</template>

<script>
import ButtonIfAndDisabled from '@/components/ButtonIfAndDisabled.vue'
import viewFile from './viewFile.vue'
import addVar from './addVar.vue'
import addBatchLine from './addBatchLine.vue'
import addFileCheck from './addFileCheck.vue'
import fileListDetail from './fileListDetail.vue'
import { EventBus } from '../../config/utils/event-bus'

export default {
    components: {
        ButtonIfAndDisabled, viewFile, addVar, addFileCheck,fileListDetail,addBatchLine
    },
    props: ['activeTab', 'groupOptions'],
    data() {
        return {
            checkType: '',
            fileListDetailFlag:false,
            fileListDetailRowData:null,
            addBatchLineDialog:false,
            addBatchLineRowData:null,
            tableOptions:{
              batchAcquireCard:{
                tableData:[],
                tableLabelOptions:[
                ],
                tableLoading:false,
                query:{
                  pageSize:10,
                  currPageNum:1
                },
                total:0,
                title:'',
                flag:'batchAcquire',
                activeCollapse:'batchAcquire',
                buttons:[]
              }
            },
            batchAcquireCard: [{ name: 're', description: 'ewe', id: 'base',cardId:'batchAcquireCard' }],
            activeBatchAcquire: 'base',
            fileCard: [{ name: 're', description: 'ewe', id: 'base',cardId:'fileCard' }],
            activeFile: 'base',
            varCard: [{ name: 're', description: 'ewe', id: 'base',cardId:'varCard' }],
            activeVar: 'base',
            addFileCheckDialog: false,
            fileCheckData: {},
            addVarDialog: false,
            varData: {},
            viewFileDialog: false,
            batchAcquireTableLoading:false,
            batchAcquireList:[],
            batchAcquireTotal:0,
            queryBatchAcquire: {
                currPageNum: 1,
                pageSize: 10,
                serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                sidx: '',
                sord: ''
            },
            batchAcquireButtons:[
              {
                  icon: 'bn bnedit',
                  title: '编辑',
                  action: item => {
                      this.batchAcquireEdit(item)
                  },
                  check: item => true || this.$checkAuth('menu.check.editFc'),
                  disabled: item =>3 !== item.content.status 
                },
                {
                  icon: 'el-icon-refresh',
                  title: '重新采集',
                  action: item => {
                      this.batchAcquireRefresh(item)
                  },
                  check: item => true || this.$checkAuth('menu.check.editFc'),
                  disabled: item => false
                },
                {
                  icon: 'bn bndelete',
                  title: '删除',
                  action: item => {
                      this.batchAcquireDel(item)
                  },
                  check: item => true || this.$checkAuth('menu.check.delFc'),
                  disabled: item => false
                }
            ],
            flieData: {},
            flieTotal:0,
            fileList: [],
            queryFile: {
                currPageNum: 1,
                pageSize: 10,
                serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                sidx: '',
                sord: ''
            },
            fileTableLoading: false,
            fileOpeButtons: [
                {
                    icon: 'bn bnedit',
                    title: '编辑',
                    action: item => {
                        this.createFile(item)
                    },
                    check: item => true || this.$checkAuth('menu.check.editFc'),
                    disabled: item => {
                        if (item.source === 2) {
                            return true
                        }
                        return false
                    }
                },
                {
                    icon: 'bn bndelete',
                    title: '删除',
                    action: item => {
                        this.del(item)
                    },
                    check: item => true || this.$checkAuth('menu.check.delFc'),
                    disabled: item => false
                }
            ],
            varTotal: 0,
            varList: [],
            queryVar: {
                currPageNum: 1,
                pageSize: 10,
                serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                sidx: '',
                sord: ''
            },
            varTableLoading: false,
            varOpeButtons: [
                {
                    icon: 'bn bnedit',
                    title: '编辑',
                    action: item => {
                        this.createVar(item)
                    },
                    check: item => true || this.$checkAuth('menu.check.editVc'),
                    disabled: item => {
                        if (item.source === 2) {
                            return true
                        }
                        return false
                    }
                },
                {
                    icon: 'bn bndelete',
                    title: '删除',
                    action: item => {
                        this.del(item)
                    },
                    check: item => true || this.$checkAuth('menu.check.delVc'),
                    disabled: item => false
                }
            ],
            varTimer:null,
            batchAcquireTimer:null,
            fileTimer:null
        }
    },
    computed: {},
    watch: {
        '$store.state.environmental': {
            handler(){
                // this.getFileList()
                // this.getVarList()
                this.getBatchAcquireList()
            }
        },
        "varList":{
          handler(val){
            this.processData(val,'varTimer','getVarList')
          },
          // immediate:true,
          deep:true
        },
        "fileList":{
          handler(val){
            this.processData(val,'fileTimer','getFileList')
          },
          // immediate:true,
          deep:true
        },
        "batchAcquireList":{
          handler(val){
           this.processData(val,'batchAcquireTimer','getBatchAcquireList')
          },
          immediate:true,
          deep:true
        }
    },
    mounted() {
        // this.getFileList()
        // this.getVarList()
        this.getBatchAcquireList()
        EventBus.$on('clearTimer',()=>{
          // clearInterval(this.varTimer)
          // clearInterval(this.fileTimer)
          clearInterval(this.batchAcquireTimer)
        })
        EventBus.$on('updateBaseLineList', () => {
            // this.getFileList()
            // this.getVarList()
            this.getBatchAcquireList()
        })
    },
    destroyed() {
        EventBus.$off('updateBaseLineList')
        clearInterval(this.varTimer)
        clearInterval(this.fileTimer)
        clearInterval(this.batchAcquireTimer)
    },
    methods: {
        successHandler(){
          this.addBatchLineDialog = false
          this.getBatchAcquireList()
        },
        batchAcquireEdit(item){
          this.addBatchLineDialog = true
          this.addBatchLineRowData = item
          clearInterval(this.batchAcquireTimer)
          this.batchAcquireTimer = null
        },
        batchAcquireRefresh(item){
          const {id} = item
          this.$confirm('是否确认重新采集该基线？', '提示', {
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                const params = {
                      checkItemId: id,
                      operatingSystem: this.$store.state.currentServiceInfo.operatingSystem == 252 ? 2 : 1
                }
                this.$http.baselineRefresh(params).then(res => {
                    if (res.data.state === 'success') {
                        this.$popSuccess(res.data.message)
                        this.getBatchAcquireList()
                    } else if (res.data.state === 'warning') {
                        this.$warning(res.data.message)
                    } else {
                        this.$popError(res.data.message)
                    }
                })
            }).catch(() => {
            })
        },
        batchAcquireDel(item){
            const title = '删除'
            this.$confirm('是否确认删除该基线？', title, {
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                this.$http.deleteStandard({ id: item.id,
                    serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                    systemId: this.$store.state.currentAppInfo.id,
                    name: item.name
                }).then(res => {
                    if (res.data.state === 'success') {
                        this.$popSuccess(res.data.message)
                        this.getBatchAcquireList()
                    } else if (res.data.state === 'warning') {
                        this.$warning(res.data.message)
                    } else {
                        this.$popError(res.data.message)
                    }
                })
            }).catch(() => {
            })
        },
        getBatchAcquireList(){
          clearInterval(this.batchAcquireTimer)
          this.batchAcquireTimer = null
          this.batchAcquireTableLoading = true
          this.queryBatchAcquire.envId = localStorage.environmental || this.$store.state.environmental || 1
          this.queryBatchAcquire.compareEnvId = this.activeTab
          this.$http.getStandardFileList(this.queryBatchAcquire).then(res => {
              if (res.data.success) {
                  const { totalCount, rows } = res.data
                  this.batchAcquireList = this.handleTableData(rows || [])
                  this.batchAcquireTotal = totalCount || 0
              } else {
                  this.$popError(res.data.message)
                  this.batchAcquireList = []
                  this.batchAcquireTotal = 0
              }
          }).catch(err=>{console.log(err)}).finally(_=>{
            this.batchAcquireTableLoading = false
          })
        },
        changeBatchAcquireSizeHandler(ps) {
            this.queryBatchAcquire.pageSize = ps
            this.getBatchAcquireList()
        },
        processData(val,timer,method){
          const statusArr = val.map(item=>item.content.status)
          const hasInit = statusArr.some(item=>item===2)
          if(hasInit){
            this[timer] = setTimeout(()=>{
              this[method]()
            },10000)
          }else{
            clearTimeout(this[timer])
          }
        },
        fileListDetailView(item){
            this.fileListDetailFlag = true
            this.fileListDetailRowData = item
            clearInterval(this.batchAcquireTimer)
            this.batchAcquireTimer = null
        },
        fileListDetailBackHandler(){
          this.fileListDetailFlag = false
          this.getBatchAcquireList()
        },
        fileView(item){
            this.viewFileDialog = true
            this.checkType = item.checkType
            this.flieData = item.content
        },
        cancelFileView(){
            this.viewFileDialog = false
        },
        del(item) {
            const title = '删除'
            this.$confirm('是否确认删除该基线？', title, {
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                this.$http.deleteStandard({ id: item.id,
                    serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                    systemId: this.$store.state.currentAppInfo.id,
                    checkType: item.checkType,
                    name: item.name
                }).then(res => {
                    if (res.data.state === 'success') {
                        this.$popSuccess(res.data.message)
                        item.checkType == 0 ? this.getFileList() : this.getVarList()
                    } else if (res.data.state === 'warning') {
                        this.$warning(res.data.message)
                    } else {
                        this.$popError(res.data.message)
                    }
                })
            }).catch(() => {
            })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            let lastColumn = 0
            if (row.checkType == 0){
                lastColumn = 8
            } else {
                lastColumn = 9
            }
            if (columnIndex === 0 || columnIndex === lastColumn) {
                if (row.content.index === 0) {
                    return {
                        rowspan: row.standardObjects.length,
                        colspan: 1
                    }
                }
                return {
                    rowspan: 0,
                    colspan: 0
                }
            }
        },
        handleTableData(data) {
            const arr = []
            data.forEach(item => {
                if (item.standardObjects) {
                    item.standardObjects.forEach((row, index) => {
                        row.groups = []
                        row.groupIds = []
                        row.index = index
                        if (row.compareObjectLabelRefs) {
                            row.compareObjectLabelRefs.forEach(group => {
                                row.groups.push(group.name)
                                row.groupIds.push(group.labelId)
                            })
                        }
                        item.content = JSON.parse(JSON.stringify(row))
                        arr.push(JSON.parse(JSON.stringify(item)))
                    })
                }
            })
            return arr
        },
        getFileList() {
            this.fileTableLoading = true
            this.queryFile.envId = localStorage.environmental || this.$store.state.environmental || 1
            this.queryFile.compareEnvId = this.activeTab
            this.$http.getStandardFileList(this.queryFile).then(res => {
                this.fileTableLoading = false
                if (res.data.success) {
                    const { totalCount, rows } = res.data
                    this.fileList = this.handleTableData(rows || [])
                    this.flieTotal = totalCount || 0
                } else {
                    this.$popError(res.data.message)
                    this.fileList = []
                    this.flieTotal = 0
                }
            })
        },
        changeFlieSizeHandler(ps) {
            this.queryFile.pageSize = ps
            this.getFileList()
        },
        createFile(row) {
            this.addFileCheckDialog = true
            if (row) {
                this.fileCheckData = JSON.parse(JSON.stringify(row))
            } else {
                this.fileCheckData = null
            }
        },
        getVarList() {
            this.varTableLoading = true
            this.queryVar.envId = localStorage.environmental || this.$store.state.environmental || 1
            this.queryVar.compareEnvId = this.activeTab
            this.$http.getStandardVariableList(this.queryVar).then(res => {
                this.varTableLoading = false
                if (res.data.success) {
                    const { totalCount, rows } = res.data
                    this.varList = this.handleTableData(rows || [])
                    this.varTotal = totalCount || 0
                } else {
                    this.$popError(res.data.message)
                    this.varList = []
                    this.varTotal = 0
                }
            })
        },
        changeVarSizeHandler(ps) {
            this.queryVar.pageSize = ps
            this.getVarList()
        },
        createVar(row) {
            this.addVarDialog = true
            if (row) {
                this.varData = JSON.parse(JSON.stringify(row))
            } else {
                this.varData = null
            }
        },
        addVarDone(){
            this.addVarDialog = false
            this.getVarList()
        },
        cancelAddVar(){
            this.addVarDialog = false
        },
        addFileCheckDone(){
            this.addFileCheckDialog = false
            this.getFileList()
        },
        cancelAddFileCheck(){
            this.addFileCheckDialog = false
        }
    }
}
</script>
<style lang="scss" scoped>
.baselineSetClass{
  /deep/.el-collapse{
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin:0;
  }
  /deep/.el-collapse-item__header{
    position: relative;
    height: 40px!important;
    line-height: 40px!important;
    font-weight: 600;
    border-radius: 5px;
    padding-left: 50px;
    background: #fff!important;
    margin-bottom: 0;
  }
  /deep/.el-collapse-item__content{
    padding: 0 20px 15px;
  }
  /deep/.el-collapse-item__arrow{
    margin: 0;
    position: absolute;
    left: 20px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: #a0acc4;
    color: #ffffff;
    font-weight: 500;
    &.is-active{
      transform: rotate(90deg);
    }
  }
}
.line {
  height: 1px;
  background-color: #e3e6eb;
}
</style>
