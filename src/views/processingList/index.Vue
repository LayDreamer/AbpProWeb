<template>
  <div>
    <BasicTable @register="registerTable" size="small" @selection-change="rowClick">
      <template #toolbar>
        <a-button type="primary" @click="openFile"> 打开 </a-button>
        <a-button type="primary" @click="placeOrder"> 下单 </a-button>
        <a-button type="primary" @click="downloadFile"> 下载 </a-button>

        <a-button type="primary" @click="deleteFile">删除</a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'creationTime'">
          {{ new Date(record.creationTime).toLocaleString() }}
        </template>
      </template>
    </BasicTable>
    <EmailDes @register="registerModal" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, toRaw } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { IOrderNotificationSearchDto } from '/@/services/ServiceProxies';
  import { getProcessingListAsync, getExcel, deleteExcel } from './index';
  import ExcelDes from '/@/views/processingList/ExcelDes.vue';
  import EmailDes from '/@/views/processingList/EmailDes.vue';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    name: 'ProcessingList',
    components: { BasicTable, EmailDes },

    setup() {
      const { t } = useI18n();
      const selectedExcels = ref();
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;
      const go = useGo();
      const [registerModal, { openModal: openAdd, closeModal: closeAdd }] = useModal();

      const columns: BasicColumn[] = [
        {
          title: t('routes.processingList.fileName'),
          dataIndex: 'fileName',
          sorter: true,
          resizable: true,
        },
        {
          title: t('routes.processingList.creator'),
          dataIndex: 'creator',
        },
        {
          title: t('routes.processingList.projectName'),
          dataIndex: 'projectName',
          sorter: true,
          resizable: true,
        },
        {
          title: t('routes.processingList.projectCode'),
          dataIndex: 'projectCode',
        },
        {
          title: t('routes.processingList.creationTime'),
          dataIndex: 'creationTime',
          sorter: true,
        },
      ];
      const [registerTable, { reload }] = useTable({
        title: t('routes.processingList.processingTable'),
        beforeFetch: (data) => {
          const searchDto: IOrderNotificationSearchDto = {
            maxResultCount: data.pageSize,
            skipCount: data.pageIndex,
            sorting: data.sorting,
            key: data.key,
            searchValue: data.searchValue,
            searchCode: data.searchCode,
          };
          return searchDto;
        },
        rowKey: 'id',
        columns,
        api: getProcessingListAsync,
        formConfig: {
          labelWidth: 120,
          autoSubmitOnEnter: true,
        },
        showTableSetting: true,
        bordered: true,
        canResize: true,

        showIndexColumn: true,
        striped: false,
        loading: true,
        rowSelection: {
          type: 'checkbox',
        },
      });

      async function deleteFile() {
        if (selectedExcels.value == undefined || selectedExcels.value.length == 0) {
          error('请选择需删除的表格');
          return;
        }
        for (let i = 0; i < selectedExcels.value.length; i++) {
          await deleteExcel(selectedExcels.value[i].id);
        }
        reload();
      }

      function rowClick({ keys, rows }) {
        selectedExcels.value = rows;
      }
      async function downloadFile() {
        if (selectedExcels.value == undefined || selectedExcels.value.length != 1) {
          error('请选择一份需下载的表格');
          return;
        }
        var res = getExcel(selectedExcels.value[0].id);
        res.then(function (result) {
          let url = encodeURI(result.fileAddress).replace(/\#/g, '%23');
          window.open(url, '_self');
        });
      }

      function openFile() {
        if (selectedExcels.value == undefined || selectedExcels.value.length != 1) {
          error('请选择一份要打开的表格');
          return;
        }
        go(
          '/processingList/gyhExcelDes/' +
            toRaw(selectedExcels.value[0]).id +
            '?msg=' +
            toRaw(selectedExcels.value[0]).fileName,
        );
      }

      function placeOrder() {
        if (selectedExcels.value == undefined || selectedExcels.value.length == 0) {
          error('请选择要下单的表格');
          return;
        }
        openAdd(true, {
          data: selectedExcels.value,
        });
      }

      return {
        registerTable,
        rowClick,
        downloadFile,
        deleteFile,
        reload,
        openFile,
        registerModal,
        placeOrder,
      };
    },
  });
</script>
