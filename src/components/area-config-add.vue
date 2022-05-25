<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
      <el-form-item label="区名" prop="regionName"  label-width="120px">
        ZH0
        <el-select v-model="dataForm.cross" placeholder="请选择跨" class="cross_select">
          <el-option
              v-for="(item, key) in crossTypes"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
          </el-option>
        </el-select>
         -
        <el-select v-model="dataForm.region" placeholder="请选择区" class="cross_select">
          <el-option
              v-for="(item, key) in areaTypes"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单双层" prop="seatLevel" label-width="120px">
        <el-select v-model="dataForm.seatLevel" placeholder="请选择单双层">
          <el-option
              v-for="(item, key) in levelTypes"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行" prop="seatRow"  label-width="120px">
        <el-input v-model.trim="dataForm.seatRow" placeholder="行（多个以 , 分割）"></el-input>
      </el-form-item>
      <el-form-item label="列" prop="seatColumn"  label-width="120px">
        <el-input v-model.trim="dataForm.seatColumn" placeholder="列（多个以 , 分割）"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="rank"  label-width="120px">
        <el-input v-model.number="dataForm.rank" placeholder="排序"></el-input>
      </el-form-item>
    </el-form>
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
      visible: false,
      dataForm: {
        id: 0,
        areaId: '',
        cross: 1,
        region: 'A',
        seatLevel: '',
        seatRow: '',
        seatColumn: '',
        rank: ''
      },
      levelTypes: [{name: '单层', value: 1}, {name: '双层', value: 2}],
      crossTypes: [{name: '1跨', value: 1}, {name: '2跨', value: 2}],
      areaTypes: [{name: 'A区', value: 'A'}, {name: 'B区', value: 'B'}, {name: 'C区', value: 'C'}, {name: 'D区', value: 'D'},
                  {name: 'E区', value: 'E'}, {name: 'F区', value: 'F'}, {name: 'G区', value: 'G'},
                  {name: 'H区', value: 'H'}, {name: 'I区', value: 'I'}, {name: 'J区', value: 'J'}],
      dataRule: {
        cross: [
          { required: true, message: '跨号不能为空', trigger: 'blur' },
          { min: 1, max: 1, message: '跨号不符合1位', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '区号不能为空', trigger: 'blur' },
          { min: 1, max: 1, message: '区号不符合1位', trigger: 'blur' }
        ],
        seatLevel: [
          { required: true, message: '单双层不能为空', trigger: 'blur' }
        ],
        rank: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        seatRow: [
          { max: 200, message: '区域行不能超过200位', trigger: 'blur' }
        ],
        seatColumn: [
          { max: 200, message: '区域列不能超过200位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.areaId = id
      this.dataForm.id = undefined
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    update (id) {
      this.dataForm.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (this.dataForm.id) {
          axios.get(`/region/info/${this.dataForm.id}`).then((data) => {
            if (data && data.status === 200) {
              this.dataForm.id = data.data.id
              this.dataForm.areaId = data.data.areaId
              // ZH01-A-01-12-1
              let cross = data.data.regionName.trim().charAt(3)
              let region = data.data.regionName.trim().charAt(5)
              this.dataForm.cross = cross
              this.dataForm.region = region
              this.dataForm.seatLevel = data.data.seatLevel
              this.dataForm.seatRow = data.data.seatRow
              this.dataForm.seatColumn = data.data.seatColumn
              this.dataForm.rank = data.data.rank
            }
          })
        } else {
          this.dataForm.ruleId = ""
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let regionName = 'ZH0' + this.dataForm.cross + "-" + this.dataForm.region
          axios.post(`/region/${!this.dataForm.id ? 'save' : 'update'}`, {
            'id': this.dataForm.id || undefined,
            'areaId': this.dataForm.areaId,
            'regionName': regionName,
            'seatLevel': this.dataForm.seatLevel,
            'seatRow': this.dataForm.seatRow,
            'seatColumn': this.dataForm.seatColumn,
            'rank': this.dataForm.rank
          }).then(data => {
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
      })
    }
  }
}
</script>

<style>
.cross_select {
  width: 85px !important;
}
</style>
