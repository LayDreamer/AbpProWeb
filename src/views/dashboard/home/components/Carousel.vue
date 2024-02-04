<template>
  <a-carousel autoplay>
    <div> <img src="../../../../assets/images/yasha5.png" /></div>
    <div> <img src="../../../../assets/images/yasha1.png" /></div>
    <div> <img src="../../../../assets/images/yasha2.png" /></div>
    <div> <img src="../../../../assets/images/yasha3.png" /></div>
  </a-carousel>
</template>
<script lang="ts">
  import { Carousel } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: { ACarousel: Carousel },
    setup() {
      return {};
    },
  });
</script>
<style scoped>
  /* For demo */
  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: max-content;
    /* line-height: 400px; */
    /* background-color: #364d79; */
    background: fixed;
    overflow: hidden;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }
</style>
