<template>
  <div class="p-4">
    <BasicTable class="w-full" @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-input-search
          placeholder="名称"
          allow-clear
          style="width: 500px"
          @search="listProcessingSearch"
        />
        <a-button style="padding-left: 5px" type="primary" preIcon="ic:outline-add" @click="addNew">
          新增清单
        </a-button>
        <a-button
          style="padding-left: 5px"
          type="primary"
          preIcon="ic:round-download"
          @click="downloadSheets"
        >
          下载
        </a-button>
        <a-button
          style="padding-left: 5px"
          type="primary"
          danger
          preIcon="ic:outline-delete"
          @click="deleteSheets"
        >
          删除
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'creationTime'">
          {{ new Date(record.creationTime).toLocaleString() }}
        </template>
      </template>
    </BasicTable>
    <AddModal @register="registerModal" @submit="addSubmit"></AddModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, createVNode } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { Modal } from 'ant-design-vue';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { PageListProcessingLists, DeleteSheets } from './index';
  import AddModal from './AddSheet.vue';
  export default defineComponent({
    name: 'listProcessing',
    components: {
      BasicTable,
      AddModal,
    },
    setup() {
      const { createMessage: msg } = useMessage();
      const [registerModal, { openModal: openAdd, closeModal: closeAdd }] = useModal();
      const { error, success } = msg;
      const columns: BasicColumn[] = [
        {
          title: '名称',
          dataIndex: 'name',
          sorter: true,
        },
        {
          title: '最近修改时间',
          dataIndex: 'lastModificationTime',
          width: 200,
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          width: 200,
        },
      ];
      const searchInfo = reactive<Recordable>({});

      const [registerTable, { reload, getSelectRows, clearSelectedRowKeys }] = useTable({
        rowKey: 'id',
        title: '制造拆单',
        columns,
        rowSelection: { type: 'checkbox' },
        showTableSetting: true,
        showIndexColumn: true,
        striped: false,
        loading: true,
        beforeFetch: (data) => {
          return {
            maxResultCount: data.pageSize,
            skipCount: data.pageIndex,
            sorting: data.sorting,
            search: data.search,
          };
        },
        api: PageListProcessingLists,
      });

      function listProcessingSearch(name) {
        searchInfo.search = name;
        reload();
      }

      function addNew() {
        openAdd(true, {});
      }

      function addSubmit(success) {
        if (success) {
          reload();
        }
        closeAdd();
      }

      function deleteSheets() {
        var value = getSelectRows();
        if (value.length == 0) {
          error('请选择要删除表单');
          return;
        }
        Modal.confirm({
          title: () => '你想要删除这些表单吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            var keys = value.map((x) => x.id);
            await DeleteSheets(keys);
            reload();
          },
          onCancel() {
            clearSelectedRowKeys();
          },
        });
      }

      function downloadSheets() {
        var value = getSelectRows();
        if (value.length == 0) {
          error('请选择要下载文件');
          return;
        }
        const triggerDelay = 100;
        const removeDelay = 1000;
        value.forEach((item, index) => {
          if (item.filePath) {
            let url = encodeURI(item.filePath).replace(/\#/g, '%23');
            createIFrame(url, index * triggerDelay, removeDelay);
          }
        });
        clearSelectedRowKeys();

        function createIFrame(url, triggerDelay, removeDelay) {
          setTimeout(function () {
            const frame = document.createElement('iframe');
            frame.setAttribute('style', 'display: none');
            frame.setAttribute('src', url);
            frame.setAttribute('id', 'iframeName');
            document.body.appendChild(frame);
            setTimeout(function () {
              const node = document.getElementById('iframeName');
              if (node && node.parentNode) {
                node.parentNode.removeChild(node);
              }
            }, removeDelay);
          }, triggerDelay);
        }
      }

      return {
        searchInfo,
        registerTable,
        listProcessingSearch,
        addNew,
        registerModal,
        addSubmit,
        deleteSheets,
        downloadSheets,
      };
    },
  });
</script>

<style scoped></style>
