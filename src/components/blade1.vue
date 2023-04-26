<template>
  <div>
    <canvas id="blade_canvas"  ref="blade_canvas"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watchSyncEffect} from "vue";
import {bladeSetting} from "@/composables/blade_setting";
const props = defineProps<{
  bladeStyle : any
}>();
const {bladeStyle} = toRefs(props);
const blade_canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D;
let startNum =  bladeStyle.value.start_num
onMounted(()=>{
  initCanvas();
  const {clearId,scale_animation} = bladeSetting(props.bladeStyle,ctx);
  scale_animation(bladeStyle.value.data,bladeStyle.value.start_num);
  watchSyncEffect(()=>{
    clearInterval(clearId.value);
    scale_animation(
        bladeStyle.value.data,
        startNum
    );
    startNum = bladeStyle.value.data;
  })
});


const initCanvas = () => {
  ctx = blade_canvas.value?.getContext("2d") as CanvasRenderingContext2D;
  blade_canvas.value!.width = bladeStyle.value.width;
  blade_canvas.value!.height = bladeStyle.value.height;
};

</script>
<style scoped>
#blade_canvas {
  background-color: #003951;
}
</style>
