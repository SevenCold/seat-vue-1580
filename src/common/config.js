module.exports = {
    rule_operators: [{name: '包含在其中', value: 'in'}, {name: '大于', value: '>'}, {name: '大于等于', value: '>='}, {name: '小于', value: '<'}, {name: '小于等于', value: '<='},
        {name: '等于', value: '='}, {name: '不等于', value: '!='}, {name: '以..开头', value: 'startWith'},
        {name: '不超过..小时', value: 'inTime'}, {name: '超过..小时', value: 'outTime'}],
    rule_props: [{name: '跨', value: 'cross_id'}, {name: '取样类型', value: 'sample_type'}, {name: '材料形状', value: 'material_type'}, {name: '钢种', value: 'coil_grade'}, {name: '包装方式', value: 'packing'}, {name: '生产时间', value: 'product_time'},
        {name: '宽度', value: 'width'}, {name: '重量', value: 'weight'}, {name: '直径', value: 'ex_diameter'}, {name: '合同号', value: 'contract_no'},
        {name: '内径', value: 'inner_diam'}, {name: '温度', value: 'temperature'}, {name: '厚度', value: 'thickness'},
        {name: '钢卷类型', value: 'coil_type'}, {name: '运输类型', value: 'transportation_type'}, {name: '钢卷去向', value: 'proc_cd'}],
    rule_types: [{name: '普通规则', value: '0', tip: '具体指需指定'}, {name: '缓冷坑规则', value: '1', tip:'具体值从缓冷坑表中查询'}],
    cond_names: [{name: '当前鞍座', value: 'seat'}, {name: '左鞍座', value: 'left'}, {name: '右鞍座', value: 'right'}],
    cond_front: [{name: '绝对值', value: 'abs'}, {name: '字符串长度', value: 'strlen'}, {name: '除以2', value: '/2'}],
}