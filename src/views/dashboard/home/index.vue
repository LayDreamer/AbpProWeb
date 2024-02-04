<template>
  <PageWrapper>
    <Carousel style="max-height: max-content"></Carousel>
    <div class="lg:flex">
      <div class="lg:w-full !mt-4 enter-y">
        <DevCard class="enter-y mt-5" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import Carousel from './components/Carousel.vue';
  import DevCard from './components/DevCard.vue';
  import { PageWrapper } from '/@/components/Page';
</script>
