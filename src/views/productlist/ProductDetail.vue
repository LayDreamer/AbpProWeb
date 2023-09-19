<template>
  <PageWrapper :title="fileName + `的资料`" contentBackground @back="goBack">
    <div class="pt-4 m-4 desc-wrap bg-white">
      <BasicTable
        @register="register"
        @resizeColumn="handleResizeColumn"
        @fetch-success="onFetchSuccess"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, nextTick, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getProductDetail } from './Index';
  import { getProductDetailColumns } from './tableData';
  export default defineComponent({
    name: 'gyhProductDetail',
    components: {
      PageWrapper,
      BasicTable,
    },
    setup() {
      const go = useGo();
      const { setTitle } = useTabs();
      const route = useRoute();
      const fileName = new URLSearchParams(window.location.search).get('msg');
      const userId = ref(route.params.id);
      const [register, { expandAll }] = useTable({
        rowKey: 'id',
        beforeFetch: () => {
          return userId.value;
        },
        api: getProductDetail,
        columns: getProductDetailColumns(),
        pagination: false,
        isTreeTable: true,
        striped: false,
      });

      function handleResizeColumn(w, col) {
        col.width = w;
      }
      onMounted(() => {
        setTitle('详情: ' + fileName);
      });

      function goBack() {
        go('/productManagement/gyhProductList');
      }
      function onFetchSuccess() {
        nextTick(expandAll);
      }
      return {
        fileName,
        goBack,
        register,
        onFetchSuccess,
        handleResizeColumn,
      };
    },
  });
</script>
