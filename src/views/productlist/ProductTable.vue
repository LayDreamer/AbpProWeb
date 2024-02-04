<template>
  <div class="m-4 mr-4 flex flex-col">
    <div class="flex-1 h-9/10">
      <BasicTable
        :searchInfo="searchInfo"
        @register="registerTable"
        @resizeColumn="handleResizeColumn"
        @row-click="menuDestory"
      >
        <template #toolbar>
          <a-input-search
            v-model:value="namevalue"
            :placeholder="t('routes.productlist.productName')"
            allow-clear
            style="width: 150px"
            @search="productSearchName"
          />
          <a-input-search
            v-model:value="codevalue"
            :placeholder="t('routes.productlist.productCode')"
            style="width: 120px"
            allow-clear
            @search="productSearchCode"
          />
          <!-- <div class="w-80 h-full"></div> -->
          <a-select
            style="width: 100px"
            v-model:value="publishSelect"
            :options="selectOptions"
            @change="selectChange"
          />
          <a-button
            type="primary"
            v-if="hasPermission('YaSha.DataManager.ProductList.Create')"
            @click="addProduct"
            >{{ t('routes.productlist.buttonAdd') }}</a-button
          >
          <a-button
            type="primary"
            v-if="hasPermission('YaSha.DataManager.ProductList.Create')"
            @click="copyProduct"
            >{{ t('routes.productlist.buttonCopy') }}</a-button
          >
          <a-button
            type="primary"
            v-if="hasPermission('YaSha.DataManager.ProductList.Delete')"
            @click="deleteProducts"
            >{{ t('routes.productlist.buttonDel') }}</a-button
          >
          <a-button
            type="primary"
            v-if="hasPermission('YaSha.DataManager.ProductList.Create')"
            @click="importExcel"
            >{{ t('routes.productlist.buttonImport') }}</a-button
          >
          <!-- <a-button type="primary" @click="exportProduct" :disabled="true">{{
            t('routes.productlist.buttonExport')
          }}</a-button> -->
          <a-dropdown v-if="hasPermission('YaSha.DataManager.ProductList.Update')">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="上市">上市</a-menu-item>
                <a-menu-item key="待上市">待上市</a-menu-item>
                <a-menu-item key="下市">下市</a-menu-item>
                <a-menu-item key="待下市">待下市</a-menu-item>
              </a-menu>
            </template>
            <a-button type="primary">{{ t('routes.productlist.productPublic') }}</a-button>
          </a-dropdown>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record)" />
          </template>
          <template v-else-if="column.key === 'creationTime'">{{
            new Date(record.creationTime).toLocaleString()
          }}</template>
          <template v-else-if="column.key === 'lastModificationTime'">{{
            record.lastModificationTime === undefined
              ? ''
              : new Date(record.lastModificationTime).toLocaleString()
          }}</template>
          <template v-else-if="column.key === 'image'">
            <TableImg :size="90" :simpleShow="true" :imgList="getImageList(record)" />
          </template>
        </template>
      </BasicTable>
    </div>
    <div class="bg-white mt-4" v-if="seriesVisible == true">
      <div class="flex flex-row h-full">
        <div
          class="w-1/15 border-solid border-1 border-gray-400 text-4xl font-bold flex justify-center items-center"
        >
          {{ t('routes.productlist.productDetailRemark') }}
        </div>
        <div class="flex-1">
          <a-textarea v-model:value="seriesRemark" class="custom-textarea" />
        </div>
        <div class="w-1/15" v-if="hasPermission('YaSha.DataManager.ProductList.Update')">
          <a-button type="primary" @click="addProductRemark" class="custom-button">{{
            t('routes.productlist.seriesRemarkSubmit')
          }}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import type { SelectProps } from 'ant-design-vue';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import { getProductBasicColumns } from './tableData';
  import {
    ActionItem,
    BasicTable,
    EditRecordRow,
    TableAction,
    TableImg,
    useTable,
  } from '/@/components/Table';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    IOrderNotificationSearchDto,
    ProductInventoryPublishStatus,
  } from '/@/services/ServiceProxies';
  import EventBus from '/@/utils/EventBus';
  import { getProductArchitetureByTreeAsync, updateSeriesRemark } from '/@/views/productlist/index';
  export default defineComponent({
    name: 'productTable',
    components: {
      BasicTable,
      TableAction,
      ADropdown: Dropdown,
      AMenu: Menu,
      AMenuItem: Menu.Item,
      TableImg,
    },
    setup(_, { emit }) {
      const { hasPermission } = usePermission();
      onBeforeMount(() => {
        EventBus.on('treeSelect', refreshTable);
      });
      onMounted(() => {});
      onBeforeUnmount(() => {
        EventBus.off('treeSelect', refreshTable);
      });

      const { t } = useI18n();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const searchInfo = reactive<Recordable>({});
      const namevalue = ref<string>('');
      const codevalue = ref<string>('');
      const seriesRemark = ref('');
      const seriesVisible = ref(false);
      const treeRef = ref();
      const publishSelect = ref('上市');
      const selectOptions = ref<SelectProps['options']>([
        { label: '上市', value: ProductInventoryPublishStatus.InMark },
        { label: '下市', value: ProductInventoryPublishStatus.OutMark },
        { label: '待上市', value: ProductInventoryPublishStatus.DelayInMark },
        { label: '待下市', value: ProductInventoryPublishStatus.DelayOutMark },
      ]);
      const [createContextMenu, destroyContextMenu] = useContextMenu();
      const upLoadImage = {
        title: t('routes.productlist.productImg'),
        dataIndex: 'image',
        width: 150,
        customCell: (_) => ({
          onContextmenu: (e) => {
            if (hasPermission('YaSha.DataManager.ProductList.Update')) {
              const menu = [
                {
                  label: '更新图片',
                  icon: 'material-symbols:upload-sharp',
                  handler: () => {
                    emit('uploadImage', _);
                  },
                },
              ];
              createContextMenu({
                event: e,
                items: menu,
              });
            }
          },
        }),
      };
      const tableColumn = () => {
        let array = getProductBasicColumns();
        array.splice(1, 0, upLoadImage);
        return array;
      };
      const [registerTable, { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys }] =
        useTable({
          title: t('routes.productlist.productlist'),
          rowKey: 'id',
          size: 'small',
          rowSelection: { type: 'checkbox' },
          clickToRowSelect: false,
          beforeFetch: (data) => {
            const searchDto: IOrderNotificationSearchDto = {
              maxResultCount: data.pageSize,
              skipCount: data.pageIndex,
              sorting: data.sorting,
              key: data.key,
              searchValue: data.searchValue,
              searchCode: data.searchCode,
              status: data.status,
            };
            return searchDto;
          },
          api: getProductArchitetureByTreeAsync,
          afterFetch: (data) => {
            localStorage.setItem('data', JSON.stringify(data));
          },
          columns: tableColumn(),
          showTableSetting: true,
          showIndexColumn: true,
          striped: false,
          loading: false,
          isCanResizeParent: true,
          actionColumn: {
            width: 100,
            title: t('routes.productlist.productActionColTitle'),
            dataIndex: 'action',
          },
        });
      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          {
            label: t('routes.productlist.productActionEdit'),
            onClick: editTable.bind(null, record),
          },
          {
            label: '详情',
            onClick: productDetail.bind(null, record),
          },
        ];
      }
      function productSearchName() {
        searchInfo.searchValue = namevalue.value;
        reload();
      }

      function productSearchCode() {
        searchInfo.searchCode = codevalue.value;
        reload();
      }
      function refreshTable(treeSelect) {
        treeRef.value = treeSelect;
        if (treeSelect) {
          searchInfo.key = treeSelect.node.id;
          if (treeSelect.node.children.length == 0) {
            seriesVisible.value = true;
            seriesRemark.value = treeSelect.node.remark;
          } else {
            seriesVisible.value = false;
            seriesRemark.value = '';
          }
        }
        reload();
      }
      function handleResizeColumn(w, col) {
        col.width = w;
      }
      function importExcel() {
        emit('import', '');
      }
      function editTable(record: Recordable) {
        emit('edit', record);
      }
      function productDetail(record: Recordable) {
        emit('detail', record);
      }
      function addProduct() {
        emit('add', '');
      }
      function copyProduct() {
        var selectIds = getSelectRowKeys();
        emit('copyProduct', selectIds);
      }
      function deleteProducts() {
        var selectRows = getSelectRows();
        emit('delete', selectRows);
      }
      function exportProduct() {
        emit('export', '');
      }

      function handleMenuClick(e) {
        var selectIds = getSelectRowKeys();
        let status;
        switch (e.key) {
          case '上市':
            status = ProductInventoryPublishStatus.InMark;
            break;
          case '待上市':
            status = ProductInventoryPublishStatus.DelayInMark;
            break;
          case '下市':
            status = ProductInventoryPublishStatus.OutMark;
            break;
          case '待下市':
            status = ProductInventoryPublishStatus.DelayOutMark;
            break;
        }
        let map = {};
        for (let item of selectIds) {
          map[item] = status;
        }
        emit('publish', {
          info: e.key,
          body: map,
        });
      }

      async function addProductRemark() {
        try {
          if (seriesRemark.value === null) {
            error('输入备注不能为空');
            return;
          }
          await updateSeriesRemark(searchInfo.key, seriesRemark.value);
          //treeRef.value.selectedNodes[0].remark = seriesRemark.value;
          EventBus.emit('refreshTree', '');
          success('提交成功');
        } catch (e) {
          error('提交失败' + e);
        }
      }

      function selectChange(value) {
        searchInfo.status = value;
        reload();
      }

      return {
        searchInfo,
        namevalue,
        codevalue,
        seriesRemark,
        seriesVisible,
        publishSelect,
        selectOptions,
        t,
        registerTable,
        createActions,
        clearSelectedRowKeys,
        reload,
        productSearchName,
        productSearchCode,
        handleResizeColumn,
        importExcel,
        addProduct,
        copyProduct,
        deleteProducts,
        exportProduct,
        addProductRemark,
        handleMenuClick,
        menuDestory: (_, e) => {
          destroyContextMenu({
            event: e,
          });
        },
        hasPermission,
        getImageList: (record) => {
          if (record.imagePath == null || record.imagePath == undefined) return [];
          if (!record.imagePath.includes('https://bds.chinayasha.com/bdsfileservice')) return [];
          return [record.imagePath];
        },
        selectChange,
      };
    },
  });
</script>
<style scoped>
  .custom-textarea {
    height: 100%;
    resize: none;
    font-weight: 500;
    font-size: medium;
  }
  .custom-button {
    height: 100%;
    width: 100%;
    font-size: 20px;
  }
</style>
