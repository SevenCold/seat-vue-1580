<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="60%"
    v-model="visible">
    <el-form inline :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item label="天车号" prop="craneName" label-width="120px">
      <el-input v-model.trim="dataForm.craneName" placeholder="天车号"></el-input>
    </el-form-item>
      <el-form-item label="跨编号" prop="crossid" label-width="120px">
        <el-input v-model.trim="dataForm.crossid" placeholder="跨编号"></el-input>
      </el-form-item>
    <el-form-item label="x坐标下限" prop="deviceXLLimit" label-width="120px">
      <el-input v-model.number="dataForm.deviceXLLimit" placeholder="x坐标下限"></el-input>
    </el-form-item>
    <el-form-item label="x坐标上限" prop="deviceXRLimit" label-width="120px">
      <el-input v-model.number="dataForm.deviceXRLimit" placeholder="x坐标上限"></el-input>
    </el-form-item>
    <el-form-item label="y坐标下限" prop="deviceYLLimit" label-width="120px">
      <el-input v-model.number="dataForm.deviceYLLimit" placeholder="y坐标下限"></el-input>
    </el-form-item>
    <el-form-item label="y坐标上限" prop="deviceYRLimit" label-width="120px">
      <el-input v-model.number="dataForm.deviceYRLimit" placeholder="y坐标上限"></el-input>
    </el-form-item>
    <el-form-item label="x坐标优先下限" prop="deviceXLPrecedence" label-width="120px">
      <el-input v-model.number="dataForm.deviceXLPrecedence" placeholder="x坐标优先下限"></el-input>
    </el-form-item>
    <el-form-item label="x坐标优先上限" prop="deviceXRPrecedence" label-width="120px">
      <el-input v-model.number="dataForm.deviceXRPrecedence" placeholder="x坐标优先上限"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="comment" label-width="120px">
      <el-input type="textarea" rows="3" v-model.trim="dataForm.comment" placeholder="备注信息"></el-input>
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
          craneName: '',
          deviceXLLimit: '',
          deviceXRLimit: '',
          deviceYLLimit: '',
          deviceYRLimit: '',
          deviceXLPrecedence: '',
          deviceXRPrecedence: '',
          crossid: '',
          comment: ''
        },
        dataRule: {
          craneName: [
            { required: true, message: '天车号不能为空', trigger: 'blur' },
            { min: 1, max: 15, message: '天车号不符合1-15位', trigger: 'blur' }
          ],
          deviceXLLimit: [
            { required: true, message: 'x坐标下限不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXRLimit: [
            { required: true, message: 'x坐标上限不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceYLLimit: [
            { required: true, message: 'y坐标下限不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceYRLimit: [
            { required: true, message: 'y坐标上限不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXLPrecedence: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXRPrecedence: [
            { validator: checkNum, trigger: 'blur'}
          ],
          crossid: [
            { required: true, message: '跨编号不能为空', trigger: 'blur' },
            { min: 1, max: 3, message: '跨编号不符合1-3位', trigger: 'blur' }
          ],
          comment: [
            { min: 0, max: 200, message: '备注信息不能超过200位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        let _this = this
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            axios.get(`/rule/range/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                let crane = data.data
                _this.dataForm.craneName = crane.craneName
                _this.dataForm.deviceXLLimit = crane.deviceXLLimit
                _this.dataForm.deviceXRLimit = crane.deviceXRLimit
                _this.dataForm.deviceYLLimit = crane.deviceYLLimit
                _this.dataForm.deviceYRLimit = crane.deviceYRLimit
                _this.dataForm.deviceXLPrecedence = crane.deviceXLPrecedence
                _this.dataForm.deviceXRPrecedence = crane.deviceXRPrecedence
                _this.dataForm.crossid = crane.crossid
                _this.dataForm.comment = crane.comment
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/rule/range/${!this.dataForm.id ? 'save' : 'update'}`, {
              'id': this.dataForm.id || undefined,
              'craneName': this.dataForm.craneName,
              'deviceXLLimit': this.dataForm.deviceXLLimit,
              'deviceXRLimit': this.dataForm.deviceXRLimit,
              'deviceYLLimit': this.dataForm.deviceYLLimit,
              'deviceYRLimit': this.dataForm.deviceYRLimit,
              'deviceXLPrecedence': this.dataForm.deviceXLPrecedence,
              'deviceXRPrecedence': this.dataForm.deviceXRPrecedence,
              'crossid': this.dataForm.crossid,
              'comment': this.dataForm.comment
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
