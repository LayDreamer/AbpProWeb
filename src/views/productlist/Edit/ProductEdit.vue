<template>
  <BasicModal
    v-bind="$attrs"
    :title="modalTitle"
    width="40%"
    :height="750"
    wrapClassName="custom-modal"
    loadingTip="加载中"
    :loading="loading"
    :canFullscreen="false"
    :draggable="false"
    :maskClosable="false"
    destroyOnClose
    @register="registerModal"
    @cancel="close"
  >
    <template #footer> </template>
    <div class="h-full flex flex-col">
      <div class="h-80">
        <BasicTable
          @register="registerTable"
          @resizeColumn="handleResizeColumn"
          @row-click="tableRowClick"
          @row-contextmenu="menuClick"
        >
          <template #headerCell="{ title, column }">
            <template v-if="column.key[1] === 'name'">
              <div class="flex flex-row justify-between">
                <p style="height: 5px; line-height: 30px">{{ column.customTitle }}</p>
                <a-button
                  type="primary"
                  :disabled="addDisabled"
                  style="width: 80px"
                  @click="addNewProduct"
                  >{{ t('routes.productlist.buttonAdd') }}</a-button
                >
              </div>
            </template>
            <template v-if="column.key[1] === 'code'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.key[1] === 'length'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.key[1] === 'width'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.key[1] === 'height'">
              {{ column.customTitle }}
            </template>
          </template>
        </BasicTable>
      </div>
      <div class="flex bg-gray-300 h-px mt-5"></div>
      <div class="flex-1 overflow-x-auto bg-gray-200">
        <div class="flex p-4 flex-col">
          <div class="flex flex-row justify-between w-full">
            <p class="text-2xl font-bold">{{ titleInfo }}</p>
            <a-button :loading="saveLoading" type="primary" @click="saveClick">{{
              t('routes.productlist.productEditSave')
            }}</a-button>
          </div>
          <div class="flex-1">
            <template v-if="tableSelectData?.tag == ProductInventroyTag.Product">
              <EditProduct :initData="tableSelectData" />
            </template>
            <template v-if="tableSelectData?.tag == ProductInventroyTag.Modules">
              <EditModules :initData="tableSelectData" />
            </template>
            <template v-if="tableSelectData?.tag == ProductInventroyTag.Material">
              <EditMaterials :initData="tableSelectData" :totalData="getTableAllRows()" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { cloneDeep } from 'lodash-es';
  import { v4 as guid } from 'uuid';
  import { computed, defineComponent, nextTick, onBeforeMount, onMounted, ref } from 'vue';
  import { addProducts, getProductEdit, updateProductArchiteture } from '../index';
  import { getEditProductColumns } from '../tableData';
  import EditMaterials from './ProductEditMaterial.vue';
  import EditModules from './ProductEditModule.vue';
  import EditProduct from './ProductEditProduct.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    ProductInventoryEditDto,
    ProductInventoryFullDto,
    ProductInventoryModifyStatus,
    ProductInventroyTag,
  } from '/@/services/ServiceProxies';
  export default defineComponent({
    components: {
      BasicTable,
      BasicModal,
      EditProduct,
      EditModules,
      EditMaterials,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const loading = ref(true);
      const saveLoading = ref(false);
      const addDisabled = ref(false);
      const modalTitle = ref('');
      const titleInfo = computed(() => {
        if (tableSelectData) {
          switch (tableSelectData.value?.tag) {
            case ProductInventroyTag.Product:
              return t('routes.productlist.productEditProduct');
            case ProductInventroyTag.Modules:
              return t('routes.productlist.productEditModule');
            case ProductInventroyTag.Material:
              return t('routes.productlist.productEditMateril');
            case ProductInventroyTag.Undefined:
              return '';
          }
        }
      });
      const tableData = ref<ProductInventoryFullDto[]>([]);
      const tableSelectData = ref();
      const deleteLists = ref<ProductInventoryFullDto[]>([]);
      const { createMessage: msg } = useMessage();
      const [createContextMenu, destroyContextMenu] = useContextMenu();
      const { error, success } = msg;
      const init = () => {
        loading.value = true;
        saveLoading.value = false;
        addDisabled.value = false;
        modalTitle.value = '';
        tableData.value = [];
        deleteLists.value = [];
        tableSelectData.value = undefined;
      };
      const [registerModal] = useModalInner(async (data) => {
        init();
        if (data.addEnable) {
          addDisabled.value = data.addEnable;
        }
        if (data.title) {
          modalTitle.value = data.title;
        }
        if (data.id) {
          const response = await getProductEdit(data.id);
          if (response.length == 0) return;
          tableData.value = response;
          tableSelectData.value = response[0];
          nextTick(expandAll);
        }
        loading.value = false;
      });
      const [registerTable, { expandAll, expandRows }] = useTable({
        rowKey: 'id',
        size: 'small',
        dataSource: computed(() => {
          return getShowData();
        }),
        columns: getEditProductColumns(),
        striped: false,
        loading: false,
        pagination: false,
        canResize: true,
        isCanResizeParent: true,
        showIndexColumn: false,
        isTreeTable: true,
      });

      onBeforeMount(() => {});
      onMounted(() => {});

      function getTableAllRows() {
        let results = [];
        getAllTableDatas(tableData.value, results);
        return results;
      }

      function getAllTableDatas(tree, result) {
        if (!Array.isArray(tree)) return [];
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          result.push(node);
          if (Array.isArray(node.children)) {
            getAllTableDatas(node.children, result);
          }
        }
        return result;
      }

      function getShowData() {
        let result: ProductInventoryFullDto[] = [];
        tableData.value = tableData.value.filter(
          (x) => x.status !== ProductInventoryModifyStatus.Delete,
        );
        for (let item of tableData.value) {
          if (item.children) {
            item.children = item.children.filter(
              (x) => x.status !== ProductInventoryModifyStatus.Delete,
            );
            for (let data of item.children) {
              if (data.children) {
                data.children = data.children.filter(
                  (x) => x.status !== ProductInventoryModifyStatus.Delete,
                );
              }
            }
          }
          result.push(item);
        }
        return result;
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }

      function tableRowClick(record: Recordable, index, e) {
        tableSelectData.value = record;
        destroyMenu(e);
      }

      function destroyMenu(e: MouseEvent) {
        destroyContextMenu({
          event: e,
        });
      }

      function menuClick(record, index, event) {
        const menu0 = [
          {
            label: '模块',
            icon: 'icon-park:add',
            handler: () => {
              addModule(record);
            },
          },
          {
            label: '物料',
            icon: 'icon-park:add',
            handler: () => {
              addMaterial(record);
            },
          },
        ];
        const menu1 = [
          {
            label: '模块',
            icon: 'icon-park:add',
            handler: () => {
              addModule(record);
            },
          },
          {
            label: '物料',
            icon: 'icon-park:add',
            handler: () => {
              addMaterial(record);
            },
          },
          {
            label: '复制',
            icon: 'icon-park:copy',
            handler: () => {
              copyProduct(record);
            },
          },
          {
            label: '删除',
            icon: 'icon-park:delete-five',
            handler: () => {
              deleteProduct(record);
            },
          },
        ];
        const menu2 = [
          {
            label: '物料',
            icon: 'icon-park:add',
            handler: () => {
              addMaterial(record);
            },
          },
          {
            label: '复制',
            icon: 'icon-park:copy',
            handler: () => {
              copyModule(record);
            },
          },
          {
            label: '删除',
            icon: 'icon-park:delete-five',
            handler: () => {
              deleteModule(record);
            },
          },
        ];

        const menu3 = [
          {
            label: '复制',
            icon: 'icon-park:copy',
            handler: () => {
              copyMaterial(record);
            },
          },
          {
            label: '删除',
            icon: 'icon-park:delete-five',
            handler: () => {
              deleteMateial(record);
            },
          },
        ];
        createContextMenu({
          event: event,
          items:
            record.tag === ProductInventroyTag.Product
              ? addDisabled.value
                ? menu0
                : menu1
              : record.tag === ProductInventroyTag.Modules
              ? menu2
              : menu3,
        });
      }

      async function saveClick() {
        saveLoading.value = true;
        let saveSuccess = true;
        try {
          if (addDisabled.value) {
            await updateProductArchiteture(deleteLists.value, tableData.value[0]);
          } else {
            await addProducts(tableData.value);
          }
          success('保存成功');
        } catch (e) {
          saveLoading.value = false;
          error('保存失败' + e);
          saveSuccess = false;
        }
        saveLoading.value = false;
        emit('saveChanges', saveSuccess);
      }

      function addNewProduct() {
        const produt = new ProductInventoryEditDto();
        produt.name = '(空白产品)';
        produt.id = guid();
        const create = new ProductInventoryFullDto({
          parentId: undefined,
          id: produt.id,
          parentTag: ProductInventroyTag.Undefined,
          tag: ProductInventroyTag.Product,
          children: undefined,
          status: ProductInventoryModifyStatus.Insert,
          data: produt,
        });
        tableData.value.push(create);
        tableSelectData.value = create;
        scrollToInsertRow(produt.id);
      }

      function addModule(data) {
        var module = new ProductInventoryEditDto();
        module.name = '(空白模块)';
        module.id = guid();
        const create = new ProductInventoryFullDto({
          parentId: data.data.id,
          id: module.id,
          parentTag: data.tag,
          tag: ProductInventroyTag.Modules,
          children: undefined,
          status: ProductInventoryModifyStatus.Insert,
          data: module,
        });
        if (data.children === undefined) {
          data.children = [];
        }
        data.children.push(create);
        tableSelectData.value = create;
        expandRows([data.data.id]);
        scrollToInsertRow(module.id);
      }

      function addMaterial(data) {
        var material = new ProductInventoryEditDto();
        material.name = '(空白物料)';
        material.id = guid();
        const create = new ProductInventoryFullDto({
          parentId: data.data.id,
          id: material.id,
          parentTag: data.tag,
          tag: ProductInventroyTag.Material,
          children: undefined,
          status: ProductInventoryModifyStatus.Insert,
          data: material,
        });
        if (data.children === undefined) {
          data.children = [];
        }
        data.children.push(create);
        tableSelectData.value = create;
        expandRows([data.data.id]);
        scrollToInsertRow(material.id);
      }

      function deleteProduct(data) {
        data.status = ProductInventoryModifyStatus.Delete;
        tableSelectData.value = null;
      }

      function deleteModule(data) {
        if (data.status == ProductInventoryModifyStatus.Normal) {
          deleteLists.value.push(data);
          if (data.children) {
            for (let item of data.children) {
              item.status = ProductInventoryModifyStatus.Delete;
            }
          }
        }
        data.status = ProductInventoryModifyStatus.Delete;
        tableSelectData.value = null;
      }

      function deleteMateial(data) {
        if (data.status == ProductInventoryModifyStatus.Normal) {
          deleteLists.value.push(data);
        }
        data.status = ProductInventoryModifyStatus.Delete;
        tableSelectData.value = null;
      }

      function copyProduct(data) {
        var clone = cloneDeep(data);
        setCopyId(clone, clone.parentId);
        tableData.value.push(clone);
        tableSelectData.value = clone;
        expandRows([clone.id]);
        scrollToInsertRow(clone.id);
      }

      function copyModule(data) {
        var father = findParent(data.parentId);
        if (father) {
          var clone = cloneDeep(data);
          setCopyId(clone, clone.parentId);
          father.children.push(clone);
          tableSelectData.value = clone;
          expandRows([clone.id]);
          scrollToInsertRow(clone.id);
        }
      }

      function copyMaterial(data) {
        var father = findParent(data.parentId);
        if (father) {
          var clone = cloneDeep(data);
          setCopyId(clone, clone.parentId);
          father.children.push(clone);
          tableSelectData.value = clone;
          scrollToInsertRow(clone.id);
        }
      }

      function setCopyId(clone, parentId) {
        clone.status = ProductInventoryModifyStatus.Insert;
        clone.data.id = guid();
        clone.data.code = '';
        clone.id = clone.data.id;
        clone.parentId = parentId;
        if (clone.children) {
          for (let item of clone.children) {
            setCopyId(item, clone.id);
          }
        }
      }

      function findParent(id) {
        if (tableData && id) {
          for (let item of tableData.value) {
            var find = findTableData(item, id);
            if (find !== null) {
              return find;
            }
          }
        }
        return null;
      }

      function findTableData(data, id) {
        if (data) {
          if (data.data.id == id) {
            return data;
          }
          if (data.children) {
            for (let item of data.children) {
              return findTableData(item, id);
            }
          }
        }
        return null;
      }

      function scrollToInsertRow(id) {
        setTimeout(function () {
          var trElement = document.querySelector('tr[data-row-key="' + id + '"]');
          trElement?.scrollIntoView();
        }, 50);
      }

      return {
        modalTitle,
        addDisabled,
        loading,
        titleInfo,
        tableSelectData,
        tableData,
        saveLoading,
        ProductInventroyTag,
        menuClick,
        t,
        registerModal,
        registerTable,
        handleResizeColumn,
        tableRowClick,
        saveClick,
        addNewProduct,
        close: (e) => {
          destroyMenu(e);
        },
        getTableAllRows,
      };
    },
  });
</script>

<style lang="less">
  .scroll-container .scrollbar__wrap {
    margin-bottom: 0 !important;
  }

  .custom-modal .ant-modal-content {
    margin-top: -50px;
  }

  .ant-modal .ant-modal-body > .scrollbar {
    padding: 0;
  }

  .ant-modal-footer {
    padding: 0;
  }

  .vben-basic-title-normal {
    font-weight: 900 !important;
  }

  .context-menu {
    z-index: 9999;
  }
</style>
