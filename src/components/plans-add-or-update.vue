<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
      <el-form-item label="计划类型" prop="taskType" label-width="120px">
        <el-select v-model="dataForm.taskType" placeholder="请选择计划类型">
          <el-option
              v-for="(item, key) in planTypes"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="钢卷卷号" prop="coilId"  label-width="120px">
        <el-input v-model="dataForm.coilId" placeholder="钢卷名称"></el-input>
      </el-form-item>
      <el-form-item label="源位置" prop="deviceNameOrg"  label-width="120px">
        <el-input v-model="dataForm.deviceNameOrg" placeholder="源位置"></el-input>
      </el-form-item>
      <el-form-item label="目标位置" prop="deviceNameDes"  label-width="120px">
        <el-input v-model="dataForm.deviceNameDes" placeholder="目标位置"></el-input>
      </el-form-item>
      <el-form-item label="停车位" prop="parkedId"  label-width="120px">
        <el-input v-model="dataForm.parkedId" placeholder="停车位"></el-input>
      </el-form-item>
      <el-form-item label="钢卷去向" prop="procCd"  label-width="120px">
        <el-input v-model="dataForm.procCd" placeholder="钢卷去向"></el-input>
      </el-form-item>
      <el-form-item label="车牌号" prop="carNo"  label-width="120px">
        <el-input v-model="dataForm.carNo" placeholder="车牌号"></el-input>
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
import {plan_types} from '@/common/config'
  export default {
    emits: ["refreshDataList"],
    data () {
      return {
        planTypes: [],
        visible: false,
        dataForm: {
          id: 0,
          taskType: '',
          coilId: '',
          deviceNameOrg: '',
          deviceNameDes: '',
          carNo: '',
          parkedId: '',
          procCd: ''
        },
        levelTypes: [{name: '一层', value: 1}, {name: '二层', value: 2}, {name: '一层和二层', value: 3}],
        dataRule: {
          taskType: [
            { required: true, message: '计划类型不能为空', trigger: 'blur' }
          ],
          coilId: [
            { required: true, message: '卷号不能为空', trigger: 'blur' },
            { min: 1, max: 30, message: '卷号名称不符合1-30位', trigger: 'blur' }
          ],
          deviceNameOrg: [
            { max: 15, message: '源位置不能超过15位', trigger: 'blur' }
          ],
          deviceNameDes: [
            { max: 15, message: '目标位置不能超过15位', trigger: 'blur' }
          ],
          carNo: [
            { max: 15, message: '车牌号不能超过15位', trigger: 'blur' }
          ],
          parkedId: [
            { max: 15, message: '停车位不能超过15位', trigger: 'blur' }
          ],
          procCd: [
            { max: 15, message: '钢卷去向不能超过10位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.planTypes = plan_types
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          if (this.dataForm.id) {
              axios.get(`/plans/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                this.dataForm.id = data.data.id
                this.dataForm.taskType = data.data.taskType
                this.dataForm.coilId = data.data.coilId
                this.dataForm.deviceNameOrg = data.data.deviceNameOrg
                this.dataForm.deviceNameDes = data.data.deviceNameDes
                this.dataForm.carNo = data.data.carNo
                this.dataForm.parkedId = data.data.parkedId
                this.dataForm.procCd = data.data.procCd
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
            axios.post(`/plans/${!this.dataForm.id ? 'save' : 'update'}`, {
                'id': this.dataForm.id || undefined,
                'coilId': this.dataForm.coilId,
                'taskType': this.dataForm.taskType,
                'deviceNameOrg': this.dataForm.deviceNameOrg,
                'deviceNameDes': this.dataForm.deviceNameDes,
                'parkedId': this.dataForm.parkedId,
                'procCd': this.dataForm.procCd,
                'carNo': this.dataForm.carNo
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
