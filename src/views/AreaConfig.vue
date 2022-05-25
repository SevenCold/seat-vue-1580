<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="区域名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-space direction="vertical" alignment="start" size="medium" fill style="width: 100%;" prefix-cls="space-item">
      <el-table
          :data="dataList"
          border highlight-current-row
          @row-click="handleRowClick"
          v-loading="dataListLoading" :height="tableHeight * 0.6"
          style="width: 100%;">
        <el-table-column
            prop="areaName"
            header-align="center"
            align="center"
            label="区域名称">
        </el-table-column>
        <el-table-column
            prop="ruleId"
            header-align="center"
            align="center"
            label="规则id">
        </el-table-column>
        <el-table-column
            prop="areaDesc"
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
          <template  #default="scope">
            <el-button type="text" size="small" @click="addRegion(scope.row.id)">添加区域</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
          :data="regionList"
          border highlight-current-row
          v-loading="regionListLoading"  :height="tableHeight * 0.4"
          style="width: 100%;">
        <el-table-column
            prop="areaName"
            header-align="center"
            align="center"
            label="区域名称">
        </el-table-column>
        <el-table-column
            prop="regionName"
            width="150"
            header-align="center"
            align="center"
            label="区名">
        </el-table-column>
        <el-table-column
            prop="seatLevel"
            header-align="center"
            align="center"
            label="单双层">
        </el-table-column>
        <el-table-column
            prop="rank"
            header-align="center"
            align="center"
            label="排序">
        </el-table-column>
        <el-table-column
            prop="seatRow"
            header-align="center"
            align="center"
            label="行">
        </el-table-column>
        <el-table-column
            prop="seatColumn"
            header-align="center"
            align="center"
            label="列">
        </el-table-column>
        <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
          <template  #default="scope">
            <el-button type="text" size="small" @click="updateHandle(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.areaId, scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-space>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../components/area-config-add'
  import axios from "axios"
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        levelType: {
          '1': '一层',
          '2': '二层',
          '3': '一层和二层',
        },
        dataList: [],
        regionList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        regionListLoading: false,
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
    activated () {
      this.getDataList()
    },
    methods: {
      formatValue(row, column, cellValue) {
        return this.levelType[cellValue]
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        axios.get('/area/list',{
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          }
        }).then(data => {
          if (data && data.status === 200 && data.data) {
            this.dataList = data.data
          } else {
            this.dataList = []
          }
          this.regionList = []
          this.dataListLoading = false
        }).catch(()=>{
          this.dataListLoading = false
        })
      },
      handleRowClick (row) {
        this.regionListLoading = true
        axios.get(`/area/region/${row.id}`).then(data => {
          if (data && data.status === 200 && data.data) {
            let list = data.data
            list.forEach(e => e.areaName = row.areaName)
            this.regionList = list
          } else {
            this.regionList = []
          }
          this.regionListLoading = false
        }).catch(()=>{
          this.regionListLoading = false
        })
      },
      // 新增 / 修改
      addRegion (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      updateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.update(id)
        })
      },
      // 删除
      deleteHandle (areaId, regionId) {
        this.$confirm('确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/region/delete/${areaId}/${regionId}`).then(data => {
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
<style>
</style>