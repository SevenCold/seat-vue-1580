<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="产线名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      @cell-click="cellClick()"
      border highlight-current-row
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle" :height="tableHeight"
      style="width: 100%;">
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="50">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="产线名称">
      </el-table-column>
      <el-table-column
        prop="no"
        header-align="center"
        align="center"
        label="产线编号">
      </el-table-column>
      <el-table-column
        prop="value1"
        header-align="center"
        align="center"
        label="单车正常作业">
      </el-table-column>
      <el-table-column
        prop="value2"
        header-align="center"
        align="center"
        label="单车就近作业">
      </el-table-column>
      <el-table-column
        prop="value3"
        header-align="center"
        align="center"
        label="双车正常作业">
      </el-table-column>
      <el-table-column
        prop="value4"
        header-align="center"
        align="center"
        label="双车就近作业">
      </el-table-column>
      <el-table-column
        prop="value5"
        header-align="center"
        align="center"
        label="value5">
      </el-table-column>
      <el-table-column
        prop="value6"
        header-align="center"
        align="center"
        label="value6">
      </el-table-column>
      <el-table-column
        prop="comment"
        header-align="center"
        align="center"
        label="备注信息">
      </el-table-column>
      <el-table-column
          prop="enable"
          header-align="center"
          align="center"
          label="是否启用">
        <template #default="scope">
          <el-switch v-model="scope.row.enable" :before-change="switchBefore"
                     @change="switchEnable(scope.row.id, scope.row.enable)"
                     :active-value="1" :inactive-value="0"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageSize" background
        layout="total, sizes, prev, pager, next"
        :total="totalPage">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './cooperation-update'
  import axios from "axios";
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        clickSwitch: false
      }
    },
    props: ['tableHeight'],
    components: {
      AddOrUpdate
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        axios.get("/rule/coop/list", {
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          }
        }).then(data => {
          if (data && data.status === 200 && data.data) {
            this.dataList = data.data.rows
            this.totalPage = data.data.records
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).catch(()=>{
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
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
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/rule/coop/delete/${id}`).then((data) => {
            if (data && data.status === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      switchBefore() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (this.clickSwitch) {
              this.$confirm(`确定进行启用/禁用操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                return resolve(true)
              }).catch(() => {
                return reject('取消确认')
              })
            }
          }, 100)
        })
      },
      cellClick() {
        this.clickSwitch = true
        setTimeout(() => {
          this.clickSwitch = false
        }, 1000)
      },
      switchEnable(ruleId, enable) {
        if (ruleId && ruleId > 0) {
          axios.get('/rule/coop/switch', {
            params: {
              id: ruleId,
              enable: enable
            }
          }).then((data) => {
            if (data && data.status === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>
