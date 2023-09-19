<template>
  <a-carousel autoplay>
    <!-- <div> <img class="xl:h-50 h-30 mx-auto" src="../../../../assets/svg/illustration.svg" /></div> -->
    <div> <img src="../../../../assets/images/yasha5.jpg" /></div>
    <div> <img src="../../../../assets/images/yasha1.jpg" /></div>
    <div> <img src="../../../../assets/images/yasha2.jpg" /></div>
    <div> <img src="../../../../assets/images/yasha3.jpg" /></div>
  </a-carousel>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({});
</script>
<style scoped>
  /* For demo */
  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 450px;
    /* line-height: 400px; */
    /* background-color: #364d79; */
    background: fixed;
    overflow: hidden;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }
</style>
