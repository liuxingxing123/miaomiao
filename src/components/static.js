const resourceTypeOptions=[
    { value: '0', label: '虚拟机' },
    { value: '1', label: '网络开通' },
    { value: '2', label: '数据库' },
    { value: '3', label: '中间件' }
]

const operatingSystems = [
    {
        value:'251',
        label:'Linux'
    },{
        value:'252',
        label:'windows'
    }
]
const databaseType = [
    { value: '2', label: 'MySQL' },
    { value: '3', label: 'Redis' },
    { value: '1', label: 'SQL Server' },
    { value: '4', label: 'MongoDB' },
]
const versionOptions = [
    { value: 1, label: '5.0' },
    { value: 3, label: '6.0' },
]
const typeOptions =[
    ...resourceTypeOptions,
    ...operatingSystems
]
const middlewareType = [
    { value: '2', label: 'redis' },
    { value: '1', label: 'kafka' },
]
const resourceList= [
    { cpu: 1, memory: 2, systemDisk: 50, dataDisks: [] },
    { cpu: 2, memory: 4, systemDisk: 50, dataDisks: [] },
    { cpu: 4, memory: 8, systemDisk: 50, dataDisks: [] },
    { cpu: 8, memory: 16, systemDisk: 50, dataDisks: [] },
    { cpu: 8, memory: 32, systemDisk: 50, dataDisks: [] }
]
const resourceSpecification = [
    { value: 0, label: '1C 2G 50G' },
    { value: 1, label: '2C 4G 50G' },
    { value: 2, label: '4C 8G 50G' },
    { value: 3, label: '8C 16G 50G' },
    { value: 4, label: '8C 32G 50G' },
]
const tagType =[
    {
        value:1,
        label:'应用机器组'
    },{
        value:2,
        label:'服务机器标签'
    }
]
const orderStatusOptions = [
    {label:'待审批',value:'AWAITAPPROVE',type:'blue'},
    {label:'任务执行完毕',value:'FINISH',type:'green',},
    {label:'任务执行中',value:'EXECUTE',type:'green',},
    {label:'被驳回',value:'REJECT',type:'yellow'},
    {label:'任务待执行',value:'AWAITEXECUTE',type:'blue'},
    {label:'待提交工单',value:'AWAITSUBMIT',type:'blue'},
    {label:'已关闭',value:'CLOSED',type:'grey'},
]


const searchTypeOptions = [
    {label:'创建人',value:0},
    {label:'工单类型',value:1},
    {label:'工单编号',value:2},
]

const orderTypeOptions = [
    {label:'部署web服务',value:0},
    {label:'发布静态资源',value:1},
    {label:'修改配置信息',value:2},
]

const applicationServiceOptions = [
    {label:'web服务',value:'WEB'},
]

const deploymentMethodOptions = [
    {label:'独占部署',value:'exclusive'},
    {label:'共享部署',value:'shared'},
]

const publishTypeOptions = [
    {label:'http',value:'http'},
    {label:'tcp',value:'tcp'},
]

const proxyTypeOptions = [
    {label:'反向代理',value:1},
    {label:'正向代理',value:0},
]

const serviceTypeOptions = [
    {label:'nginx',value:'nginx'},
    {label:'apache',value:'apache'},
]

const labelGroupOptions = [
    {label:'互联网',value:'internet'},
    {label:'OA',value:'oa'},
    {label:'跨域互访',value:'visits'},
]

const serviceConfigTemplateOptions = [
    {label:'高性能',value:'high'},
    {label:'普通性能',value:'normal'},
]

const actionOptions = [
    {label:'添加',value:0},
    {label:'减去',value:1},
]
const taskSearchOptions =[
    {label:'创建人',value:'createPeople'},
    {label:'工单类型',value:'orderType'},
    {label:'工单标题',value:'orderTitle'},
    {label:'工单编号',value:'orderNum'},
]
const insideTypeOptions = [
    {
        value:1,
        label:'串行'
    },
    {
        value:2,
        label:'10%'
    },
    {
        value:3,
        label:'30%'
    },
    {
        value:4,
        label:'50%'
    },
    {
        value:5,
        label:'100%'
    }
]
const sectionType = [
    { value:2, label:'并行' },
    { value:1, label:'串行' }
    
]
export {
    resourceTypeOptions,
    typeOptions,
    operatingSystems,
    databaseType,//数据库下拉
    versionOptions,//规格
    middlewareType,//中间件类型
    resourceList,//规格类型
    resourceSpecification,//规格
    tagType,//标签来源
    orderStatusOptions,//工单状态
    applicationServiceOptions,//服务类型
    searchTypeOptions,//搜索类型
    orderTypeOptions,//工单类型
    deploymentMethodOptions,//部署方式
    publishTypeOptions,//发布方式
    proxyTypeOptions,//代理方式
    serviceTypeOptions,//服务类型
    labelGroupOptions,//标签组类型
    serviceConfigTemplateOptions,//服务配置模板类型
    actionOptions,//动作类型
    taskSearchOptions,//任务管理搜索
    insideTypeOptions,//区间内并发度
    sectionType, // 区间外并发度
}
