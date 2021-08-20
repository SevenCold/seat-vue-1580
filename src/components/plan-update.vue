<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="60%"
    v-model="visible">
    <el-form :model="dataForm" inline :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item label="库区编号" prop="storageId" label-width="120px">
      <el-input v-model.number="dataForm.storageId" placeholder="库区编号"></el-input>
    </el-form-item>
    <el-form-item label="跨编号" prop="crossId" label-width="120px">
      <el-input v-model.number="dataForm.crossId" placeholder="跨编号"></el-input>
    </el-form-item>
    <el-form-item label="天车编号" prop="craneId" label-width="120px">
      <el-input v-model.trim="dataForm.craneId" placeholder="天车编号"></el-input>
    </el-form-item>
    <el-form-item label="任务类别" prop="taskType" label-width="120px">
      <el-input v-model.number="dataForm.taskType" placeholder="任务类别"></el-input>
    </el-form-item>
    <el-form-item label="天车优先级" prop="cranePriority" label-width="120px">
      <el-input v-model.number="dataForm.cranePriority" placeholder="天车优先级"></el-input>
    </el-form-item>
    <el-form-item label="是否自动化" prop="autoManual" label-width="120px">
      <el-input v-model.number="dataForm.autoManual" placeholder="是否自动化"></el-input>
    </el-form-item>
    <el-form-item label="天车状态" prop="craneStatus" label-width="120px">
      <el-input v-model.number="dataForm.craneStatus" placeholder="天车状态"></el-input>
    </el-form-item>
    <el-form-item label="是否可编辑" prop="canedit" label-width="120px">
      <el-switch v-model.number="dataForm.canedit" :active-value="1" :inactive-value="0"> </el-switch>
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
      let checkNum = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (!Number.isInteger(value)) {
          return callback(new Error('请输入数字'));
        }
        if (value < 0) {
          return callback(new Error('数字不能小于0'));
        }
        if (value > 1000000) {
          return callback(new Error('数字不能大于1000000'));
        }
        callback()
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          storageId: '',
          crossId: '',
          craneId: '',
          taskType: '',
          cranePriority: '',
          autoManual: '',
          craneStatus: '',
          canedit: '',
          enable: ''
        },
        dataRule: {
          storageId: [
            { required: true, message: '库区编号不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          crossId: [
            { required: true, message: '跨编号不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          craneId: [
            { required: true, message: '天车编号不能为空', trigger: 'blur' },
            { min: 1, max: 16, message: '天车编号不符合1-16位', trigger: 'blur' }
          ],
          taskType: [
            { required: true, message: '天车优先级不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          cranePriority: [
            { required: true, message: '天车优先级不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          autoManual: [
            { required: true, message: '是否自动化不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          craneStatus: [
            { required: true, message: '天车状态不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            axios.get(`/rule/plan/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                let crane = data.data
                this.dataForm.storageId = crane.storageId
                this.dataForm.crossId = crane.crossId
                this.dataForm.craneId = crane.craneId
                this.dataForm.taskType = crane.taskType
                this.dataForm.cranePriority = crane.cranePriority
                this.dataForm.autoManual = crane.autoManual
                this.dataForm.craneStatus = crane.craneStatus
                this.dataForm.canedit = crane.canedit
                this.dataForm.enable = crane.enable
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/rule/plan/${!this.dataForm.id ? 'save' : 'update'}`, {
                'id': this.dataForm.id || undefined,
                'storageId': this.dataForm.storageId,
                'crossId': this.dataForm.crossId,
                'craneId': this.dataForm.craneId,
                'taskType': this.dataForm.taskType,
                'cranePriority': this.dataForm.cranePriority,
                'autoManual': this.dataForm.autoManual,
                'craneStatus': this.dataForm.craneStatus,
                'canedit': this.dataForm.canedit,
                'enable': this.dataForm.enable
            }).then((data) => {
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
