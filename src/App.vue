<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      @select="menuSelect"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="/">规则管理</el-menu-item>
    <el-menu-item index="/area">区域管理</el-menu-item>
    <el-menu-item index="/areaConfig">区域具体配置</el-menu-item>
<!--    <el-menu-item index="/seat">鞍座展示</el-menu-item>-->
    <el-menu-item index="/craneConfig">天车属性配置</el-menu-item>
    <el-menu-item index="/planCondition">计划条件配置</el-menu-item>
    <el-menu-item index="/planDetail">计划具体配置</el-menu-item>
    <el-menu-item index="/plans">计划管理</el-menu-item>
    <el-menu-item index="/rule">其它管理</el-menu-item>
    <el-menu-item index="/test">其它管理</el-menu-item>
  </el-menu>
  <el-card :body-style="{minHeight: siteContentViewHeight + 'px', height: siteContentViewHeight + 'px'}">
    <router-view :contentHeight="siteContentViewHeight" />
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      documentClientHeight: 0,
      activeIndex: '/'
    };
  },
  mounted() {
    this.resetDocumentClientHeight()
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path
    }
  },
  computed: {
    siteContentViewHeight () {
      return this.documentClientHeight - 61 - 60
    }
  },
  methods: {
    resetDocumentClientHeight () {
      this.documentClientHeight = document.documentElement['clientHeight']
      let _this = this
      window.addEventListener('resize', () => {
        _this.documentClientHeight = document.documentElement['clientHeight']
      })
    },
    menuSelect (index) {
      this.$router.push(index)
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 8px;
}
</style>
