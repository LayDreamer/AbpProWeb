<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <Tree class="w-1/5 xl:w-1/5" />
    <Table class="flex-1 overflow-hidden" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import Tree from './Tree.vue';
  import Table from './Table.vue';
  export default defineComponent({
    name: 'NewFamilyLibsManagement',
    components: {
      PageWrapper,
      Tree,
      Table,
    },
    setup() {
      return {};
    },
  });
</script>
<style></style>
