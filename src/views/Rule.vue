<template>
  <el-tabs v-model="activeName" type="border-card" stretch style="height: 100%">
    <el-tab-pane label="天车范围" name="first">
      <template #label>
        <span class="cus-label">天车范围</span>
      </template>
      <range :tableHeight="tableHeight"></range>
    </el-tab-pane>
    <el-tab-pane label="多车协作" name="second">
      <template #label>
        <span class="cus-label">多车协作</span>
      </template>
      <cooperation :tableHeight="tableHeight"></cooperation>
    </el-tab-pane>
    <el-tab-pane label="天车计划" name="third">
      <template #label>
        <span class="cus-label">天车计划</span>
      </template>
      <plan :tableHeight="tableHeight"></plan>
    </el-tab-pane>
    <el-tab-pane label="环冷坑配置" name="fourth">
      <template #label>
        <span class="cus-label">环冷坑配置</span>
      </template>
      <cool :tableHeight="tableHeight"></cool>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import range from '@/components/range'
import plan from '@/components/plan'
import cooperation from '@/components/cooperation'
import cool from '@/components/slow-cool'
export default {
  data() {
    return {
      activeName: 'first'
    };
  },
  props: {
    contentHeight: Number
  },
  components: {
    range, plan, cooperation, cool
  },
  computed: {
    tableHeight () {
      return this.contentHeight - 40 - 35 - 80
    }
  },
  methods: {
  }
};
</script>
<style>
.cus-label {
  font-size: 16px;
  font-weight: bold;
}
</style>