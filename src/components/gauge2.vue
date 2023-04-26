<template>
  <div>
    <canvas id="canvas" ref="canvas" width="400" height="400"></canvas>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { gaugeStyleParam, gauge_setting } from "@/composables/gauge_setting";

//定义参数，不同msg代表仪表盘（转速、风速等等）
const props = defineProps<{
  style_param : gaugeStyleParam
}>()
//获取组合式api中的处理逻辑
const {scale_animation,data } = gauge_setting(props.style_param);
//获取组件实例
const canvas = ref()
//刻度动画
scale_animation(
    props.style_param.min_num,
    props.style_param.max_num,
    props.style_param.now_num,
    props.style_param.min_num
);
onMounted(()=>{
  canvas.value.width = props.style_param.canvas_width;
  canvas.value.height = props.style_param.canvas_height;
  let ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;
  let point_w = canvas.value.width / 2;
  data.ctx = ctx;
  data.canvas = canvas;
  data.point_w = point_w;

  //采用深度监听，遍历参数中值的变化
  watch( () => props.style_param,(newVal)=>{
    clearInterval(data.qq);
    scale_animation(
        newVal.min_num,
        newVal.max_num,
        newVal.now_num,
        data.start_num
    )
  },{deep:true})
})


</script>

<style scoped>

</style>