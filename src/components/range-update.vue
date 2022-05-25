<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" width="60%"
    v-model="visible">
    <el-form inline :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmit()">
    <el-form-item label="父设备ID" prop="parentId"  label-width="150px">
      <el-input v-model="dataForm.parentId" placeholder="跨的上层规则id为0" :disabled="disableParentId"></el-input>
    </el-form-item>
    <el-form-item label="设备类别" prop="type" label-width="150px" class="cus-select">
      <el-select v-model="dataForm.type" placeholder="请选择设备类别">
        <el-option
            v-for="(item, key) in deviceTypes"
            :key="key"
            :label="item.name"
            :value="item.value">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备名称" prop="name" label-width="150px">
      <el-input v-model.trim="dataForm.name" placeholder="设备名称"></el-input>
    </el-form-item>
    <el-form-item label="所属跨ID" prop="crossid" label-width="150px">
      <el-input v-model.number="dataForm.crossid" placeholder="所属跨ID"></el-input>
    </el-form-item>
    <el-form-item label="X坐标" prop="deviceX" label-width="150px">
      <el-input v-model.number="dataForm.deviceX" placeholder="设备X坐标"></el-input>
    </el-form-item>
    <el-form-item label="Y坐标" prop="deviceY" label-width="150px">
      <el-input v-model.number="dataForm.deviceY" placeholder="设备Y坐标"></el-input>
    </el-form-item>
    <el-form-item label="X坐标下限" prop="deviceXLLimit" label-width="150px">
      <el-input v-model.number="dataForm.deviceXLLimit" placeholder="X坐标下限"></el-input>
    </el-form-item>
    <el-form-item label="X坐标上限" prop="deviceXRLimit" label-width="150px">
      <el-input v-model.number="dataForm.deviceXRLimit" placeholder="X坐标上限"></el-input>
    </el-form-item>
    <el-form-item label="Y坐标下限" prop="deviceYLLimit" label-width="150px">
      <el-input v-model.number="dataForm.deviceYLLimit" placeholder="Y坐标下限"></el-input>
    </el-form-item>
    <el-form-item label="Y坐标上限" prop="deviceYRLimit" label-width="150px">
      <el-input v-model.number="dataForm.deviceYRLimit" placeholder="Y坐标上限"></el-input>
    </el-form-item>
    <el-form-item label="X坐标优先下限" prop="deviceXLPrecedence" label-width="150px">
      <el-input v-model.number="dataForm.deviceXLPrecedence" placeholder="X坐标优先下限"></el-input>
    </el-form-item>
    <el-form-item label="X坐标优先上限" prop="deviceXRPrecedence" label-width="150px">
      <el-input v-model.number="dataForm.deviceXRPrecedence" placeholder="X坐标优先上限"></el-input>
    </el-form-item>
      <el-form-item label="序号" prop="order" label-width="150px">
        <el-input v-model.number="dataForm.order" placeholder="序号"></el-input>
      </el-form-item>
    <el-form-item label="备注信息" prop="comment" label-width="150px" class="cus-select">
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
import {device_types} from '@/common/config'
  export default {
    emits: ["refreshDataList"],
    data () {
      let checkNum = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (isNaN(value)) {
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
        disableParentId: false,
        dataForm: {
          id: 0,
          name: '',
          crossid: '',
          deviceX: '',
          deviceY: '',
          parentId: '',
          type: '',
          deviceXLLimit: '',
          deviceXRLimit: '',
          deviceYLLimit: '',
          deviceYRLimit: '',
          deviceXLPrecedence: '',
          deviceXRPrecedence: '',
          comment: '',
          order: ''
        },
        deviceTypes: [],
        dataRule: {
          name: [
            { required: true, message: '设备名称不能为空', trigger: 'blur' },
            { min: 1, max: 15, message: '设备名称不符合1-15位', trigger: 'blur' }
          ],
          crossid: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXLLimit: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceX: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceY: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXRLimit: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceYLLimit: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceYRLimit: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXLPrecedence: [
            { validator: checkNum, trigger: 'blur'}
          ],
          deviceXRPrecedence: [
            { validator: checkNum, trigger: 'blur'}
          ],
          comment: [
            { min: 0, max: 200, message: '备注信息不能超过200位', trigger: 'blur' }
          ],
          order: [
            { validator: checkNum, trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.deviceTypes = device_types;
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        let _this = this
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.disableParentId = false
          if (this.dataForm.id) {
            axios.get(`/rule/range/info/${this.dataForm.id}`).then((data) => {
              if (data && data.status === 200) {
                let device = data.data
                _this.dataForm.name = device.name
                _this.dataForm.parentId = device.parentId
                _this.dataForm.type = device.type + ""
                _this.dataForm.deviceXLLimit = device.deviceXLLimit
                _this.dataForm.deviceXRLimit = device.deviceXRLimit
                _this.dataForm.deviceYLLimit = device.deviceYLLimit
                _this.dataForm.deviceYRLimit = device.deviceYRLimit
                _this.dataForm.deviceXLPrecedence = device.deviceXLPrecedence
                _this.dataForm.deviceXRPrecedence = device.deviceXRPrecedence
                _this.dataForm.comment = device.comment
                _this.dataForm.crossid = parseInt(device.crossid)
                _this.dataForm.deviceX = device.deviceX
                _this.dataForm.deviceY = device.deviceY
                _this.dataForm.order = device.order
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
          this.disableParentId = true
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            axios.post(`/rule/range/${!this.dataForm.id ? 'save' : 'update'}`, {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'parentId': this.dataForm.parentId,
              'type': this.dataForm.type,
              'deviceXLLimit': this.dataForm.deviceXLLimit,
              'deviceXRLimit': this.dataForm.deviceXRLimit,
              'deviceYLLimit': this.dataForm.deviceYLLimit,
              'deviceYRLimit': this.dataForm.deviceYRLimit,
              'deviceXLPrecedence': this.dataForm.deviceXLPrecedence,
              'deviceXRPrecedence': this.dataForm.deviceXRPrecedence,
              'crossid': this.dataForm.crossid,
              'deviceX': this.dataForm.deviceX,
              'deviceY': this.dataForm.deviceY,
              'comment': this.dataForm.comment,
              'order': this.dataForm.order
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
