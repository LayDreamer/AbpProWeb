<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="材料名称/编码选择"
    width="80%"
    showFooter
    footer-height="50"
    :closable="false"
    :mask-closable="false"
    :destroyOnClose="true"
    @ok="Confirm"
    @close="Cancel"
  >
    <div class="flex h-147">
      <BasicTable
        @register="registerTable"
        @selection-change="rowClick"
        @resizeColumn="handleResizeColumn"
        :searchInfo="searchInfo"
        class="w-5/9"
        style="border-radius: 1%; border-width: 1px; margin-right: 10px"
      >
        <template #toolbar>
          <div>
            <SystemSelect ref="selectState" />
          </div>
        </template>
      </BasicTable>
      <BasicTable
        @register="registerResTable"
        @resizeColumn="handleResizeColumn"
        :searchInfo="searchInfo"
        class="w-4/9"
        style="border-radius: 1%; border-width: 1px"
      />
    </div>
  </BasicDrawer>
  <!-- <template #insertFooter>
      <a-button @click="Cancel"> btn</a-button>
    </template> -->
  <!-- <div class="flex justify-end">
      <a-button type="primary" style="margin-left: 1%" @click="Confirm">{{ t('确认') }}</a-button>
      <a-button type="default" style="margin-left: 1%" @click="Cancel">{{ t('取消') }}</a-button>
    </div> -->
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, computed, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import {
    BasicColumn,
    BasicTable,
    useTable,
    FormSchema,
    ColumnChangeParam,
  } from '/@/components/Table';
  import { IProductIndexSearchDto } from '/@/services/ServiceProxies';
  import { useMessage } from '/@/hooks/web/useMessage';
  import SystemSelect from './systemSelect.vue';
  import { getProductIndex } from './Index';
  import { cloneDeep } from 'lodash-es';
  export default defineComponent({
    components: { BasicDrawer, BasicTable, BasicForm, SystemSelect },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const selectState = ref();
      const columns: BasicColumn[] = [
        {
          title: t('routes.productManagement.selectMaterialName'),
          dataIndex: 'name',
          sorter: true,
          resizable: true,
          width: 300,
          minWidth: 300,
          maxWidth: 450,
        },
        {
          title: t('routes.productManagement.selectMaterialCode'),
          dataIndex: 'code',
          width: 150,
          minWidth: 150,
          maxWidth: 200,
          resizable: true,
        },
      ];
      const searchFormSchema: FormSchema[] = [
        {
          field: 'searchValue',
          label: t('routes.productManagement.searchMaterialName'),
          component: 'Input',
          colProps: {
            span: 8,
          },
        },
        {
          field: 'searchCode',
          label: t('routes.productManagement.searchMaterialCode'),
          component: 'Input',
          colProps: {
            span: 8,
          },
        },
      ];
      const selectedRows = ref();
      function onChange() {
        // console.log('onChange', arguments);
      }

      const searchInfo = reactive<Recordable>({});
      const [
        registerTable,
        {
          getSelectRows,
          reload,
          clearSelectedRowKeys,
          deleteSelectRowByKey,
          getPaginationRef,
          getForm,
        },
      ] = useTable({
        title: t('routes.productManagement.selectList'),
        isCanResizeParent: true,
        api: getProductIndex,
        beforeFetch: (data) => {
          var state = selectState.value.get().state;
          var selectSystem = state.selectSystem;
          var selectSeries = state.selectSeries;
          const searchDto: IProductIndexSearchDto = {
            maxResultCount: data.pageSize,
            skipCount: data.pageIndex,
            sorting: data.sorting,
            key: '',
            searchValue: data.searchValue,
            searchCode: data.searchCode,
            system: selectSystem,
            series: selectSeries,
          };
          return searchDto;
        },
        afterFetch: (data) => {
          if (Array.isArray(data)) {
            for (let item of data) {
              item.children = null;
            }
          }
        },
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 40,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
          resetFunc: customResetFunc, // 单独定义重置方法 须情况插槽表单内容
        },
        useSearchForm: true,
        showTableSetting: false,
        showIndexColumn: true,
        striped: false,
        loading: true,
        canResize: true,
        rowSelection: {
          type: 'checkbox',
        },
        onChange,
        onColumnsChange: (data: ColumnChangeParam[]) => {
          // console.log('ColumnsChanged', data);
        },

        handleSearchInfoFn(info) {
          return info;
        },
      });

      const [registerResTable] = useTable({
        title: t('routes.productManagement.selectedData'),
        rowKey: 'id',
        canResize: true,
        isCanResizeParent: true,
        columns,
        dataSource: selectedRows,
        useSearchForm: false,
        showTableSetting: false,
        showIndexColumn: true,
        striped: false,
        loading: false,
        handleSearchInfoFn(info) {
          return info;
        },
      });

      const [register, { closeDrawer }] = useDrawerInner((data) => {
        // title: t('routes.productManagement.selectMaterial')
        // 方式1
        // setFieldsValue({
        //   field2: data.data,
        //   field1: data.info,
        // });
        // clearSelectedRowKeys();
      });

      // 重置方法
      async function customResetFunc() {
        var state = selectState.value.get().state;
        state.selectSystem = undefined;
        state.selectSeries = undefined;
        clearSelectedRowKeys();
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }
      function rowClick({ keys, rows }) {
        // selectedRows.value = cloneDeep(rows)
        selectedRows.value = rows;
      }

      function Confirm() {
        closeDrawer();
      }

      function Cancel() {
        clearSelectedRowKeys();
        selectedRows.value = [];
      }

      return {
        searchInfo,
        rowClick,
        register,
        handleResizeColumn,
        t,
        registerTable,
        registerResTable,
        closeDrawer,
        selectState,
        onChange,
        Confirm,
        Cancel,
        // get,
        get: () => {
          return { selectedRows };
        },
      };
    },
  });
</script>
