<template>
  <div>
    <BasicTable @register="registerTable" size="small" @selection-change="rowClick">
      <template #toolbar>
        <a-button type="primary" @click="addNewList">新增清单</a-button>
        <a-button type="primary" @click="downloadFile"> 下载 </a-button>
        <a-button type="primary" @click="deleteFile">删除</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'creationTime'">
          {{ new Date(record.creationTime).toLocaleString() }}
        </template>
      </template>
    </BasicTable>
    <CreateList @register="registerModal" @submit="addSubmit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, toRaw } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  import { getList, get, deleteOder } from './index';
  import CreateList from '/@/views/saleOderList/CreateList.vue';
  import { IOrderNotificationSearchDto } from '/@/services/ServiceProxies';

  export default defineComponent({
    name: 'ProcessingList',
    components: { BasicTable, CreateList },

    setup() {
      const { t } = useI18n();
      const selectedExcels = ref();
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;
      const go = useGo();
      const [registerModal, { openModal: openAdd, closeModal: closeAdd }] = useModal();

      const columns: BasicColumn[] = [
        {
          title: t('routes.saleOderList.name'),
          dataIndex: 'name',
          sorter: true,
        },
        {
          title: t('routes.saleOderList.uploadUser'),
          dataIndex: 'uploadUser',
          sorter: true,
        },
        {
          title: t('routes.saleOderList.creationTime'),
          dataIndex: 'creationTime',
          sorter: true,
          width: 150,
        },
      ];
      function rowClick({ keys, rows }) {
        selectedExcels.value = rows;
      }
      function downloadFile() {
        if (selectedExcels.value == undefined || selectedExcels.value.length != 1) {
          error('请选择一份需下载的表格');
          return;
        }
        var res = get(selectedExcels.value[0].id);
        res.then(function (result) {
          if (typeof result.filePath === 'string') {
            let url = encodeURI(result.filePath).replace(/\#/g, '%23');
            window.open(url, '_self');
          }
        });
      }
      async function deleteFile() {
        if (selectedExcels.value == undefined || selectedExcels.value.length == 0) {
          error('请选择需删除的表格');
          return;
        }
        for (let i = 0; i < selectedExcels.value.length; i++) {
          await deleteOder(selectedExcels.value[i].id);
        }
        reload();
      }

      function addNewList() {
        openAdd(true);
      }
      function addSubmit() {
        closeAdd();
        reload();
      }

      const [registerTable, { reload }] = useTable({
        title: t('routes.processingList.processingTable'),
        beforeFetch: (data) => {
          const searchDto: IOrderNotificationSearchDto = {
            maxResultCount: data.pageSize,
            skipCount: data.pageIndex,
            sorting: data.sorting,
            key: data.key,
          };
          return searchDto;
        },
        rowKey: 'id',
        columns,
        api: getList,
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

      return {
        registerTable,
        rowClick,
        reload,
        registerModal,
        addNewList,
        downloadFile,
        deleteFile,
        addSubmit,
      };
    },
  });
</script>
