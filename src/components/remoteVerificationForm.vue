<template>
    <el-drawer append-to-body 
        custom-class="alarmdrawerBatchWidth"
        :wrapper-closable="false"
        :with-header="false"
        :visible="newdialog"
        size="60%"
        @open="openHandler"
    >
        <p class="deatailheader">
            <span>批量基线采集</span>
            <el-button
                type="text"
                class="closeBtn"
                @click="goBack()"
            >
                <i
                    class="el-icon-close"
                    style="font-size: 20px;"
                />
            </el-button>
        </p>
        <div style="overflow: auto;height: calc(100vh - 110px);">
          <el-card class="baseline-card">
              <p class="baseline-title">
                  <span class="vertical-line">|</span>
                  <span class="baseline-txt">批量文件采集</span>
                  <i
                      :class="filesShow?'bnarrow-up1':'bnarrow-down1'"
                      class="bn expandIcon drop"
                      @click="filesShow = !filesShow"
                  />
              </p>
              <el-form
                  v-show="!filesShow"
                  ref="filesBlock"
                  :model="batchAcquire"
                  label-width="100px"
                  class="demo-form-inline"
                  v-loading="formLoading"
                  @submit.native.prevent
              >
                  <div
                      v-for="(item,index) in batchAcquire.fileArr"
                      :key="index"
                  >
                      <el-form-item
                          label="检查项"
                      >
                          <el-button
                              type="primary"
                              icon="el-icon-delete"
                              circle
                              @click="delItem(index,'fileArr')"
                          />
                      </el-form-item>
                      <el-form-item
                          label="检查项名称"
                          :prop="'fileArr.'+index + '.checkItemName'"
                          :rules="checkItemRule"
                      >
                          <el-input
                              v-model="item.checkItemName"
                              placeholder="请输入检查项名称"
                              clearable
                          />
                      </el-form-item>
                      <el-form-item
                          v-if="false"
                          label="选择环境"
                          :prop="'fileArr.'+index + '.queryEnv'"
                          :rules="{required: true, message: '请选择环境', trigger: 'change'}"
                      >
                          <el-select
                              v-model="item.queryEnv"
                              placeholder="请选择环境"
                              filterable
                              @change="getInstanceOptions(item)"
                          >
                              <el-option
                                  v-for="row in envList"
                                  :key="row.id"
                                  :label="row.name"
                                  :value="row.id"
                              />
                          </el-select>
                      </el-form-item>
                      <el-form-item label="环境">
                          <el-input v-model="environmentalName" placeholder="环境"  disabled/>
                      </el-form-item>
                      <el-form-item label="应用">
                          <el-input
                              v-model="systemName"
                              placeholder="应用"
                              disabled
                          />
                      </el-form-item>
                      <el-form-item label="服务">
                          <el-input
                              v-model="serviceName"
                              placeholder="服务"
                              disabled
                          />
                      </el-form-item>
                      <div class="filePathClass">
                      <el-form-item
                          label="选择文件采集"
                          style="width:390px;"
                          :prop="'fileArr.'+index + '.filePath'"
                          :rules="{required: true, message: '请输入文件路径', trigger: 'blur'}"
                      >     
                              <el-input
                                  v-model="item.filePath"
                                  placeholder="文件路径"
                              />
                      </el-form-item>
                      <el-form-item
                          label=""
                          label-width="0"
                          style="margin-left:10px;width:calc(100% - 400px)"
                          :prop="'fileArr.'+index + '.fileName'"
                          :rules="{required: true, message: '请输入文件名称', trigger: 'blur'}"
                      >     
                              <el-input
                                  v-model="item.fileName"
                                  placeholder="文件名称"
                              />
                      </el-form-item>
                      </div>
                      <el-form-item
                          label="适用机器组"
                          :prop="'fileArr.'+index + '.labelIds'"
                          :rules="{required: true, message: '请选择部署单元', trigger: ['blur','change']}"
                      >   
                        <el-select
                            v-model="item.labelIds"
                            placeholder="请选择部署单元"
                            multiple
                            :popper-append-to-body="false"
                            popper-class="groupClass"
                        >
                            <el-option
                                v-for="group in item.groupOptions"
                                :key="group.id"
                                :label="group.name"
                                :value="group.id"
                            />
                        </el-select>
                      </el-form-item>
                  </div>
                  <el-form-item class="check-content">
                      <i
                          class="el-icon-plus plus"
                          style="line-height: 20px; cursor: pointer;"
                          @click="addItem('fileArr')"
                      />
                      <span class="check-item">添加检查项</span>
                  </el-form-item>
              </el-form>
          </el-card>
        </div>
        <el-divider class="dividerClass" />
        <div class="footerClass">
            <el-button
                type="primary"
                :loading="loading"
                @click="ok()"
            >
                提 交
            </el-button>
            <el-button
                plain
                @click="goBack"
            >
                取 消
            </el-button>
        </div>
    </el-drawer>
