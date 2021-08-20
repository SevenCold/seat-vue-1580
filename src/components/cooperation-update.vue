<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="60%"
    v-model="visible">
    <el-form inline :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item label="产线名称" prop="name" label-width="120px">
      <el-input v-model.trim="dataForm.name" placeholder="产线名称"></el-input>
    </el-form-item>
    <el-form-item label="产线编号" prop="no" label-width="120px">
      <el-input v-model.number="dataForm.no" placeholder="产线编号"></el-input>
    </el-form-item>
    <el-form-item label="单车正常作业" prop="value1" label-width="120px">
      <el-input v-model.number="dataForm.value1" placeholder="单车正常作业"></el-input>
    </el-form-item>
    <el-form-item label="单车就近作业" prop="value2" label-width="120px">
      <el-input v-model.number="dataForm.value2" placeholder="单车就近作业"></el-input>
    </el-form-item>
    <el-form-item label="双车正常作业" prop="value3" label-width="120px">
      <el-input v-model.number="dataForm.value3" placeholder="双车正常作业"></el-input>
    </el-form-item>
    <el-form-item label="双车就近作业" prop="value4" label-width="120px">
      <el-input v-model.number="dataForm.value4" placeholder="双车就近作业"></el-input>
    </el-form-item>
    <el-form-item label="value5" prop="value5" label-width="120px">
      <el-input v-model.number="dataForm.value5" placeholder="value5"></el-input>
    </el-form-item>
    <el-form-item label="value6" prop="value6" label-width="120px">
      <el-input v-model.number="dataForm.value6" placeholder="value6"></el-input>
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
  import axios from "axios";

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
          name: '',
          no: '',
          value1: '',
          value2: '',
          value3: '',
          value4: '',
          value5: '',
          value6: '',
          comment: ''
        },
        dataRule: {
          name: [
            { required: true, message: '产线名称不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '产线名称不符合1-20位', trigger: 'blur' }
          ],
          no: [
            { required: true, message: '产线编号不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          value1: [
            { validator: checkNum, trigger: 'blur'}
          ],
          value2: [
            { validator: checkNum, trigger: 'blur'}
          ],
          value3: [
            { validator: checkNum, trigger: 'blur'}
          ],
          value4: [
            { validator: checkNum, trigger: 'blur'}
          ],
          value5: [
            { validator: checkNum, trigger: 'blur'}
          ],
          value6: [
            { validator: checkNum, trigger: 'blur'}
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
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          if (this.dataForm.id) {
            axios.get(`/rule/coop/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                let crane = data.data
                this.dataForm.name = crane.name
                this.dataForm.no = crane.no
                this.dataForm.value1 = crane.value1
                this.dataForm.value2 = crane.value2
                this.dataForm.value3 = crane.value3
                this.dataForm.value4 = crane.value4
                this.dataForm.value5 = crane.value5
                this.dataForm.value6 = crane.value6
                this.dataForm.comment = crane.comment
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/rule/coop/${!this.dataForm.id ? 'save' : 'update'}`, {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'no': this.dataForm.no,
              'value1': this.dataForm.value1,
              'value2': this.dataForm.value2,
              'value3': this.dataForm.value3,
              'value4': this.dataForm.value4,
              'value5': this.dataForm.value5,
              'value6': this.dataForm.value6,
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
