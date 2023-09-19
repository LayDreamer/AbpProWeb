<template>
  <div>
    <BasicTable
      :searchInfo="searchInfo"
      @register="registerTable"
      @resizeColumn="handleResizeColumn"
    >
      <template #tableTitle>
        <a-tooltip title="返回">
          <a-button class="custom-back" type="link" preIcon="ep:back" @click="back" />
        </a-tooltip>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import {
    defineComponent,
    reactive,
    ref,
    h,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
  } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getTreeAllDetails } from '/@/views/standardPolicy/index';
  import { PageWrapper } from '/@/components/Page';
  import EventBus from '/@/utils/EventBus';
  export default defineComponent({
    name: 'productTable',
    props: {
      id: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    components: {
      BasicTable,
      PageWrapper,
    },
    setup(_, { emit }) {
      onBeforeMount(() => {
        EventBus.on('search', search);
      });
      onMounted(() => {});
      onBeforeUnmount(() => {
        EventBus.off('search', search);
      });
      const { t } = useI18n();
      const searchInfo = reactive<Recordable>({});
      searchInfo.code = _.code;
      searchInfo.name = _.name;
      searchInfo.unit = _.name;
      searchInfo.skipCount = 1;
      searchInfo.maxResultCount = 10;

      const tableColumn: BasicColumn[] = [
        {
          title: '标准编号',
          dataIndex: ['lib', 'number'],
          width: 200,
        },
        {
          title: '标准名称',
          dataIndex: ['lib', 'name'],
          width: 300,
        },
        {
          title: '主题',
          customRender: ({ record }) => {
            let group: any[] = [];
            for (let item of record.themes) {
              group.push(h(Tag, { color: 'blue' }, () => item));
            }
            return h(
              'div',
              {
                class: 'flex flex-row justify-center space-x-2',
              },
              group,
            );
          },
          width: 400,
          minWidth: 400,
          maxWidth: 600,
          resizable: true,
        },
        {
          title: '发布单位',
          dataIndex: ['lib', 'publishingUnit'],
        },
        {
          title: '实施日期',
          dataIndex: ['lib', 'implementationDate'],
          width: 200,
        },
      ];

      const [registerTable, { reload }] = useTable({
        rowKey: 'id',
        columns: tableColumn,
        rowSelection: { type: 'checkbox' },
        beforeFetch: (data) => {
          return {
            id: _.id,
            name: data.name,
            number: data.code,
            unit: data.unit,
            themes: data.select,
            skipCount: data.pageIndex,
            maxResultCount: data.pageSize,
            sorting: data.sorting,
          };
        },
        afterFetch: (data) => {
          let result: any[] = [];
          for (let item of data) {
            for (let v of item.data) {
              if (v.lib.implementationDate !== undefined)
                v.lib.implementationDate = new Date(v.lib.implementationDate).toLocaleString();
              if (v.lib.publishingDate !== undefined)
                v.lib.publishingDate = new Date(v.lib.publishingDate).toLocaleString();
              result.push(v);
            }
          }
          return result;
        },
        api: getTreeAllDetails,
        clickToRowSelect: false,
        showTableSetting: false,
        showIndexColumn: true,
        striped: false,
        loading: false,
      });

      function search(data) {
        searchInfo.name = data.name ? data.name : '';
        searchInfo.unit = data.unit ? data.unit : '';
        searchInfo.code = data.code ? data.code : '';
        searchInfo.select = data.select ? data.select : [];
        reload();
      }

      return {
        searchInfo,
        t,
        registerTable,
        reload,
        back: () => {
          emit('backHome', '');
        },
        handleResizeColumn(w, col) {
          col.width = w;
        },
      };
    },
  });
</script>
<style scoped>
  .custom-back :deep() .app-iconify {
    font-size: 27px !important;
    display: block !important;
    line-height: 0;
  }
</style>
