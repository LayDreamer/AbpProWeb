<template>
  <PageWrapper>
    <!-- <template #headerContent> <WorkbenchHeader /> </template> -->
    <Carousel></Carousel>
    <div class="lg:flex">
      <div class="lg:w-full !mt-4 enter-y">
        <!-- <ProjectCard :loading="loading" class="enter-y" /> -->
        <DevCard :loading="loading" class="enter-y mt-5" />
        <!-- <DynamicInfo :loading="loading" class="!my-4 enter-y" /> -->
      </div>
      <!-- <div class="lg:w-3/10 w-full enter-y">
        <QuickNav :loading="loading" class="enter-y" />

        <Card class="!my-4 enter-y" :loading="loading">
          <img class="xl:h-50 h-30 mx-auto" src="../../../assets/svg/illustration.svg" />
        </Card>

        <SaleRadar :loading="loading" class="enter-y" />
      </div> -->
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import Carousel from './components/Carousel.vue';
  import DevCard from './components/DevCard.vue';
  import ProjectCard from './components/ProjectCard.vue';
  import QuickNav from './components/QuickNav.vue';
  import DynamicInfo from './components/DynamicInfo.vue';
  import SaleRadar from './components/SaleRadar.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
