<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
<!--      <el-form-item>-->
<!--        <el-input v-model="dataForm.key" placeholder="设备名称" clearable></el-input>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-select v-model="dataForm.type" placeholder="请选择设备类别" clearable>
          <el-option
              v-for="(item, key) in deviceSelect"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
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
      @cell-click="cellClick()"
      border highlight-current-row
      v-loading="dataListLoading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id"
      style="width: 100%;" :height="tableHeight">
      <el-table-column
        prop="name"
        header-align="center"
        align="center" min-width="120"
        label="设备名称">
      </el-table-column>
      <el-table-column
          prop="id"
          header-align="center"
          align="center" min-width="120"
          label="设备ID">
      </el-table-column>
      <el-table-column
          prop="type"
          header-align="center"
          :formatter="formatType"
          align="center" min-width="80"
          label="设备类别">
      </el-table-column>
      <el-table-column
          prop="crossid"
          header-align="center"
          align="center" min-width="80"
          label="所属跨ID">
      </el-table-column>
      <el-table-column
          prop="order"
          header-align="center"
          align="center" min-width="80"
          label="序号">
      </el-table-column>
      <el-table-column
          prop="deviceX"
          header-align="center"
          align="center" min-width="80"
          label="X坐标">
      </el-table-column>
      <el-table-column
          prop="deviceY"
          header-align="center"
          align="center" min-width="80"
          label="Y坐标">
      </el-table-column>
      <el-table-column
        prop="deviceXLLimit"
        header-align="center"
        align="center" min-width="120"
        label="X坐标左极限">
      </el-table-column>
      <el-table-column
        prop="deviceXRLimit"
        header-align="center"
        align="center" min-width="120"
        label="X坐标右极限">
      </el-table-column>
      <el-table-column
          prop="deviceXLPrecedence"
          header-align="center"
          align="center" min-width="130"
          label="X坐标左优先极限">
      </el-table-column>
      <el-table-column
          prop="deviceXRPrecedence"
          header-align="center"
          align="center" min-width="130"
          label="X坐标右优先极限">
      </el-table-column>
      <el-table-column
        prop="deviceYLLimit"
        header-align="center"
        align="center" min-width="120"
        label="Y坐标下限">
      </el-table-column>
      <el-table-column
        prop="deviceYRLimit"
        header-align="center"
        align="center" min-width="120"
        label="Y标上限">
      </el-table-column>
      <el-table-column
        prop="comment"
        header-align="center"
        align="center" min-width="180"
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
        min-width="150"
        label="操作">
        <template #default="scope">
          <el-button type="text" size="medium" v-if="scope.row.type === 1" @click="addChild(scope.row.id)">新增子设备</el-button>
          <el-button type="text" size="medium" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="medium" v-if="scope.row.type !== 1" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './range-update'
  import {device_types, rule_props} from '@/common/config'
  import axios from "axios"
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          type: ''
        },
        deviceTypes: [],
        deviceSelect: [],
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    props: ['tableHeight'],
    components: {
      AddOrUpdate
    },
    mounted() {
      this.deviceTypes = this.getObjFromList(device_types);
      this.deviceSelect = device_types;
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        axios.get("/rule/range/list", {
          params: {
            'key': this.dataForm.key,
            'type': this.dataForm.type
          }
        }).then(data => {
          if (data && data.status === 200 && data.data) {
            this.dataList = data.data.children
            console.log(this.dataList)
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        }).catch(()=>{
          this.dataListLoading = false
        })
      },
      getObjFromList(list) {
        let obj = {}
        list.forEach(e => {
          obj[e.value] = e.name
        })
        return obj
      },
      formatType (row) {
        let type = this.deviceTypes[row.type]
        return type ? type + "(" + row.type + ")" : ''
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      addChild (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.initChild(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('确定删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post(`/rule/range/delete/${id}`).then((data) => {
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
          axios.get('/rule/range/switch', {
            params: {
              id: ruleId,
              enable: enable
            }
          }).then((data) => {
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
        }
      }
    }
  }
</script>
