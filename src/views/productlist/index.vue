<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <ProductTree ref="treeRef" class="w-1/5" />
    <ProductTable
      class="w-4/5"
      ref="tableRef"
      @import="importFromExcel"
      @edit="editTable"
      @detail="productDetail"
      @add="addProduct"
      @copyProduct="copyProduct"
      @delete="deleteProduct"
      @export="exportProduct"
      @publish="publishProduct"
      @uploadImage="uploadImage"
    />
    <ProductEdit @register="register" @saveChanges="saveChanges" />
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, createVNode } from 'vue';
  import { read, utils } from 'xlsx';
  import { Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { useLoading } from '/@/components/Loading';
  import { useGo } from '/@/hooks/web/usePage';
  import ProductTree from './ProductTree.vue';
  import ProductTable from './ProductTable.vue';
  import ProductEdit from './Edit/ProductEdit.vue';
  import {
    ProductSheet,
    deleteProducts,
    copyProducts,
    upDateProductStatus,
    uploadProductImage,
  } from './Index';
  export default defineComponent({
    name: 'ProductListManagement',
    components: {
      PageWrapper,
      ProductTree,
      ProductTable,
      ProductEdit,
    },
    setup() {
      const tableRef = ref(null);
      const treeRef = ref(null);
      const { t } = useI18n();
      const go = useGo();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '导入中...',
      });
      const [register, { openModal: editProduct, closeModal }] = useModal();
      const fileInput = ref<HTMLElement | null>(null);
      const select = ref();
      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          if (
            files[0].name.includes('.xlsx') ||
            files[0].name.includes('.xls') ||
            files[0].name.includes('.xlsm')
          ) {
            readExcel(files[0]);
          } else if (
            files[0].name.includes('.jpg') ||
            files[0].name.includes('.png') ||
            files[0].name.includes('.jpeg')
          ) {
            const response = await uploadProductImage(select.value.id, {
              data: files[0],
              fileName: files[0].name,
            });
            if (response.code == -1) {
              error('更新图片失败' + response.error);
            } else {
              select.value.imagePath = response.serverPath;
              success('更新图片成功');
            }
          }
          input.value = '';
        }
      };
      onMounted(() => {});
      function readExcel(file: File) {
        openFullLoading();
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1, raw: true });
            var sheet = new ProductSheet();
            sheet.init(jsonData);
            await sheet.import();
            await treeRef.value.refresh();
            closeFullLoading();
            success('导入成功');
          } catch (e) {
            closeFullLoading();
            error('导入失败' + e);
          }
        };
        reader.readAsArrayBuffer(file);
      }

      function importFromExcel() {
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }

      function uploadImage(data) {
        select.value = data;
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }

      function editTable(record: Recordable) {
        ///未上市产品才可编辑
        if (record.status != 1000) {
          error('不可编辑！');
          return;
        }
        editProduct(true, {
          id: record.id,
          addEnable: true,
          title: t('routes.productlist.productActionEdit'),
        });
      }

      function saveChanges(value) {
        if (value) {
          if (tableRef.value) {
            closeModal();
            tableRef.value.reload();
          }
        }
      }

      function productDetail(record: Recordable) {
        go('/productManagement/gyhProductDetail/' + record.id + '?msg=' + record.name);
      }

      function addProduct() {
        editProduct(true, {
          addEnable: false,
          title: t('routes.productlist.buttonAdd'),
        });
      }

      async function copyProduct(keys) {
        if (keys.length == 0) {
          error('请选择需复制产品');
          return;
        }
        try {
          await copyProducts(keys);
          tableRef.value.clearSelectedRowKeys();
          tableRef.value.reload();
          success('复制成功');
        } catch (e) {
          error('复制失败' + e);
        }
      }

      function deleteProduct(rows) {
        if (rows.length == 0) {
          error('请选择需删除产品');
          return;
        }
        var inMark = rows.find((x) => x.status === 0);
        if (inMark != undefined) {
          error('删除列表中包含上市产品');
          return;
        }
        var keys = rows.map((x) => x.id);
        Modal.confirm({
          title: () => '你想要删除这些产品吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            await deleteProducts(keys);
            if (tableRef.value) {
              tableRef.value.reload();
            }
          },
          onCancel() {
            if (tableRef.value) {
              tableRef.value.clearSelectedRowKeys();
            }
          },
        });
      }

      function exportProduct() {}

      function publishProduct(obj) {
        if (Object.keys(obj.body).length == 0) {
          error('请选择需发布的产品');
          return;
        }
        Modal.confirm({
          title: () => '你想要让这些产品' + obj.info + '吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            await upDateProductStatus(obj.body);
            if (tableRef.value) {
              tableRef.value.clearSelectedRowKeys();
              tableRef.value.reload();
            }
          },
          onCancel() {
            if (tableRef.value) {
              tableRef.value.clearSelectedRowKeys();
            }
          },
        });
      }

      return {
        treeRef,
        tableRef,
        fileInput,
        t,
        handleFileChange,
        register,
        importFromExcel,
        editTable,
        saveChanges,
        productDetail,
        addProduct,
        copyProduct,
        deleteProduct,
        exportProduct,
        publishProduct,
        uploadImage,
      };
    },
  });
</script>

<style></style>
