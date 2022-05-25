<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()" label-width="80px">
    <el-form-item v-if="!dataForm.id" label="规则id" prop="ruleId"  label-width="120px">
      <el-input v-model.number="dataForm.ruleId" placeholder="规则id"></el-input>
    </el-form-item>
    <el-form-item label="鞍座层级" prop="level" label-width="120px">
      <el-select v-model="dataForm.level" placeholder="请选择鞍座层级">
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
    <el-form-item label="区域名称" prop="areaName"  label-width="120px">
      <el-input v-model="dataForm.areaName" placeholder="区域名称"></el-input>
    </el-form-item>
    <el-form-item label="区域描述" prop="areaDesc"  label-width="120px">
      <el-input type="textarea" rows="3" v-model="dataForm.areaDesc" placeholder="区域描述"></el-input>
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
          ruleId: '',
          areaName: '',
          areaDesc: '',
          level: 3
        },
        levelTypes: [{name: '一层', value: 1}, {name: '二层', value: 2}, {name: '一层和二层', value: 3}],
        dataRule: {
          ruleId: [
            { required: true, message: '规则ID不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur'}
          ],
          areaName: [
            { required: true, message: '区域名称不能为空', trigger: 'blur' },
            { min: 1, max: 50, message: '区域名称不符合1-50位', trigger: 'blur' }
          ],
          areaDesc: [
            { max: 100, message: '区域描述不能超过100位', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '鞍座层级不能为空', trigger: 'blur' }
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
              axios.get(`/area/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                this.dataForm.id = data.data.id
                this.dataForm.level = data.data.level
                this.dataForm.areaName = data.data.areaName
                this.dataForm.areaDesc = data.data.areaDesc
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
            axios.post(`/area/${!this.dataForm.id ? 'save' : 'update'}`, {
                'id': this.dataForm.id || undefined,
                'ruleId': this.dataForm.ruleId,
                'areaName': this.dataForm.areaName,
                'level': this.dataForm.level,
                'areaDesc': this.dataForm.areaDesc
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
