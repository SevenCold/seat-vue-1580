module.exports = {
    getObjFromList: function (list) {
        let obj = {}
        list.forEach(e => {
            obj[e.value] = e.name
        })
        return obj
    },
    rule_operators: [{name: '包含在其中', value: 'in'},{name: '不在其中', value: 'not in'}, {name: '大于', value: '>'}, {name: '大于等于', value: '>='}, {name: '小于', value: '<'}, {name: '小于等于', value: '<='},
        {name: '等于', value: '='}, {name: '不等于', value: '!='}, {name: '以..开头', value: 'startWith'},
        {name: '不超过..小时', value: 'inTime'}, {name: '超过..小时', value: 'outTime'}],
    rule_props: [{name: '跨', value: 'cross_id'}, {name: '取样类型', value: 'sample_type'}, {name: '材料形状', value: 'material_type'}, {name: '钢种', value: 'coil_grade'}, {name: '包装方式', value: 'packing'}, {name: '生产时间', value: 'product_time'},
        {name: '宽度', value: 'width'}, {name: '重量', value: 'weight'}, {name: '直径', value: 'ex_diameter'}, {name: '合同号', value: 'contract_no'},
        {name: '内径', value: 'inner_diam'}, {name: '温度', value: 'temperature'}, {name: '厚度', value: 'thickness'}, {name: '板坯长度', value: 'slabLength'},
        {name: '钢卷类型', value: 'coil_type'}, {name: '运输类型', value: 'transportation_type'}, {name: '钢卷去向', value: 'proc_cd'}],
    rule_types: [{name: '普通规则', value: '0', tip: '具体指需指定'}, {name: '并且(&&)', value: '2'}, {name: '或者(||)', value: '3'}],
    rule_values: [{name: '从缓冷坑表中查询', value: '$'}, {name: '钢卷宽度乘以1.5', value: '#'}, {name: '无单+板坯长度<5.2米+可利用材', value: '$'},],
    cond_names: [{name: '当前鞍座', value: 'seat'}, {name: '左鞍座', value: 'left'}, {name: '右鞍座', value: 'right'}],
    cond_front: [{name: '绝对值', value: 'abs'}, {name: '字符串长度', value: 'strlen'}, {name: '除以2', value: '/2'}],
    device_types: [{name: '跨', value: '1'}, {name: '天车', value: '2'}, {name: '停车位', value: '3'},
                    {name: '上线点', value: '4'}, {name: '下线点', value: '5'}, {name: '转盘', value: '6'},
                    {name: '火车停车位', value: '7'}, {name: '平整机下线点', value: '8'}],
    plan_types: [{name: '上线计划', value: '11'}, {name: '下线计划', value: '12'},
        {name: '装车计划', value: '31'},{name: '卸车计划', value: '32'},
        {name: '装火车计划', value: '33'},{name: '上过跨车或运输小车计划', value: '21'},
        {name: '下过跨车或运输小车计划', value: '22'},{name: '所有自动生成的计划', value: '40'},
        {name: '上线够不到的卷的跨内倒垛', value: '41'},{name: '二层跨内倒垛', value: '42'},
        {name: '公共区域倒出倒垛', value: '43'},{name: '44', value: '倒垛到可以进缓冷坑的区域'},
        {name: '公共区域倒出倒垛任务', value: '45'},{name: '步进梁退卷', value: '51'},
        {name: '运输小车退卷', value: '61'},{name: '入手包区', value: '71'},
        {name: '出手包区', value: '72'},{name: '入打磨区', value: '81'},
        {name: '出打磨区', value: '82'}],
}