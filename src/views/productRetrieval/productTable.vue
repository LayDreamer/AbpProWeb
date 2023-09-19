<template>
  <BasicTable @register="registerTable" @resizeColumn="handleResizeColumn" :searchInfo="searchInfo">
    <template #toolbar>
      <a-button type="primary" @click="selectMaterial">{{
        t('routes.productManagement.selectMaterial')
      }}</a-button>
      <!-- <a-button type="primary" v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Delete')" danger @click="deleteMaterial">{{ t('routes.productManagement.buttonDel') }}</a-button> -->
      <a-button type="default" @click="importInventoryInfo">{{
        t('routes.productManagement.buttonUpdateProject')
      }}</a-button>

      <!-- <ImpExcel
        @success="loadProjectInfo"
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Update')"
      >
        <a-button type="default">{{ t('routes.productManagement.buttonUpdateProject') }}</a-button>
      </ImpExcel> -->
      <ImpExcel
        @success="loadDataSuccess"
        v-if="hasPermission('YaSha.DataManager.ProductRetrieval.Update')"
      >
        <a-button type="default">{{
          t('routes.productManagement.buttonUpdateInventory')
        }}</a-button>
      </ImpExcel>

      <a-button type="default" disabled @click="importElements">{{
        t('routes.productManagement.buttonImport')
      }}</a-button>
      <a-button type="default" disabled @click="exportElements">{{
        t('routes.productManagement.buttonExport')
      }}</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction :actions="createActions(record)" />
      </template>
    </template>
  </BasicTable>
  <!-- <productDes @register="registerDes"></productDes> -->
  <productDesModal @register="registerDetailModal" />
  <Drawer
    @register="registerDrawer"
    ref="selectElements"
    @ok="getSelectedData(true)"
    @close="getSelectedData(false)"
  />
  <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { IProductRetrievalSearchDto } from '/@/services/ServiceProxies';
  import { getProductById, uploadInventory, uploadProjectInfo } from './Index';
  import { getProductBasicColumns } from './tableData';
  import { useDrawer } from '/@/components/Drawer';
  import Drawer from './drawer.vue';
  import productDes from './productDes.vue';
  import productDesModal from './productDesModal.vue';
  import { Description, useDescription } from '/@/components/Description';
  import { useModal } from '/@/components/Modal';
  import { useLoading } from '/@/components/Loading';
  import { WorkBook, read, readFile, utils } from 'xlsx';
  import { ImpExcel, ExcelData } from '/@/components/Excel';
  import {
    BasicTable,
    BasicColumn,
    TableAction,
    ActionItem,
    EditRecordRow,
    FormSchema,
    useTable,
  } from '/@/components/Table';

  export default defineComponent({
    name: 'ProductRetrievalManagement',
    components: {
      PageWrapper,
      BasicTable,
      Drawer,
      Description,
      productDes,
      TableAction,
      productDesModal,
      ImpExcel,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;
      const { hasPermission } = usePermission();
      const selectElements = ref();

      const searchInfo = reactive<Recordable>({});
      const fileInput = ref<HTMLElement | null>(null);
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
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '导入中...',
      });
      // const tableListRef = ref<
      //   {
      //     title: string;
      //     columns?: any[];
      //     dataSource?: any[];
      //   }[]
      // >([]);

      const [
        registerTable,
        {
          reload,
          getSelectRowKeys,
          clearSelectedRowKeys,
          deleteSelectRowByKey,
          deleteTableDataRecord,
        },
      ] = useTable({
        title: t('routes.productManagement.productRetrieval'),
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
        // rowKey: 'id',
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
          type: 'checkbox',
        },
        actionColumn: {
          width: 100,
          title: t('routes.productlist.productActionColTitle'),
          dataIndex: 'action',
        },
        handleSearchInfoFn(info) {
          // console.log('handleSearchInfoFn', info);
          return info;
        },
        // actionColumn: {
        //   width: 100,
        //   title: t('routes.familylibs.detail'),
        //   dataIndex: 'action',
        // },
      });

      const [registerDes] = useDescription({});
      const [registerDrawer, { openDrawer: openDrawer }] = useDrawer();
      const [registerDetailModal, { openModal: productInfo }] = useModal();

      function loadProjectInfo(excelDataList: ExcelData[]) {
        try {
          let json = JSON.stringify(excelDataList[0].results);
          uploadProjectInfo(json);
          if (excelDataList[0].header.length == 0) {
            error('更新失败：数据解析错误！');
            return;
          } else if (excelDataList[0].results.length > 30000) {
            error('更新失败：数据超过3w行！');
            return;
          }
          success('项目信息表更新成功！');
        } catch (e) {
          error(e + '更新失败！');
        }
      }

      function loadDataSuccess(excelDataList: ExcelData[]) {
        try {
          let json = JSON.stringify(excelDataList[0].results);
          uploadInventory(json);
          success('物料库存表更新成功！');
        } catch (e) {
          error(e + '更新失败！');
        }
      }

      function handleSelect(key = '') {
        if (key) {
          searchInfo.key = key;
        }
        reload();
      }
      function selectMaterial() {
        openDrawer();
        // openDrawer(true, {
        //   data: '墙面系统',
        //   info: '科睿墙面系列·科耐',
        // });
      }

      // function deleteMaterial() {
      //   deleteTableDataRecord(getSelectRowKeys());
      // }

      function handleResizeColumn(w, col) {
        col.width = w;
      }

      function importInventoryInfo() {
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }

      function importElements() {
        // clearSelectedRowKeys();
        info(t('routes.productManagement.notYetDevelopedInfo'));
      }

      function exportElements() {
        info(t('routes.productManagement.notYetDevelopedInfo'));
      }

      function getSelectedData(isConfirm) {
        if (isConfirm) {
          var data = selectElements.value.get().selectedRows._value;
          if (data != null && data.length > 0) {
            var mapData = data.reduce((arr, m) => {
              arr[m.code] = m.tag;
              return arr;
            }, {});
            searchInfo.searchInfo = mapData;
          }
        } else {
          searchInfo.searchInfo = undefined;
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
        return [
          {
            label: '详情',
            onClick: productDetail.bind(null, record),
          },
        ];
      }

      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          if (
            files[0].name.includes('.xlsx') ||
            files[0].name.includes('.xls') ||
            files[0].name.includes('.xlsm')
          ) {
            readLargeExcel(files[0]);
          }
          input.value = '';
        }
      };

      function readExcel(file: File) {
        openFullLoading();
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1, raw: true });

            // var sheet = new ProductSheet();
            // sheet.init(jsonData);
            // await sheet.import();
            closeFullLoading();
            success('导入成功');
          } catch (e) {
            closeFullLoading();
            error('导入失败' + e);
          }
        };
        reader.readAsArrayBuffer(file);
      }

      function readLargeExcel(file: File): Promise<any[]> {
        const CHUNK_SIZE = 10000; // 每次读取的行数

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook: WorkBook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
            let result: any[] = [];
            let startRow = 0;
            let endRow = CHUNK_SIZE;

            while (startRow < jsonData.length) {
              const chunkData = jsonData.slice(startRow, endRow);
              result = result.concat(chunkData);

              startRow += CHUNK_SIZE;
              endRow += CHUNK_SIZE;
            }

            resolve(result);
          };

          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsArrayBuffer(file);
        });
      }

      return {
        t,
        registerTable,
        searchInfo,
        selectElements,
        handleSelect,
        selectMaterial,
        registerDrawer,
        registerDes,
        getSelectedData,
        reload,
        exportElements,
        importInventoryInfo,
        importElements,
        handleResizeColumn,
        hasPermission,
        createActions,
        registerDetailModal,
        handleFileChange,
        fileInput,
        loadDataSuccess,
        loadProjectInfo,
      };
    },
  });
</script>
