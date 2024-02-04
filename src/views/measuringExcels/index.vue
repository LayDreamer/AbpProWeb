<template>
  <div>
    <BasicTable @register="registerTable" size="small" @selection-change="rowClick">
      <template #toolbar>
        <a-button type="primary" @click="uploadFile"> 上传 </a-button>
        <a-button type="primary" @click="downloadFile"> 下载 </a-button>
        <a-button type="primary" @click="deleteFile">删除</a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'creationTime'">
          {{ new Date(record.creationTime).toLocaleString() }}
        </template>
      </template>
    </BasicTable>
    <uploadExcel @register="registerModal" @submit="addSubmit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { deleteExcel, getMeasuringExcelAsync } from './index';
  import { useModal } from '/@/components/Modal';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { IOrderNotificationSearchDto } from '/@/services/ServiceProxies';
  import uploadExcel from '/@/views/measuringExcels/uploadExcel.vue';

  export default defineComponent({
    name: 'MeasutingExcels',
    components: {
      BasicTable,
      uploadExcel,
    },
    setup() {
      const { t } = useI18n();
      const selectedExcels = ref();
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;

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
          title: t('routes.processingList.creationTime'),
          dataIndex: 'creationTime',
          sorter: true,
          width: 150,
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
        api: getMeasuringExcelAsync,
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
      function uploadFile() {
        openAdd(true);
      }

      function addSubmit() {
        closeAdd();
        reload();
      }
      function downloadFile() {
        if (selectedExcels.value == undefined || selectedExcels.value.length != 1) {
          error('请选择一份需下载的表格');
          return;
        }
        let url = encodeURI(selectedExcels.value[0].fileAddress).replace(/\#/g, '%23');
        window.open(url, '_self');
      }

      return {
        registerTable,
        rowClick,
        uploadFile,
        downloadFile,
        deleteFile,
        reload,
        registerModal,
        addSubmit,
      };
    },
  });
</script>
