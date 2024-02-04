<template>
  <BasicModal
    v-bind="$attrs"
    :title="data.title"
    :canFullscreen="false"
    :maskClosable="false"
    destroyOnClose
    @register="registerModal"
    @ok="ok"
  >
    <div class="p-4">
      <div class="h-80">
        <BasicTable @register="registerTable"> </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue';
  import { getFileListAsync } from './index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  export default defineComponent({
    components: {
      BasicModal,
      BasicTable,
    },
    setup(_, { emit }) {
      const columns = [
        {
          title: '文件名',
          dataIndex: 'fileName',
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: {
                  textAlign: 'left !important',
                },
              },
              text,
            );
          },
        },
      ];
      const data = ref({
        title: '',
        type: 1,
        ids: [],
        parentId: '',
      });
      const [registerModal, { closeModal }] = useModalInner((response) => {
        data.value = response;
        console.log(data.value.ids);
        setSelectedRowKeys(data.value.ids);
      });

      const [registerTable, { getSelectRows, setSelectedRowKeys }] = useTable({
        rowKey: 'id',
        size: 'small',
        rowSelection: { type: 'checkbox' },
        columns: columns,
        beforeFetch: () => {
          return {
            id: data.value.parentId,
            status: data.value.type,
          };
        },
        api: getFileListAsync,
        striped: false,
        pagination: false,
        canResize: true,
        isCanResizeParent: true,
      });

      async function ok() {
        var select = getSelectRows();
        emit('selectSave', { type: data.value.type, data: select });
        closeModal();
      }
      return {
        data,
        registerModal,
        registerTable,
        ok,
      };
    },
  });
</script>
<style></style>
