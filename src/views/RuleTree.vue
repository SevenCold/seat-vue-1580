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
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="160"
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
          width="180"
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
        align="center"
        label="具体值">
      </el-table-column>
      <el-table-column
          prop="ruleType"
          :formatter="formatType"
          width="150"
          header-align="center"
          align="center"
          label="规则类型">
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="scope.row.children.length === 0" type="text" size="small" @click="deleteHandle(scope.row, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../components/rules-add-or-update'
  import axios from "axios"
  import {operators, types, props} from '@/common/config'
  export default {
    data () {
      return {
        types: {},
        props: {},
        operators: {},
        dataForm: {
          key: ''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
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
      AddOrUpdate
    },
    mounted() {
      this.types = this.getObjFromList(types)
      this.props = this.getObjFromList(props)
      this.operators = this.getObjFromList(operators)
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
            this.dataList = data.data.children
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
      addChildRule (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initChild(id)
        })
      },
      formatType(row) {
        return this.types[row.ruleType] || this.types['0']
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
        console.info(row)
        this.$confirm('该操作会删除对应的区域，确定删除操作?', '提示', {
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
