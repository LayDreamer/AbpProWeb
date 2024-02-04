<template>
  <!-- <div  class="flex h-4/5 min-h-160 enter-y"> -->
  <BasicTable
    @register="registerTable"
    @resizeColumn="handleResizeColumn"
    @selection-change="rowClick"
    :searchInfo="searchData"
  >
    <template #tableTitle>
      <div>{{ t('routes.productManagement.productRetrieval') }}</div>

      <input
        type="checkbox"
        @change="checkboxClick"
        v-model="checkedAll"
        style="width: 15px; height: 15px; margin: 5px"
      />
      {{ t('routes.productManagement.checkAll') }}
    </template>

    <template #toolbar>
      <a-button type="primary" @click="selectMaterial">{{
        t('routes.productManagement.selectMaterial')
      }}</a-button>

      <!-- <a-button
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Update')"
        type="default"
        @click="updateProjectClick"
        >更新项目</a-button
      > -->
      <!-- <ImpExcel
        @success="loadMaterialInventorySuccess"
        @change="loadState"
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Update')"
      >
        <a-button type="default">{{
          t('routes.productManagement.buttonUpdateInventory')
        }}</a-button>
      </ImpExcel> -->
      <a-button
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Create')"
        type="default"
        @click="importElements"
        >{{ t('routes.productManagement.buttonImport') }}</a-button
      >
      <a-button
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Create')"
        type="default"
        @click="exportElements"
        >{{ t('routes.productManagement.buttonExport') }}</a-button
      >
      <a-button
        type="primary"
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Delete')"
        danger
        @click="deleteMaterial"
        >{{ t('routes.productManagement.buttonDel') }}</a-button
      >
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction :actions="createActions(record)" />
      </template>
    </template>
  </BasicTable>
  <!-- </div> -->
  <!-- <div class="flex">
    <div class="w-2/10 w-full !mr-4 enter-y">
      <a-tabs>
        <a-tab-pane key="detail" tab="【库存数量】" />
      </a-tabs>
      <p>12</p>
    </div>
    <div class="lg:w-2/10 w-full !mr-4 enter-y">
      <a-tabs>
        <a-tab-pane key="detail" tab="【库存金额】" />
      </a-tabs>
      <p>20.25</p>
    </div>
    <div class="lg:w-3/10 w-full enter-y">
      <a-tabs>
        <a-tab-pane key="detail" tab="【项目信息】" />
      </a-tabs>
      <p>砂法发顺丰项目</p>
    </div>
  </div> -->
  <!-- <div>
    <div class="flex flex-row h-1/10 w-1/3 enter-y bg-gray-500">
      <a-tabs>
        <a-tab-pane key="detail" tab="详情及生产信息" />
      </a-tabs>
    </div>
    <div class="flex flex-row h-1/10 w-1/3 enter-y bg-gray-500">
      <a-tabs>
        <a-tab-pane key="detail" tab="详情及生产信息" />
      </a-tabs> </div
  ></div> -->
  <!-- <div class="flex flex-col"> -->
  <!-- <div class="flex h-3/4 enter-y"> </div>-->
  <productDesModal @register="registerDetailModal" />
  <Drawer
    @register="registerDrawer"
    ref="selectElements"
    @ok="getSelectedData(true)"
    @close="getSelectedData(false)"
  />
  <input type="file" ref="fileInput" style="display: none" @change="handleProjectFileChange" />
  <input type="file" ref="fileImport" style="display: none" @change="handleFileImportChange" />
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, toRaw } from 'vue';
  import {
    exportToExcel,
    getAllProductById,
    getProductById,
    parsingInventory,
    uploadImportRetrievalFile,
    uploadInventory,
    uploadProjectInfo,
  } from './Index';
  import productDesModal from './productDesModal.vue';
  import { getProductBasicColumns } from './tableData';
  import { Description } from '/@/components/Description';
  import { useDrawer } from '/@/components/Drawer';
  import { ExcelData, ImpExcel } from '/@/components/Excel';
  import { useLoading } from '/@/components/Loading';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import {
    ActionItem,
    BasicTable,
    EditRecordRow,
    FormSchema,
    TableAction,
    useTable,
  } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { IProductRetrievalSearchDto, SearchInfoDto } from '/@/services/ServiceProxies';
  import Drawer from '/@/views/productRetrieval/Drawer.vue';
  export default defineComponent({
    name: 'ProductRetrievalManagement',
    components: {
      PageWrapper,
      BasicTable,
      Drawer,
      Description,
      TableAction,
      productDesModal,
      ImpExcel,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;
      const { hasPermission } = usePermission();
      const selectElements = ref();
      const checkedAll = ref(false);
      const selectedProducts = ref();
      const searchData = reactive<Recordable>({});
      const fileInput = ref<HTMLElement | null>(null);

      const fileImport = ref<HTMLElement | null>(null);

      const [startLoading, endLoading] = useLoading({
        tip: '处理中...',
      });

      const searchFormSchema: FormSchema[] = [
        {
          field: 'searchValue',
          label: t('routes.familylibs.name'),
          component: 'Input',
          colProps: {
            span: 6,
          },
        },
        {
          field: 'searchCode',
          label: t('routes.familylibs.code'),
          component: 'Input',
          colProps: {
            span: 6,
          },
        },
      ];
      const [
        registerTable,
        { reload, getSelectRowKeys, deleteTableDataRecord, setSelectedRowKeys },
      ] = useTable({
        api: getProductById,
        beforeFetch: (data) => {
          const searchDto: IProductRetrievalSearchDto = {
            maxResultCount: data.pageSize,
            skipCount: data.pageIndex,
            sorting: data.sorting,
            searchInfo: data.searchInfo,
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
        // isCanResizeParent: true,
        columns: getProductBasicColumns(),
        formConfig: {
          labelWidth: 60,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        clickToRowSelect: false,
        useSearchForm: false,
        showTableSetting: true,
        showIndexColumn: true,
        striped: false,
        loading: true,
        rowSelection: {
          preserveSelectedRowKeys: true,
          type: 'checkbox',
        },
        actionColumn: {
          width: 100,
          title: t('routes.productlist.productActionColTitle'),
          dataIndex: 'action',
        },
        handleSearchInfoFn(info) {
          return info;
        },
      });

      const [registerDrawer, { openDrawer: openDrawer }] = useDrawer();
      const [registerDetailModal, { openModal: productInfo }] = useModal();

      const handleFileImportChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          var response = await uploadImportRetrievalFile({
            data: files[0],
            fileName: files[0].name,
          });
          if (!response.success) {
            error('导入失败:' + response.error);
          } else {
            searchData.searchInfo = response.data;
            reload();
          }
          input.value = '';
        }
      };

      const handleProjectFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          startLoading();
          await uploadProjectInfo({
            data: files[0],
            fileName: files[0].name,
          }).then((response) => {
            endLoading();
            if (response.success) {
              success('项目信息表更新成功！');
            } else {
              error('项目信息表更新失败！' + response.error);
            }
          });
          input.value = '';
        }
      };

      function updateProjectClick() {
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }

      function loadMaterialInventorySuccess(excelDataList: ExcelData[]) {
        let json = JSON.stringify(excelDataList[0].results);
        uploadInventory(json).then((response) => {
          if (response.success) {
            success('物料库存表更新成功！');
          } else {
            error(response.error + '更新失败！');
          }
          endLoading();
        });
      }

      function selectMaterial() {
        openDrawer();
        setSelectedRowKeys([] as any[]);
        selectedProducts.value = [] as any[];
        checkedAll.value = false;
      }
      async function checkboxClick(ev) {
        startLoading();
        var checkKeys = [] as any[];
        if (ev.target.checked) {
          var searchAllDto: any = {
            searchInfo: toRaw(searchData).searchInfo,
          };

          var result = await getAllProductById(searchAllDto);
          for (let i = 0; i < result.length; i++) {
            checkKeys.push(result[i].id);
          }
          selectedProducts.value = result;
          info('共选中' + checkKeys.length + '条数据');
        }
        setTimeout(function () {
          setSelectedRowKeys(checkKeys);
          endLoading();
        }, 1);
      }

      function deleteMaterial() {
        var result = getSelectRowKeys();
        for (let i = 0; i < result.length; i++) {
          deleteTableDataRecord(result[i]);
        }
        setSelectedRowKeys([] as any[]);
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }

      async function importElements() {
        let oBtn = fileImport.value as HTMLInputElement;
        oBtn.accept =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
        oBtn.click();
      }

      async function exportElements() {
        if (selectedProducts.value == undefined || selectedProducts.value.length == 0) {
          error('请选择需导出的产品');
          return;
        }
        startLoading();
        exportToExcel(selectedProducts.value).then(() => {
          endLoading();
        });
      }

      function rowClick({ keys, rows }) {
        if (checkedAll.value) {
          var result = selectedProducts.value.filter((x) => keys.indexOf(x.id) != -1);
          selectedProducts.value = result;
        } else {
          selectedProducts.value = rows;
        }
      }

      function getSelectedData(isConfirm) {
        if (isConfirm) {
          var data = selectElements.value.get().selectedRows._value;
          if (data != null && data.length > 0) {
            // var mapData = data.reduce((arr, m) => {
            //   arr[m.code] = m.tag;
            //   return arr;
            // }, {});
            const infoDtoArray: SearchInfoDto[] = [];
            var index = 0;
            for (let item of data) {
              var infoDto = new SearchInfoDto();
              infoDto.index = index;
              infoDto.code = item.code;
              infoDto.tag = item.tag;
              infoDtoArray.push(infoDto);
              index++;
            }

            searchData.searchInfo = infoDtoArray;
          }
        } else {
          searchData.searchInfo = undefined;
        }
        reload();
      }

      function productDetail(record: Recordable) {
        productInfo(true, {
          data: record,
          addEnable: true,
        });
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        // var lableColor: any = undefined;
        // var count = toRaw(record).materialCount;
        // if (count == undefined || count == '' || count == '0') {
        //   lableColor = 'error';
        // }
        return [
          {
            label: '详情',
            // color: lableColor,
            onClick: productDetail.bind(null, record),
          },
        ];
      }

      function loadState() {
        startLoading();
      }

      return {
        searchData,
        selectElements,
        fileInput,
        fileImport,
        checkedAll,
        t,
        registerTable,
        registerDrawer,
        registerDetailModal,
        rowClick,
        checkboxClick,
        updateProjectClick,
        deleteMaterial,
        selectMaterial,
        getSelectedData,
        exportElements,
        importElements,
        handleResizeColumn,
        hasPermission,
        createActions,
        handleFileImportChange,
        handleProjectFileChange,
        loadMaterialInventorySuccess,
        loadState,
      };
    },
  });
</script>

<style scoped></style>
