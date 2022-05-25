<template>
  <el-dialog
    :title="!dataForm.id ? '新增并列规则' : '修改并列规则'"
    :close-on-click-modal="false" width="60%"
    v-model="visible">
    <el-form :model="dataForm" inline :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()">
      <el-form-item label="规则类型" prop="ruleType" label-width="120px" class="cus-select">
        <el-select v-model="dataForm.ruleType" @change="typeChange" placeholder="规则类型">
          <el-option
              v-for="(item, key) in types"
              :key="key"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="钢卷属性" prop="prop"  label-width="120px" class="cus-select">
        <el-select v-model="dataForm.prop" placeholder="请选择钢卷属性">
          <el-option
              v-for="(item, key) in props"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="比较符号" prop="operator" label-width="120px" class="cus-select">
        <el-select v-model="dataForm.operator" placeholder="比较符号">
          <el-option
              v-for="(item, key) in operators"
              :key="key"
              :label="item.name"
              :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="具体值" prop="value"  label-width="120px">
        <el-input v-model="dataForm.value" placeholder="多个以、分割"></el-input>
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
import {rule_operators, rule_types, rule_props} from '@/common/config'
  export default {
    emits: ["refreshDataList"],
    data () {
      let check = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空！'));
        }
        callback()
      }
      return {
        props: [],
        operators: [],
        types: [],
        visible: false,
        dataForm: {
          id: 0,
          parentId: '',
          ruleType: '',
          prop: '',
          operator: '',
          value: '',
        },
        dataRule: {
          prop: [
            { validator: check, trigger: 'blur'}
          ],
          operator: [
            { validator: check, trigger: 'blur'}
          ],
          value: [
            { validator: check, trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.props = rule_props;
      this.types = rule_types.filter(e => (e.value === '2' || e.value === '3'));
      this.operators = rule_operators;
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
              axios.get(`/ruleTree/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                let rule = data.data
                this.dataForm.parentId = rule.parentId
                this.dataForm.prop = rule.prop
                this.dataForm.operator = rule.operator
                this.dataForm.value = rule.value
                this.dataForm.ruleType = rule.ruleType + ""
              }
            })
          }
        })
      },
      initChild (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.id = undefined
          this.dataForm.parentId = id
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/ruleTree/${!this.dataForm.id ? 'saveSide' : 'updateSide'}`, {
                'id': this.dataForm.id || undefined,
                'parentId': this.dataForm.parentId,
                'prop': this.dataForm.prop,
                'operator': this.dataForm.operator,
                'ruleType': this.dataForm.ruleType,
                'value': this.dataForm.value
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
.cus-select .el-form-item__content {
    width: 206.4px;
}
</style>
