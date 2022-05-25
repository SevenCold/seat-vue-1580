<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="规则名称" disabled clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border highlight-current-row
      v-loading="dataListLoading"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id"
      @selection-change="selectionChangeHandle" :height="tableHeight"
      style="width: 100%;">
<!--      <el-table-column type="expand">-->
<!--        <template #default="props">-->
<!--          <el-table :data="props.row.sideRules || []" style="width: 100%" :show-header="false"-->
<!--                    :tree-props="{children: 'sideRules'}" row-key="id">-->
<!--            <el-table-column prop="ruleType" align="center" width="250" :formatter="formatType" />-->
<!--            <el-table-column prop="prop" align="center" width="220" :formatter="formatProp" />-->
<!--            <el-table-column prop="operator" align="center" width="170" :formatter="formatOperator" />-->
<!--            <el-table-column prop="value" align="center" width="180" :formatter="formatValue" />-->
<!--            <el-table-column prop="value" align="center" width="180">-->
<!--              <template  #default="scope">-->
<!--&lt;!&ndash;                <el-button type="text" size="small" @click="addAndRule(scope.row.id)">添加并列条件</el-button>&ndash;&gt;-->
<!--                <el-button type="text" size="small" @click="addAndUpdateHandle(scope.row.id)">修改</el-button>-->
<!--                <el-button type="text" size="small" @click="deleteAndHandle(scope.row.id, props.row.id)">删除</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        prop="name"
        header-align="center"
        align="left"
        width="180"
        label="规则名称">
      </el-table-column>
      <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="规则ID">
      </el-table-column>
      <el-table-column
          prop="prop"
          header-align="center"
          align="center"
          width="220"
          :formatter="formatProp"
          label="钢卷属性">
      </el-table-column>
      <el-table-column
        prop="operator"
        header-align="center"
        align="center"
        width="170"
        :formatter="formatOperator"
        label="比较符号">
      </el-table-column>
      <el-table-column
        prop="value"
        width="180"
        header-align="center"
        align="center" :formatter="formatValue"
        label="具体值">
      </el-table-column>
      <el-table-column
          prop="rank"
          header-align="center"
          align="center"
          label="是否可回退">
        <template #default="scope">
          <el-switch v-model="scope.row.canBack" disabled
                     :active-value="1" :inactive-value="0"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column
          prop="rank"
          header-align="center"
          align="center"
          label="是否默认">
        <template #default="scope">
          <el-switch v-model="scope.row.isDefault" disabled
                     :active-value="1" :inactive-value="0"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column
          prop="rank"
          header-align="center"
          align="center"
          label="排序序号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        label="操作">
        <template  #default="scope">
          <el-button type="text" size="small" @click="addChildRule(scope.row.id)">添加子规则</el-button>
<!--          <el-button type="text" size="small" @click="addAndRule(scope.row.id)">添加并列规则</el-button>-->
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <add-and-update v-if="addAndUpdateVisible" ref="addAndUpdate" @refreshDataList="getDataList"></add-and-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../components/rules-add-or-update'
  import AddAndUpdate from '../components/rules-and-add'
  import axios from "axios"
  import {rule_operators, rule_types, rule_props, rule_values} from '@/common/config'
  export default {
    data () {
      return {
        types: {},
        props: {},
        operators: {},
        values: {},
        dataForm: {
          key: ''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addAndUpdateVisible: false
      }
    },
    props: {
      contentHeight: Number
    },
    computed: {
      tableHeight () {
        return this.contentHeight - 40 - 35
      }
    },
    components: {
      AddOrUpdate, AddAndUpdate
    },
    mounted() {
      this.types = this.getObjFromList(rule_types)
      this.props = this.getObjFromList(rule_props)
      this.values = this.getObjFromList(rule_values)
      this.operators = this.getObjFromList(rule_operators)
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getObjFromList(list) {
        let obj = {}
        list.forEach(e => {
          obj[e.value] = e.name
        })
        return obj
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        axios.get('/ruleTree/list', {
          params: {
            'key': this.dataForm.key
          }
        }).then(data => {
          if (data && data.status === 200 && data.data) {
            debugger
            this.dataList = data.data.children || []
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        }).catch(()=>{
          this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      addAndUpdateHandle (id) {
        this.addAndUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addAndUpdate.init(id)
        })
      },
      deleteAndHandle (id, parentId) {
        this.$confirm('该操作会删除并列规则，确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/ruleTree/deleteAnd/${id}/${parentId}`).then(data => {
            if (data && data.status === 200) {
              this.getDataList()
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      addAndRule (id) {
        this.addAndUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addAndUpdate.initChild(id)
        })
      },
      addChildRule (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initChild(id)
        })
      },
      formatType(row, column, cellValue) {
        return this.types[cellValue] || this.types['0']
      },
      formatValue(row, column, cellValue) {
        let value = this.values[cellValue]
        return value ? cellValue + " (" + value + ")" : cellValue
      },
      formatOperator (row) {
        let operator = this.operators[row.operator]
        return operator ? operator + "(" + row.operator + ")" : ''
      },
      formatProp (row) {
        let prop = this.props[row.prop]
        return prop ? prop + "(" + row.prop + ")" : ''
      },
      // 删除
      deleteHandle (row, id) {
        this.$confirm('该操作会删除规则，确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/ruleTree/delete/${id}`).then(data => {
            if (data && data.status === 200) {
              this.getDataList()
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
