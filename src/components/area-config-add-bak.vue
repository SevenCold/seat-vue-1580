<template>
  <el-dialog
    title="添加区域"
    :close-on-click-modal="false"
    v-model="visible">
    <el-form :inline="true" :model="dataForm">
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
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border highlight-current-row
        @selection-change="handleSelectionChange"
        v-loading="dataListLoading" :height="height * 0.6"
        style="width: 100%;">
      <el-table-column type="selection" width="55" />
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
    </el-table>
    <template #footer class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios"
  export default {
    emits: ["refreshDataList"],
    data () {
      return {
        dataForm: {
          key: ''
        },
        areaId: '',
        dataList: [],
        dataListLoading: false,
        visible: false,
        crossTypes: [{name: '1跨', value: 1}, {name: '2跨', value: 2}, {name: '3跨', value: 3}],
        levelType: {
          '1': '单层',
          '2': '双层'
        },
        crossIdList: {
          '1': '1跨',
          '2': '2跨',
          '3': '3跨'
        },
        multipleSelection: [],
      }
    },
    props: {
      height: Number
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
        axios.get(`/region/listByArea/${this.areaId}`,{
          params: {
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
      init (id) {
        this.visible = true
        let _this = this
        this.$nextTick(() => {
          this.areaId = id
          this.dataListLoading = true
          axios.get(`/region/listByArea/${id}`).then((data) => {
            if (data && data.status === 200) {
              _this.dataList = data.data
            } else {
              _this.dataList = []
            }
            _this.dataListLoading = false
          })
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 表单提交
      dataFormSubmit () {
        if (this.multipleSelection.length > 0) {
          let idList = this.multipleSelection.map(e => e.id)
          console.info(idList)
          axios.post(`/area/saveRegion/${this.areaId}`, idList).then(data => {
            if (data && data.status === 200) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>
