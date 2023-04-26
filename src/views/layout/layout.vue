<template>
  <h3>
    这里是布局测试页面
  </h3>
  <el-row :gutter="10">
    <el-col :span="5">
      <div class="grid-content ep-bg-purple" />
      <h1>say hi</h1>
    </el-col>
    <el-col :span="14">
      <div class="grid-content ep-bg-purple" />
      <h1>say hi</h1>
    </el-col>
    <el-col :span="5">
      <div class="grid-content ep-bg-purple" />
      <h1>say hi</h1>
    </el-col>
  </el-row>
  <el-row :gutter="10">
  <el-col :span="5">
    <div class="grid-content ep-bg-purple" />
    <h1>say hi</h1>
  </el-col>
  <el-col :span="14">
    <div class="grid-content ep-bg-purple" />
    <h1>say hi</h1>
  </el-col>
  <el-col :span="5">
    <div class="grid-content ep-bg-purple" />
    <h1>say hi</h1>
  </el-col>
</el-row>
  <el-row :gutter="10">
    <el-col :span="19">
      <div class="grid-content ep-bg-purple" />
      <h1>say hi</h1>
    </el-col>
    <el-col :span="5">
      <div class="grid-content ep-bg-purple" />
      <h1>say hi</h1>
    </el-col>
  </el-row>
  </template>

<script setup lang="ts">
// export default {
//   name: "layout"
// }
</script>

<style scoped lang="scss" >
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {

  border-radius: 4px;
}

.grid-content {
  background-color: #4d84e2;
  border-radius: 4px;
  min-height: 36px;
}
</style>