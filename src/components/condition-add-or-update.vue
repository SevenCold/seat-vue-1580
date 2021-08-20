<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="60%"
    v-model="visible">
    <el-form :model="dataForm" inline :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()">
      <el-form-item label="父条件ID" prop="parentId"  label-width="120px">
        <el-input v-model="dataForm.parentId" placeholder="父条件id" :disabled="disableParentId"></el-input>
      </el-form-item>
      <el-form-item label="条件名称" prop="name"  label-width="120px">
        <el-input v-model="dataForm.name" placeholder="条件名称"></el-input>
      </el-form-item>
      <el-form-item label="钢卷属性" prop="prop"  label-width="120px" class="prop-select">
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
      <el-form-item label="比较符号" prop="operator" label-width="120px" class="prop-select">
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
      <el-form-item label="条件类型" prop="ruleType" label-width="120px" class="prop-select">
        <el-select v-model="dataForm.ruleType" @change="typeChange" placeholder="条件类型">
          <el-option
              v-for="(item, key) in types"
              :key="key"
              :label="item.name"
              :value="item.value">
            <el-tooltip class="item" effect="dark" :content="item.tip" placement="right">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-tooltip>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="具体值" v-if="dataForm.ruleType === '0'" prop="value"  label-width="120px">
        <el-input v-model="dataForm.value" placeholder="多个以、分割"></el-input>
      </el-form-item>
      <el-form-item label="排序序号" prop="rank"  label-width="120px">
        <el-input v-model="dataForm.rank" placeholder="排序序号"></el-input>
      </el-form-item>
        <el-form-item label="是否可回退" prop="canBack"  label-width="120px">
          <el-switch v-model.number="dataForm.canBack" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      <el-form-item label="是否默认条件" v-if="dataForm.ruleType === '0'" prop="isDefault"  label-width="120px">
        <el-switch v-model.number="dataForm.isDefault" :active-value="1" :inactive-value="0"> </el-switch>
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
import {operators, types, props} from '@/common/config'
  export default {
    emits: ["refreshDataList"],
    data () {
      let check = (rule, value, callback) => {
        if (this.dataForm.isDefault !== 1 && !value) {
          return callback(new Error('不是默认条件，不能为空！'));
        }
        callback()
      }
      let checkValue = (rule, value, callback) => {
        if (!value) {
          let isDefault = this.dataForm.isDefault === 1
          let isNormal = this.dataForm.ruleType === '0'
          if (!isDefault) {
            return callback(new Error('不能为空！'));
          }
          if (!isNormal) {
            return callback(new Error('不能为空！'));
          }
        }
        callback()
      }
      return {
        disableParentId: false,
        props: [],
        operators: [],
        types: [],
        visible: false,
        dataForm: {
          id: 0,
          parentId: '',
          name: '',
          ruleType: '',
          prop: '',
          operator: '',
          value: '',
          rank: '',
          isDefault: 0,
          canBack: 1
        },
        dataRule: {
          parentId: [
            { required: true, message: '父条件ID不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '条件名称不能为空', trigger: 'blur' }
          ],
          prop: [
            { validator: check, trigger: 'blur'}
          ],
          operator: [
            { validator: check, trigger: 'blur'}
          ],
          value: [
            { validator: checkValue, trigger: 'blur'}
          ],
          rank: [
            { required: true, message: '排序序号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.props = props;
      this.types = types;
      this.operators = operators;
    },
    methods: {
      typeChange() {
        this.dataForm.value = ''
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
              this.disableParentId = true
              axios.get(`/ruleTree/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                let rule = data.data
                console.info(rule)
                this.dataForm.parentId = rule.parentId
                this.dataForm.name = rule.name
                this.dataForm.prop = rule.prop
                this.dataForm.operator = rule.operator
                this.dataForm.value = rule.value
                this.dataForm.rank = rule.rank
                this.dataForm.isDefault = rule.isDefault
                this.dataForm.ruleType = rule.ruleType + ""
                this.dataForm.canBack = rule.canBack
              }
            })
          } else {
            this.disableParentId = false
          }
        })
      },
      initChild (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.id = undefined
          this.dataForm.parentId = id
          this.disableParentId = true
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let value = this.dataForm.ruleType === '0' ? this.dataForm.value.trim() : this.types[this.dataForm.ruleType].tip
            axios.post(`/ruleTree/${!this.dataForm.id ? 'save' : 'update'}`, {
                'id': this.dataForm.id || undefined,
                'parentId': this.dataForm.parentId,
                'name': this.dataForm.name.trim(),
                'prop': this.dataForm.prop,
                'operator': this.dataForm.operator,
                'ruleType': this.dataForm.ruleType,
                'value': value,
                'rank': this.dataForm.rank,
                'isDefault': this.dataForm.isDefault,
                'canBack': this.dataForm.canBack
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
.prop-select .el-form-item__content {
    width: 206.4px;
}
</style>