</template>
<script>
export default {
    components: {},
    props: ['newdialog', 'groupOptions'],
    data() {
        const validatorCheckName = (rule, value, callback) => {
            const checkNames = this.batchAcquire.fileArr.filter(item=>item.checkItemName==value)
            if(['',null,undefined].includes(value)){
              callback(new Error('请输入检查项名称'));
            }else if(checkNames.length>1){
              callback(new Error('检查项名称重复,请重新输入'));
            }else{
              this.$http.checkItemNameRepeat(value).then(res=>{
                  const {data:{code,data,state}}  = res 
                  if(code === 200 && state==='success'){
                    if(data){
                      callback(new Error('检查项名称重复,请重新输入'));
                    }else{
                      callback();
                    }
                  }else{
                    callback(new Error('校验检查项名称重复接口失败,请检查网络'));
                  }
              }).catch(error=>{
                this.$popError(error)
                callback(new Error('校验检查项名称重复接口失败,请检查网络'));
              })
            }
        }
        return {
            checkItemRule:[{validator:validatorCheckName,trigger:'change'}],
            envList: [],
            environmentalName:'',
            systemName: '',
            serviceName: '',
            loading: false,
            canSubmit: false,
            varMap: {
                sysctl: 'sysctl变量',
                proc: 'proc变量',
                var: '环境变量'
            },
            batchAcquire:{
              fileArr: [],
            },
            filesShow: false,
            formLoading:false,
            userName: JSON.parse(localStorage.getItem('user')).login,
            userId: JSON.parse(localStorage.getItem('user')).id
        }
    },
    computed:{
      operatingSystemId(){
        return this.$store.state.currentServiceInfo?.operatingSystem??251
      }
    },
    mounted() {
        this.systemName = this.$store.state.currentAppInfo.name
        this.serviceName = this.$store.state.currentServiceInfo.name
    },
    methods: {
        openHandler(){
          this.resetGroupOptions()
          //this.getEnvList()
          this.loading = false
          this.canSubmit = false
          this.batchAcquire = {
            fileArr: [],
          }
          this.filesShow = false
          this.environmentalName = this.$store.state.environmentalName
        },
        resetGroupOptions() {
            this.groupOptions.forEach(item => {
                item.disabled = false
            })
        },
        getInstanceOptions(item) {
            item.instanceOptions = []
            this.$http.getInstances({
                currPageNum: 1,
                model: {moduleId: +this.$route.params.serviceId??this.$store.state.currentServiceInfo.id, envId: 1},
                pageSize:9999,
            }).then(res => {
                this.tableLoading = false
                if (res.data.success) {
                    item.instanceOptions = res.data.rows || []
                } else {
                    this.$popError(res.data.message)
                }
            })
        },
        getEnvList() {
            const parmas = {project_id: this.$store.state.currentTenant.id}
            this.$http.getEnvListNoPage(parmas).then(res => {
                if (res.data.code === 200){
                    this.envList = res.data.data || []
                } else {
                    this.$popError(res.data.message)
                    this.envList = []
                }
            })
        },
        allFormCheck(){
            this.canSubmit = true
            this.eachFormCheck('filesBlock', 'fileArr', 'file', '批量文件采集的文件')
            return this.canSubmit
        },
        eachFormCheck(ref, arr, type, msg){
            this.$refs[ref].validate(valid => {
                const emptyformItems = []
                if (valid) {
                    this.batchAcquire[arr].forEach(item => {
                        if (type === 'file'){
                            if (!item.filePath || !item.fileName || !item.labelIds.length) emptyformItems.push(item)
                        }
                    })
                    if (emptyformItems.length && this.canSubmit) this.$warning(`${msg}信息不完整，请补全再提交`)
                }
                if (!valid || emptyformItems.length > 0) this.canSubmit = false
            })
        },
        ok(){
            if (this.batchAcquire.fileArr.length === 0) return this.$warning('请至少填写一个完整的检查项信息再提交')
            this.$refs.filesBlock.validate(valid => {
              if (valid) {
                this.formLoading = true
                this.loading = true
                const {fileArr} = this.batchAcquire
                fileArr.forEach(item=>{
                  item.labelNames = item?.groupOptions.filter(option=>item.labelIds.includes(option.id)).map(op=>op.name)
                })
                const params = JSON.parse(JSON.stringify(fileArr))
                params.forEach(item=>delete item.groupOptions)
                this.$http.stageAddCheckItemByBacthCollect(params).then(res => {
                    if (res.data.state === 'success') {
                        this.$popSuccess(res.data.message)
                        this.$emit('batchAcquireDone')
                    } else {
                        this.$popError(res.data.message)
                    }
                }).catch(error=>{
                  console.log(error)
                }).finally(_=>{
                  this.formLoading = false
                  this.loading = false
                })
              }
            })
        },
        addItem(arrType) {
          this.$refs.filesBlock.validate(valid => {
            if(valid){
              const obj = {
                serviceId: this.$route.params.serviceId??this.$store.state.currentServiceInfo.id,
                systemId: this.$store.state.currentAppInfo.id,
                envId: localStorage.environmental || this.$store.state.environmental || 1,
                checkItemName: '',
                checkType: 0,
                groupOptions: JSON.parse(JSON.stringify(this.groupOptions)),
                filePath:'',
                fileName:'',
                labelIds:[],
                operatingSystem: this.operatingSystemId == 252 ? 2 : 1,
                systemName :this.systemName,
                serviceName :this.serviceName,
                envName:this.environmentalName
              }
              this.batchAcquire[arrType].push(obj)
            }else{
              return this.$warning(`表单信息不完整，请补全再添加`);
            }
          })
        },
        delItem(index, arrType) {
            this.batchAcquire[arrType].splice(index, 1)
        },
        goBack() {
            this.$emit('cancelBatchAcquire')
        }
    }
}
</script>
<style>
.groupClass{
    left: auto!important;
  }
