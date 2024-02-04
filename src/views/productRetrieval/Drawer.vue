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
    <div ref="wrapEle" class="flex h-152">
      <BasicTable
        @register="registerTable"
        @selection-change="rowClick"
        @resizeColumn="handleResizeColumn"
        :searchInfo="searchInfo"
        class="w-5/9"
        style="border-radius: 1%; border-width: 1px; margin-right: 10px"
      >
        <template #tableTitle>
          <div>{{ t('routes.productManagement.selectList') }}</div>
          <input
            type="checkbox"
            @click="checkAllClick"
            v-model="checkedAll"
            style="width: 15px; height: 15px; margin: 5px"
          />
          {{ t('routes.productManagement.checkAll') }}
        </template>
        <template #toolbar>
          <div>
            <SystemSelect ref="selectState" />
          </div>
        </template>
      </BasicTable>
      <BasicTable
        @register="registerResTable"
        @resizeColumn="handleResizeColumn"
        @row-click="rightRowClick"
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
  import { BasicForm } from '/@/components/Form/index';
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
  import { getProductIndex, getAllProducts } from './Index';
  import { useLoading } from '/@/components/Loading';
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
      const wrapEle = ref<ElRef>(null);
      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEle,
        props: {
          tip: '加载中...',
          absolute: true,
        },
      });

      const searchValue = ref();
      const searchCode = ref();
      const sorting = ref();
      const checkedAll = ref(false);

      const searchInfo = reactive<Recordable>({});
      const [registerTable, { clearSelectedRowKeys, deleteSelectRowByKey, setSelectedRowKeys }] =
        useTable({
          isCanResizeParent: true,
          api: getProductIndex,
          beforeFetch: (data) => {
            var state = selectState.value.get().state;
            var selectSystem = state.selectSystem;
            var selectSeries = state.selectSeries;
            var selectLevel = state.selectLevel;
            const searchDto: IProductIndexSearchDto = {
              maxResultCount: data.pageSize,
              skipCount: data.pageIndex,
              sorting: data.sorting,
              key: '',
              searchValue: data.searchValue,
              searchCode: data.searchCode,
              system: selectSystem,
              series: selectSeries,
              level: selectLevel,
            };
            sorting.value = data.sorting;
            searchValue.value = data.searchValue;
            searchCode.value = data.searchCode;
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
            preserveSelectedRowKeys: true,
          },
          onChange,
          onColumnsChange: (data: ColumnChangeParam[]) => {
            // console.log('ColumnsChanged', data);
          },

          handleSearchInfoFn(info) {
            return info;
          },
        });

      const [registerResTable, { deleteTableDataRecord }] = useTable({
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
        state.selectLevel = undefined;
        checkedAll.value = false;
        clearSelectedRowKeys();
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }
      function rowClick({ keys, rows }) {
        // selectedRows.value = cloneDeep(rows)
        if (checkedAll.value) {
          var result = selectedRows.value.filter((x) => keys.indexOf(x.id) != -1);
          selectedRows.value = result;
        } else {
          selectedRows.value = rows;
        }
      }

      async function checkAllClick(ev) {
        openWrapLoading();
        var result = [] as any[];
        if (ev.target.checked) {
          var state = selectState.value.get().state;
          var selectSystem = state.selectSystem;
          var selectSeries = state.selectSeries;
          var selectLevel = state.selectLevel;
          const searchDto: IProductIndexSearchDto = {
            key: '',
            sorting: sorting.value == undefined ? '' : sorting.value,
            searchValue: searchValue.value == undefined ? '' : searchValue.value,
            searchCode: searchCode.value == undefined ? '' : searchCode.value,
            system: selectSystem,
            series: selectSeries,
            level: selectLevel,
          };
          result = await getAllProducts(searchDto);
        }
        setTimeout(function () {
          var checkKeys = [] as any[];

          for (let i = 0; i < result.length; i++) {
            checkKeys.push(result[i].id);
          }
          setSelectedRowKeys(checkKeys);
          selectedRows.value = result;

          closeWrapLoading();
        }, 1);
      }

      function rightRowClick(record, index, event) {
        deleteSelectRowByKey(record.id);
        deleteTableDataRecord(record.id);
      }

      function Confirm() {
        closeDrawer();
      }

      function Cancel() {
        clearSelectedRowKeys();
        selectedRows.value = [];
        checkedAll.value = false;
      }

      return {
        searchInfo,
        rowClick,
        rightRowClick,
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
        checkAllClick,
        checkedAll,
        // get,
        get: () => {
          return { selectedRows };
        },
        wrapEle,
      };
    },
  });
</script>
