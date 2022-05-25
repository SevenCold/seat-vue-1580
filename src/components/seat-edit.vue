<template>
  <el-dialog width="80%"
    v-model="visible">
    <el-dialog title="选择区域" v-model="selectVisible">
      <el-table ref="selectTable" @row-click="selectRowClicked" :data="areaList" :select-on-indeterminate="false"
                border highlight-current-row height="300">
        <el-table-column label="选择" width="50">
          <template #default="scope">
            <el-checkbox v-model="scope.row.selected" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column property="areaName" label="区域名称" header-align="center" align="center"></el-table-column>
        <el-table-column property="areaDesc" label="区域描述" header-align="center" align="center"></el-table-column>
      </el-table>
      <template #footer class="dialog-footer">
        <el-button @click="selectVisible = false">取消</el-button>
        <el-button type="primary" @click="selectAreaHandle()">确定</el-button>
      </template>
    </el-dialog>
    <template #title>
      <el-row :gutter="24">
        <el-col :span="10">鞍座管理</el-col>
        <el-col :span="12">
          <el-button type="primary" @click="showSelectDialog" :disabled="dataListSelections.length <= 0">批量加入区域</el-button>
          <el-button type="primary" @click="deleteHandle(dataListSelections.map(e => e.areaSeatId))" :disabled="dataListSelections.length <= 0">批量退出区域</el-button>
        </el-col>
      </el-row>
    </template>
    <el-table
        :data="dataList"
        @selection-change="selectionChangeHandle"
        border highlight-current-row
        v-loading="dataListLoading"
        :span-method="spanColHandler"
        height="300"
        style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
          prop="deviceName"
          header-align="center"
          align="center"
          label="鞍座名称">
      </el-table-column>
      <el-table-column
          prop="deviceX"
          header-align="center"
          align="center"
          label="X坐标">
      </el-table-column>
      <el-table-column
          prop="deviceY"
          header-align="center"
          align="center"
          label="Y坐标">
      </el-table-column>
      <el-table-column
          prop="areaName"
          header-align="center"
          align="center"
          width="200"
          label="区域名称">
      </el-table-column>
      <el-table-column
          prop="areaDesc"
          width="250"
          header-align="center"
          align="center"
          label="区域描述">
      </el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
        <template #default="scope">
          <el-button type="text" size="small" :disabled="!scope.row.areaSeatId" @click="deleteHandle([scope.row.areaSeatId])">退出区域</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import axios from "axios"
  export default {
    emits: ["refreshDataList"],
    data () {
      return {
        visible: false,
        selectVisible: false,
        dataIdList: [],
        areaList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        enable: '',
      }
    },
    methods: {
      init (idList) {
        this.visible = true
        this.$nextTick(() => {
          axios.post(`/seat/getByIdList`, idList).then((data) => {
            if (data && data.status === 200) {
              this.dataList = data.data
              this.dataIdList = data.data.map(e => e.id)
            }
          })
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      spanColHandler ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex > 0 && columnIndex < 5) {
          return [row.rowspan, row.colspan]
        }
      },
      showSelectDialog () {
        this.selectVisible = true
        axios.get('/area/all').then(data => {
          if (data && data.status === 200) {
            data.data.map(e=> e.selected = false)
            this.areaList = data.data
          }
        })
      },
      selectRowClicked (row) {
        let source = this.areaList
        source.map(e => {
          e.selected = row.id === e.id;
        })
        this.areaList = source
      },
      selectAreaHandle () {
        let selectedArea = this.areaList.find(e => e.selected)
        if (selectedArea) {
          this.$confirm(`确定加入区域 [ ${selectedArea.areaName} ] ?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.post('/seat/addToArea', {
              names: this.dataListSelections.map(e => e.deviceName).toString(),
              areaId: selectedArea.id
            }).then(data => {
              if (data && data.status === 200) {
                this.init(this.dataIdList)
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message.error(data.msg)
              }
              this.selectVisible = false
            }).catch(() => {
              this.selectVisible = false
            })
          })
        } else {
          this.$message({
            message: '请先选择区域',
            type: 'error',
            duration: 1500
          })
        }
      },
      deleteHandle (ids) {
        this.$confirm('确定退出区域操作 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/seat/removeFromArea`, ids).then(data => {
            if (data && data.status === 200) {
              this.init(this.dataIdList)
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
<style>
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}
</style>