</style>
<style lang="scss" scoped>
  .demo-form-inline {
    width: 80%;
  }

  .form-content {
    position: relative;
    display: flex;
    padding-bottom: 15px;
  }
  .param {
    position: absolute;
    top: 1px;
    width: 30px;
    height: 30px;
    padding: 0;
    text-align: center;
    border-radius: 8px;
  }
  
  .add-btn {
    right: -50px;
    color: #409eff;
    border: 1px solid #409eff;
  }

  .del-btn {
    right: -100px;
    color: #f56c6c;
    border: 1px solid #f56c6c;
  }

  .el-radio-group {
    width: 1000px;
  }

  .el-radio-group >>> .el-radio-button .el-radio-button__inner {
    width: 100px;
  }
  .alarmdrawerBatchWidth{
    overflow: hidden!important;
    .baseline-card{
      margin-top:20px;
      .baseline-title {
        position: relative;
        .vertical-line{
          margin-right: 5px;
          background-color: #1e54d5;
        }
        .drop {
            position: absolute;
            font-size: 22px!important;
            color: #9facc3;
            top:0;
            right: 0;
            cursor: pointer;
        }
      }
    }
    .deatailheader {
    height: 40px;
    padding: 0 20px;
    font-size: 16px;
    line-height: 40px;
    border-bottom: 1px solid #e1e1e1;

    .closeBtn {
      float: right;
      font-size: 20px !important;
      font-weight: bold;
    }
   }
   .dividerClass{
      margin: 10px 0!important;
    }
    .footerClass{
      margin: 0px auto;
      padding-bottom: 10px;
      width: 100%;
      justify-content: center;
      display: flex;
      text-align: center;
      height: 40px;
      background: #fff;
      position:absolute;
      bottom: 0;
    }
  }
  .filePathClass{
    display: flex;
  }

  .file-btn {
    position: absolute;
    top: 0;
    left: 500px;
    cursor: pointer;

    input[type=file] {
      position: absolute;
      top: 0;
      right: 0;
      width: 116px;
      padding: 0;
      margin: 0;
      overflow: hidden;
      line-height: 24px;
      vertical-align: middle;
      cursor: pointer;
      filter: alpha(opacity=0);
      opacity: 0;
    }
  }
</style>
