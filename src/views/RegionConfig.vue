<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select placeholder="请选择跨" v-model="dataForm.key">
          <el-option
              v-for="(item, key) in crossTypes"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border highlight-current-row
        @row-click="handleRowClick"
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle" :height="tableHeight"
        style="width: 100%;">
      <el-table-column
          prop="regionName"
          header-align="center"
          align="center"
          label="区名">
      </el-table-column>
      <el-table-column
          prop="regionNum"
          header-align="center"
          align="center"
          label="区号">
      </el-table-column>
      <el-table-column
          prop="crossId"
          header-align="center"
          align="center" :formatter="formatCrossValue"
          label="跨号">
      </el-table-column>
      <el-table-column
          prop="seatLevel"
          header-align="center"
          align="center" :formatter="formatValue"
          label="单双层">
      </el-table-column>
      <el-table-column
          prop="seatRow"
          header-align="center"
          align="center"
          label="行">
      </el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
        <template  #default="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../components/region-add-or-update'
  import axios from "axios"
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        levelType: {
          '1': '单层',
          '2': '双层'
        },
        crossIdList: {
          '1': '1跨',
          '2': '2跨',
          '3': '3跨',
          '4': '4跨',
          '5': '5跨',
        },
        crossTypes: [{name: '1跨', value: 1}, {name: '2跨', value: 2}, {name: '3跨', value: 3},
          {name: '4跨', value: 4}, {name: '5跨', value: 5}],
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
      formatCrossValue(row, column, cellValue) {
        return this.crossIdList[cellValue]
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        axios.get('/region/list',{
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/region/delete/${id}`).then(data => {
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
.space-item__item {
  width: 100%;
}

</style>