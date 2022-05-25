<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="钢卷卷号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.list" multiple collapse-tags placeholder="请选择">
          <el-option
              v-for="item in plans"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border highlight-current-row
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle" :height="tableHeight"
        style="width: 100%;">
      <el-table-column
          prop="coilId" width="140"
          header-align="center"
          align="center"
          label="钢卷卷号">
      </el-table-column>
      <el-table-column
          prop="taskType" width="130"
          header-align="center"
          align="center"
          :formatter="typeFormatter"
          label="任务类型">
      </el-table-column>
      <el-table-column
          prop="deviceNameOrg" width="130"
          header-align="center"
          align="center"
          label="起始位置">
      </el-table-column>
      <el-table-column
          prop="deviceNameDes" width="130"
          header-align="center"
          align="center"
          label="目标位置">
      </el-table-column>
      <el-table-column
          prop="carNo"
          header-align="center"
          align="center"
          label="车牌号">
      </el-table-column>
      <el-table-column
          prop="parkedId"
          header-align="center"
          align="center"
          label="停车位">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="orderType"-->
<!--          header-align="center"-->
<!--          align="center"-->
<!--          label="指令类型">-->
<!--      </el-table-column>-->
      <el-table-column
          prop="priority"
          header-align="center"
          align="center"
          label="优先级">
      </el-table-column>
      <el-table-column
          prop="isCreated"
          header-align="center"
          align="center"
          label="是否已创建">
      </el-table-column>
      <el-table-column
          prop="isConfirmed"
          header-align="center"
          align="center"
          label="是否已确认">
      </el-table-column>
      <el-table-column
          prop="procCd"
          header-align="center"
          align="center"
          label="钢卷去向">
      </el-table-column>
      <el-table-column
          prop="coilGrade"
          header-align="center"
          align="center"
          label="钢种类型">
      </el-table-column>
      <el-table-column
          prop="externalDiam"
          header-align="center"
          align="center"
          label="外径">
      </el-table-column>
      <el-table-column
          prop="width"
          header-align="center"
          align="center"
          label="宽度">
      </el-table-column>
      <el-table-column
          prop="weight"
          header-align="center"
          align="center"
          label="重量">
      </el-table-column>
      <el-table-column
          prop="thickness"
          header-align="center"
          align="center"
          label="厚度">
      </el-table-column>
      <el-table-column
          prop="contractNo"
          header-align="center"
          align="center"
          label="合同号">
      </el-table-column>
      <el-table-column
          prop="planNo"
          header-align="center"
          align="center"
          label="计划号">
      </el-table-column>
      <el-table-column
          prop="orgX"
          header-align="center"
          align="center"
          label="钢卷X">
      </el-table-column>
      <el-table-column
          prop="orgY"
          header-align="center"
          align="center"
          label="钢卷Y">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="createTime"-->
<!--          header-align="center"-->
<!--          align="center"-->
<!--          label="创建时间">-->
<!--      </el-table-column>-->
      <el-table-column
          prop="orderType"
          header-align="center"
          align="center"
          label="指令类型">
      </el-table-column>
      <el-table-column
          prop="groupNo"
          header-align="center"
          align="center"
          label="分组编号">
      </el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
        <template  #default="scope">
          <el-button size="small" @click="confirmHandle(scope.row.id)">完成</el-button>
          <el-button size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="pageSize" background
      :total="totalPage" layout="total, sizes, prev, pager, next">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../components/plans-add-or-update'
  import axios from "axios"
  import {getObjFromList, plan_types} from '@/common/config'
  export default {
    data () {
      return {
        planTypes: {},
        plans: [],
        dataForm: {
          key: '',
          list: []
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
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
      this.planTypes = getObjFromList(plan_types)
      this.plans = plan_types
    },
    activated () {
      this.getDataList()
    },
    methods: {
      typeFormatter (row) {
          return this.planTypes[row.taskType]
      },
      formatOperator (row) {
        let operator = this.operators[row.operator]
        return operator ? operator + "(" + row.operator + ")" : ''
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        axios.get('/plans/list',{
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'list': this.dataForm.list.toString()
          }
        }).then(data => {
          if (data && data.status === 200 && data.data) {
            this.dataList = data.data.records
            this.totalPage = data.data.total
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
      // 删除
      deleteHandle (id) {
        this.$confirm('确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/plans/delete/${id}`).then(data => {
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
      confirmHandle (id) {
        this.$confirm('确定手动完成操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/plans/confirm/${id}`).then(data => {
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
