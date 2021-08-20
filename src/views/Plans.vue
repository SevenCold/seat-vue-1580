<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="鞍座名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.list" multiple collapse-tags placeholder="请选择">
          <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border highlight-current-row
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle" :height="tableHeight"
        style="width: 100%;">
      <el-table-column
          prop="coilId"
          header-align="center"
          align="center"
          label="钢卷卷号">
      </el-table-column>
      <el-table-column
          prop="deviceNameOrg"
          header-align="center"
          align="center"
          label="鞍座名称">
      </el-table-column>
      <el-table-column
          prop="type"
          header-align="center"
          align="center"
          :formatter="typeFormatter"
          label="任务类型">
      </el-table-column>
      <el-table-column
          prop="deviceNameDes"
          header-align="center"
          align="center"
          label="目标垛位">
      </el-table-column>
      <el-table-column
          prop="crossName"
          header-align="center"
          align="center"
          label="跨名称">
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
      <el-table-column
          prop="sequence"
          header-align="center"
          align="center"
          label="序列号">
      </el-table-column>
      <el-table-column
          prop="planId"
          header-align="center"
          align="center"
          label="计划号">
      </el-table-column>
      <el-table-column
          prop="taskType"
          header-align="center"
          align="center"
          label="任务类型">
      </el-table-column>
      <el-table-column
          prop="orderType"
          header-align="center"
          align="center"
          label="指令类型">
      </el-table-column>
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
      <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="创建时间">
      </el-table-column>
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
          <el-button type="text" size="small" @click="confirmHandle(scope.row.id, scope.row.type)">完成</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id, scope.row.type)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../components/area-add-or-update'
  import axios from "axios"
  export default {
    data () {
      return {
        types: [
                {value: 'Schedule_WB_Offline', label: '下线计划'}, {value: 'Schedule_WB_Online', label: '上线计划'},
                {value: 'Schedule_Bogie_Load', label: '上过跨车计划'}, {value: 'Schedule_Bogie_UnLoad', label: '下过跨车计划'},
                {value: 'Schedule_Coil_Move', label: '手动倒垛计划'}, {value: 'Schedule_Coil_Move_Pub', label: '倒卷计划'},
                {value: 'Schedule_Coil_Move2A', label: '可利用才倒垛'}, {value: 'Schedule_Cool2Hot', label: '装车倒垛计划'},
                {value: 'Schedule_Hot2Cool', label: '定向倒垛'}, {value: 'Schedule_Roll_Back_WB', label: '步进梁推卷'},
                {value: 'Schedule_Truck_load', label: '装车计划'}, {value: 'Schedule_Truck_Unload', label: '卸车计划'},
                ],
        typesMap: {},
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
      let map = {}
      this.types.forEach(e => {
        map[e.value] = e.label
      })
      this.typesMap = map
    },
    activated () {
      this.getDataList()
    },
    methods: {
      typeFormatter (row, column, cellValue, index) {
          return this.typesMap[cellValue]
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, type) {
        this.$confirm('确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/plans/delete/${id}/${type}`).then(data => {
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
      confirmHandle (id, type) {
        this.$confirm('确定手动完成操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/plans/confirm/${id}/${type}`).then(data => {
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
