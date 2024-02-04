<template>
  <div class="p-4">
    <productTable />
  </div>  
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import productTable from './productTable.vue';
  export default defineComponent({
    name: 'ProductRetrievalManagement',
    components: {
      PageWrapper,
      productTable,
    },
  });
</script>
