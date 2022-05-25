<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
      <el-form-item label="区名" prop="regionName"  label-width="120px">
        <el-input v-model="dataForm.regionName" placeholder="区名"></el-input>
      </el-form-item>
      <el-form-item label="区号" prop="regionNum"  label-width="120px">
        <el-input v-model.number="dataForm.regionNum" placeholder="区号"></el-input>
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
    <el-form-item label="跨号" prop="seatLevel" label-width="120px">
      <el-select v-model="dataForm.crossId" placeholder="请选择跨">
        <el-option
            v-for="(item, key) in crossTypes"
            :key="key"
            :label="item.name"
            :value="item.value">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </el-form-item>
      <el-form-item label="行" prop="seatRow"  label-width="120px">
        <el-input v-model="dataForm.seatRow" placeholder="行"></el-input>
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
          regionName: '',
          regionNum: '',
          crossId: 1,
          seatRow: '',
          seatLevel: 2
        },
        levelTypes: [{name: '单层', value: 1}, {name: '双层', value: 2}],
        crossTypes: [{name: '1跨', value: 1}, {name: '2跨', value: 2}, {name: '3跨', value: 3},
          {name: '4跨', value: 4}, {name: '5跨', value: 5}],
        dataRule: {
          regionNum: [
            { required: true, message: '区号不能为空', trigger: 'blur' }
          ],
          regionName: [
            { required: true, message: '区名不能为空', trigger: 'blur' },
            { min: 8, max: 8, message: '区名不符合8位', trigger: 'blur' }
          ],
          areaDesc: [
            { max: 100, message: '区域描述不能超过100位', trigger: 'blur' }
          ],
          crossId: [
            { required: true, message: '跨号不能为空', trigger: 'blur' }
          ],
          seatLevel: [
            { required: true, message: '单双层不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          if (this.dataForm.id) {
              axios.get(`/region/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                this.dataForm.id = data.data.id
                this.dataForm.regionName = data.data.regionName
                this.dataForm.regionNum = data.data.regionNum
                this.dataForm.crossId = data.data.crossId
                this.dataForm.seatLevel = data.data.seatLevel
                this.dataForm.seatRow = data.data.seatRow
              }
            })
          } else {
            this.dataForm.crossId = 1
            this.dataForm.regionName = ''
            this.dataForm.regionNum = ''
            this.dataForm.seatLevel = 2
            this.dataForm.seatRow = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            axios.post(`/region/${!this.dataForm.id ? 'save' : 'update'}`, {
                'id': this.dataForm.id || undefined,
                'regionNum': this.dataForm.regionNum,
                'regionName': this.dataForm.regionName,
                'crossId': this.dataForm.crossId,
                'seatLevel': this.dataForm.seatLevel,
                'seatRow': this.dataForm.seatRow
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
