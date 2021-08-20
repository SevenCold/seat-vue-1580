<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item label="钢种名称" prop="coilGrade"  label-width="120px">
      <el-input v-model="dataForm.coilGrade" placeholder="钢种名称"></el-input>
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
          coilGrade: ''
        },
        dataRule: {
          coilGrade: [
            { required: true, message: '钢种名称不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '钢种名称不符合1-20位', trigger: 'blur' }
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
              axios.get(`/cool/info/${this.dataForm.id}`).then(data => {
              if (data && data.status === 200) {
                this.dataForm.coilGrade = data.data.coilGrade
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/cool/${!this.dataForm.id ? 'save' : 'update'}`, {
                'id': this.dataForm.id || undefined,
                'coilGrade': this.dataForm.coilGrade
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
