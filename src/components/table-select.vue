<template>
  <el-form-item :label="label" :prop="prop"  label-width="120px" class="cus-select">
    <el-select v-model="model" :placeholder="placeholder">
      <el-option
          v-for="(item, key) in list"
          :key="key"
          :label="item.name"
          :value="item.value">
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: "table-select",
  props: {
    list: {
      type: Array,
      default: [{
        name: '',
        value: ''
      }]
    },
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
    model: {
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择...',
    }
  },
}
</script>

<style scoped>

.cus-select .el-form-item__content {
  width: 206.4px;
}
</style>