<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>
      <guage-container></guage-container>
    </el-main>
    <el-aside width="200px">Aside</el-aside>
  </el-container>
</template>

<script>
import GuageContainer from "@/views/container/guageContainer.vue";

export default {
  name: "wecPanel1",
  components: {GuageContainer}
}
</script>

<style scoped lang="scss">
.el-aside {
  background-color: #04befe;
}
</style>