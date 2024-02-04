<template>
  <BasicModal
    v-bind="$attrs"
    :title="modalTitle"
    :canFullscreen="false"
    :maskClosable="false"
    destroyOnClose
    @register="registerModal"
    @ok="ok"
  >
    <div class="p-4">
      <div class="h-8 w-full ml-2 mb-2">
        <a-input-search
          v-model:value="searchName"
          :placeholder="t('routes.productlist.productName')"
          allow-clear
          style="width: 350px"
          @search="searchProduct"
          @change="inputChange"
        />
      </div>
      <div class="h-80">
        <BasicTable @register="registerTable"> </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { getErpDataByNameCode } from '../index';
  import { getErpProductColumns } from '../tableData';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ProductInventoryEditDto } from '/@/services/ServiceProxies';
  export default defineComponent({
    components: {
      BasicModal,
      BasicTable,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const modalTitle = ref('');
      const tableData = ref<ProductInventoryEditDto[]>();
      const searchName = ref('');
      const tableLoading = ref();
      const init = () => {
        modalTitle.value = '';
        tableData.value = [];
        searchName.value = '';
        tableLoading.value = false;
      };
      const [registerModal] = useModalInner((response) => {
        setBackGround();
        init();
        modalTitle.value = response.title;
      });
      const [registerTable, { getSelectRows }] = useTable({
        size: 'small',
        rowSelection: {
          type: 'radio',
        },
        dataSource: tableData,
        columns: getErpProductColumns(),
        striped: false,
        loading: tableLoading,
        pagination: false,
        canResize: true,
        isCanResizeParent: true,
        showIndexColumn: false,
      });
      function setBackGround() {
        const elements = document.querySelectorAll('.ant-modal-mask');
        if (elements.length == 2) {
          elements[1].style.background = 'rgba(0,0,0,0)';
        }
      }
      return {
        t,
        modalTitle,
        searchName,
        registerModal,
        registerTable,
        searchProduct: async () => {
          if (searchName.value == '') {
            tableData.value = [];
            return;
          }
          tableLoading.value = true;
          try {
            const requestBody = {
              data: [{ name: searchName.value }],
            };
            tableData.value = await getErpDataByNameCode(JSON.stringify(requestBody));
          } catch {}
          tableLoading.value = false;
        },
        inputChange: () => {
          if (searchName.value == '') {
            tableData.value = [];
            return;
          }
        },
        ok: () => {
          emit('confirmClick', getSelectRows());
        },
      };
    },
  });
</script>
<style lang="less"></style>
