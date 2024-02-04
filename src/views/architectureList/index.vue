<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <Tree style="width: 200px"></Tree>
    <Main class="flex-1 overflow-hidden"></Main>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import Tree from './tree.vue';
  import { PageWrapper } from '/@/components/Page';
  import Main from '/@/views/architectureList/Main.vue';
  export default defineComponent({
    name: 'ArchitectureList',
    components: {
      PageWrapper,
      Tree,
      Main,
    },
    setup() {
      return {};
    },
  });
</script>
<style></style>
