<template>
  <PageWrapper dense contentBackground contentFullHeight fixedHeight>
    <vxe-grid
      style="margin-left: 16px; margin-right: 16px"
      ref="xGrid"
      :loading="loading"
      :header-cell-style="headerCellStyle"
      v-bind="gridOptions"
      v-on="gridEvents"
    >
      <template #toolbar_buttons>
        <vxe-button status="success" @click="saveTable">保存</vxe-button>
        <vxe-button status="primary" @click="insertRow">新增</vxe-button>
        <vxe-button status="warning" @click="importFromExcel">导入</vxe-button>
        <vxe-button status="danger" @click="deleteRow">删除</vxe-button>
        <vxe-input
          style="margin-left: 16px; width: 250px"
          v-model="searchValue"
          placeholder="输入顺序码、物料编码、供应商编码"
        ></vxe-input>
        <vxe-button status="primary" @click="queryTable">查询</vxe-button>
      </template>
      <template #toolbar_tools>
        <vxe-button status="warning" @click="importMaterialImage">导入材质图片</vxe-button>
        <vxe-button status="warning" @click="importSeriesImage">导入样册图片</vxe-button>
      </template>
      <template #materialImageUrl_default="{ row }">
        <a-image
          v-if="row.materialImageUrl"
          :src="row.materialImageUrl"
          style="width: 30px; height: 30px"
        />
        <div v-else @click="upLoadMaterialImg(row)">
          <span style="color: #00a9f2; text-decoration: underline; cursor: pointer">上传</span>
        </div>
      </template>
      <template #seriesImageUrl_default="{ row }">
        <a-image
          v-if="row.seriesImageUrl"
          :src="row.seriesImageUrl"
          style="width: 30px; height: 30px"
        />
        <div v-else @click="uploadSeriedImg(row)">
          <span style="color: #00a9f2; text-decoration: underline; cursor: pointer">上传</span>
        </div>
      </template>
      <template #productionBatch_default="{ row }">
        <div class="panel-info-buttom" v-html="formattedProductionBatch(row)"></div>
      </template>
      <template #storageTime_default="{ row }">
        <div class="panel-info-buttom" v-html="formattedStorageTime(row)"></div>
      </template>
      <template #batchInventory_default="{ row }">
        <div class="panel-info-buttom" v-html="formattedBatchInventory(row)"></div>
      </template>
      <template #applicationProject_default="{ row }">
        <div @click="showProjectClick(row)">
          <span style="color: #00a9f2; text-decoration: underline; cursor: pointer">查看</span>
        </div>
      </template>
      <template #materialTexture_edit="{ row }">
        <vxe-select v-model="row.materialTexture" transfer>
          <vxe-option
            v-for="item in getMaterialTexture(row)"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></vxe-option>
        </vxe-select>
      </template>
    </vxe-grid>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import {
    VxeGridInstance,
    VxeGridListeners,
    VxeGridProps,
    VXETable,
    VxeTablePropTypes,
  } from 'vxe-table';
  import { read, utils } from 'xlsx';
  import {
    getImportExcelData,
    getManageExtra,
    getProjectInfo,
    imageCompressor,
    importMaterialImages,
    importSeriesImages,
    pageManageTable,
    saveManageTable,
    uploadImage,
  } from './index';
  import { getManageTableColumn, getManageTableColumRule } from './tableData';
  import { PageWrapper } from '/@/components/Page';
  import { MaterialManageFullDto, MaterialManageSearchDto } from '/@/services/ServiceProxies';
  export default defineComponent({
    name: 'MaterialLibrayManage',
    components: {
      PageWrapper,
    },
    setup() {
      onMounted(async () => {
        const $grid = xGrid.value;

        if ($grid) {
          setTimeout(async () => {
            const gridcols = $grid.getColumns();
            if (gridcols) {
              const supplier = $grid.getColumnByField('supplier');
              const suppliercode = $grid.getColumnByField('supplierCode');
              const seriesname = $grid.getColumnByField('seriesName');
              await getManageExtra().then((result) => {
                let data: any[] = [];
                if (result.supplier) {
                  data = result.supplier.map((x) => {
                    return { label: x, value: x };
                  });
                }
                let data1: any[] = suppliercode?.filters;
                if (result.supplierCode && data1.length > 0) {
                  data1[0].data.vals = result.supplierCode;
                }
                let data2: any[] = seriesname?.filters;
                if (result.seriesName && data2.length > 0) {
                  data2[0].data.vals = result.seriesName;
                }

                if (supplier) $grid.setFilter(supplier, data);
                //if (suppliercode) $grid.setFilter(suppliercode, data1);
                //if (seriesname) $grid.setFilter(seriesname, data2);
              });
            }
          }, 500);
        }
      });
      const xGrid = ref<VxeGridInstance<MaterialManageFullDto>>();
      const searchValue = ref('');
      const loading = ref(true);
      let saveFlag = false;
      const getMaterialTexture = (row) => {
        if (
          ['PVC（水性）', 'PVC（油性）', 'PET', 'PP（国产）', 'PP（进口）'].includes(
            row.materialType,
          )
        ) {
          return [
            {
              label: '纯色',
              value: '纯色',
            },
            {
              label: '木纹',
              value: '木纹',
            },
            {
              label: '布纹',
              value: '布纹',
            },
            {
              label: '皮纹',
              value: '皮纹',
            },
            {
              label: '石纹',
              value: '石纹',
            },
            {
              label: '金属纹',
              value: '金属纹',
            },

            {
              label: '艺术纹',
              value: '艺术纹',
            },
          ];
        } else if (['PVC墙布', '墙布'].includes(row.materialType)) {
          return [
            {
              label: '布纹',
              value: '布纹',
            },
          ];
        } else {
          return [
            {
              label: '皮纹',
              value: '皮纹',
            },
          ];
        }
      };

      const headerCellStyle: VxeTablePropTypes.HeaderCellStyle<MaterialManageFullDto> = ({
        column,
      }) => {
        if (column.title === '材料信息') {
          return {
            backgroundColor: '#F2DCDB',
            color: '#ffffff',
          };
        }
        if (column.title === '亚厦信息') {
          return {
            backgroundColor: '#DCE6F1',
            color: '#ffffff',
          };
        }
        if (column.title === '供应商信息') {
          return {
            backgroundColor: '#F2DCDB',
            color: '#ffffff',
          };
        }
      };

      const formattedProductionBatch = (row) => {
        if (row.productionBatch == null) {
          return '';
        }
        const formattedText = row.productionBatch.replace(/、/g, '<br>').replace(/,/g, '<br>');
        return formattedText.trim();
      };

      const formattedStorageTime = (row) => {
        if (row.storageTime == null) {
          return '';
        }
        const formattedText = row.storageTime.replace(/、/g, '<br>').replace(/,/g, '<br>');
        return formattedText.trim();
      };

      const formattedBatchInventory = (row) => {
        if (row.batchInventory == null) {
          return '';
        }
        const formattedText = row.batchInventory.replace(/、/g, '<br>').replace(/,/g, '<br>');
        return formattedText.trim();
      };

      const gridOptions = reactive<VxeGridProps<MaterialManageFullDto>>({
        id: 'materialManageTable',
        border: true,
        stripe: true,
        showHeaderOverflow: true,
        showOverflow: true,
        keepSource: true,
        align: 'center',
        height: 'auto',
        rowConfig: {
          useKey: true,
        },
        columnConfig: {
          resizable: true,
        },
        sortConfig: {
          trigger: 'cell',
          remote: true,
        },
        filterConfig: {
          remote: true,
        },
        pagerConfig: {
          enabled: true,
          pageSize: 20,
          pageSizes: [20, 50, 100, 200, 400],
        },
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
            tools: 'toolbar_tools',
          },
        },
        checkboxConfig: {
          reserve: true,
          range: true,
        },
        menuConfig: {
          body: {
            options: [
              [
                {
                  code: 'delete',
                  name: '删除',
                  prefixIcon: 'vxe-icon-delete-fill',
                  visible: true,
                  disabled: false,
                },
              ],
            ],
          },
          trigger: 'cell',
          visibleMethod: ({ row, column }) => {
            if (
              (row?.materialImageUrl && column?.title == '材质图片') ||
              (row?.seriesImageUrl && column?.title == '样册外观照片')
            ) {
              return true;
            } else {
              return false;
            }
          },
        },
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: true,
        },
        columns: getManageTableColumn(),
        editRules: getManageTableColumRule(),
        proxyConfig: {
          seq: true,
          sort: true,
          filter: true,
          form: true,
          message: false,
          props: {
            result: 'items',
            total: 'totalCount',
          },
          ajax: {
            query: async ({ page, sorts, filters, form }) => {
              loading.value = true;
              let searchdto = new MaterialManageSearchDto();
              searchdto.skipCount = page.currentPage;
              searchdto.maxResultCount = page.pageSize;
              if (sorts.length > 0) {
                searchdto.sorting = sorts[0].field + ' ' + sorts[0].order;
              }
              if (searchValue.value && !saveFlag) {
                searchdto.search = searchValue.value.trim();
              }
              var statusfilters = filters.filter((x) => x.field == 'status');
              if (statusfilters.length > 0) {
                searchdto.status = statusfilters[0].values;
              }

              var typefilters = filters.filter((x) => x.field == 'materialType');
              if (typefilters.length > 0) {
                searchdto.materialType = typefilters[0].values;
              }

              var supplierfilters = filters.filter((x) => x.field == 'supplier');
              if (supplierfilters.length > 0) {
                searchdto.supplier = supplierfilters[0].values;
              }

              var suppliercodefilters = filters.filter((x) => x.field == 'supplierCode');
              if (suppliercodefilters.length > 0) {
                if (suppliercodefilters[0].datas.length > 0) {
                  searchdto.supplierCode = suppliercodefilters[0].datas[0].sVals
                    .filter((x) => x.checked)
                    .map((x) => x.value);
                }
              }

              var seriesnamefilters = filters.filter((x) => x.field == 'seriesName');
              if (seriesnamefilters.length > 0) {
                if (seriesnamefilters[0].datas.length > 0) {
                  searchdto.seriesName = seriesnamefilters[0].datas[0].sVals
                    .filter((x) => x.checked)
                    .map((x) => x.value);
                }
              }

              return await pageManageTable(searchdto).then((result) => {
                loading.value = false;
                return result;
              });
            },
            save: async ({ body }) => {
              loading.value = true;
              return await saveManageTable(body).then((vaule) => {
                loading.value = false;
                return new Promise((resolve, reject) => {
                  if (vaule.success) {
                    VXETable.modal.message({ content: '保存成功', status: 'success' });
                  } else {
                    VXETable.modal.message({ content: '保存失败 ' + vaule.error, status: 'error' });
                  }
                  resolve(vaule.data);
                });
              });
            },
          },
        },
      });

      const gridEvents = reactive<VxeGridListeners<MaterialManageFullDto>>({
        menuClick({ menu, row, column }) {
          const $grid = xGrid.value;
          if ($grid) {
            switch (menu.code) {
              case 'delete':
                $grid.clearData(row, column.field);
                if (column.field == 'materialImageUrl') {
                  $grid.clearData(row, 'materialImageDownLoadUrl');
                }

                break;
            }
          }
        },
        editClosed({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
          const $grid = xGrid.value;
          if ($grid) {
            const changeValue = row[column.field];
            var select = $grid.getCheckboxRecords();
            if (changeValue && select.length > 0) {
              select.forEach((x) => {
                x[column.field] = changeValue;
              });
            }
          }
        },
        proxyQuery() {
          console.log('查询事件');
        },
        proxyDelete() {
          console.log('删除事件');
        },
        proxySave() {
          console.log('保存事件');
        },
      });

      const saveTable = async () => {
        const $grid = xGrid.value;
        if ($grid) {
          const { insertRecords, removeRecords, updateRecords } = $grid.getRecordset();
          if (insertRecords.length == 0 && removeRecords.length == 0 && updateRecords.length == 0) {
            VXETable.modal.message({ content: '没有修改项', status: 'error' });
          } else {
            saveFlag = true;
            $grid.commitProxy('save');
          }
        }
      };

      const insertRow = async () => {
        const $grid = xGrid.value;
        if ($grid) {
          const { row: newRow } = await $grid.insert({});
          await $grid.setEditRow(newRow, 'status');
        }
      };

      const uploadDataFromExcel = async () => {
        try {
          const { file } = await VXETable.readFile({
            types: ['xlsx'],
          });
          loading.value = true;
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const data = new Uint8Array(e.target.result);
                const workbook = read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = utils.sheet_to_json(worksheet, { header: 1, raw: true });
                resolve(jsonData);
              } catch (e) {
                reject('导入失败' + e);
                loading.value = false;
              }
            };
            reader.readAsArrayBuffer(file);
          }).then((response) => {
            return new Promise((resolve, reject) => {
              let result: any[] = [];
              try {
                result = getImportExcelData(response);
                resolve(result);
              } catch (e) {
                reject('解析EXCEL失败' + e);
                loading.value = false;
              }
            });
          });
        } catch (e) {}
      };

      const importFromExcel = async () => {
        const $grid = xGrid.value;
        if ($grid) {
          await uploadDataFromExcel()
            .then((data) => {
              $grid.insert(data);
              VXETable.modal.message({
                content: '已成功导入' + data.length + '行数据',
                status: 'success',
              });
              loading.value = false;
            })
            .catch((e) => {
              VXETable.modal.message({ content: '导入失败' + e, status: 'error' });
              loading.value = false;
            });
        }
      };

      const deleteRow = async () => {
        const $grid = xGrid.value;
        if ($grid) {
          const select = $grid.getCheckboxRecords();
          if (select.length == 0) {
            VXETable.modal.message({ content: '请选择需要删除的数据', status: 'error' });
          } else {
            await $grid.removeCheckboxRow();
          }
        }
      };

      const chunkFiles = (files, maxSize) => {
        let currentSize = 0;
        let currentBatch: any[] = [];

        const batches: any[] = [];

        for (let item of files) {
          currentSize += item.size;

          if (currentSize <= maxSize) {
            currentBatch.push(item);
          } else {
            batches.push(currentBatch);
            currentBatch = [item];
            currentSize = item.size;
          }
        }

        if (currentBatch.length > 0) {
          batches.push(currentBatch);
        }

        return batches;
      };

      const importMaterialImage = async () => {
        try {
          const { files } = await VXETable.readFile({
            types: ['png', 'jpg', 'jpeg'],
            multiple: true,
          });

          const batchSize = 200 * 1024 * 1024; // 200MB
          const batches = chunkFiles(files, batchSize);
          loading.value = true;

          for (let batch of batches) {
            let imageBody: any[] = [];
            let downloadBody: any[] = [];
            for (let item of batch) {
              downloadBody.push({
                data: item,
                fileName: item.name,
              });

              var maxSize = 3 * 1024 * 1024;
              if (item.size > maxSize) {
                await imageCompressor(item, 'file', maxSize)
                  .then((image) => {
                    imageBody.push({
                      data: image,
                      fileName: image.name,
                    });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                imageBody.push({
                  data: item,
                  fileName: item.name,
                });
              }
            }
            await importMaterialImages(imageBody, downloadBody).then((response) => {
              if (!response.success) {
                VXETable.modal.message({ content: '上传失败 ' + response.data, status: 'error' });
              }
            });
          }

          loading.value = false;
        } catch (e) {
          console.error(e);
        }
      };

      const importSeriesImage = async () => {
        try {
          const { files } = await VXETable.readFile({
            types: ['png', 'jpg', 'jpeg'],
            multiple: true,
          });

          const batchSize = 200 * 1024 * 1024; // 200MB
          const batches = chunkFiles(files, batchSize);
          loading.value = true;

          for (let batch of batches) {
            let imageBody: any[] = [];
            for (let item of batch) {
              imageBody.push({
                data: item,
                fileName: item.name,
              });
            }
            await importSeriesImages(imageBody).then((response) => {
              if (!response.success) {
                VXETable.modal.message({ content: '上传失败 ' + response.data, status: 'error' });
              }
            });
          }
          loading.value = false;
        } catch (e) {
          console.error(e);
        }
      };

      const queryTable = async () => {
        const $grid = xGrid.value;
        if ($grid) {
          saveFlag = false;
          $grid.commitProxy('query');
        }
      };

      const upLoadMaterialImg = async (row) => {
        try {
          const { file } = await VXETable.readFile({
            types: ['png', 'jpg', 'jpeg', 'gif'],
          });
          await uploadImage({ data: file, fileName: file.name }).then((result) => {
            if (result.success) {
              row.materialImageDownLoadUrl = result.data;
            } else {
              VXETable.modal.message({ content: '上传失败 ' + vaule.error, status: 'error' });
            }
          });

          var maxSize = 3 * 1024 * 1024;
          //压缩图片
          if (file.size > maxSize) {
            await imageCompressor(file, 'file', maxSize).then(async (compressfile: any) => {
              if (compressfile) {
                await uploadImage({ data: compressfile, fileName: compressfile.name }).then(
                  (result) => {
                    if (result.success) {
                      row.materialImageUrl = result.data;
                    }
                  },
                );
              }
            });
          } else {
            row.materialImageUrl = row.materialImageDownLoadUrl;
          }
        } catch (e) {}
      };

      const uploadSeriedImg = async (row) => {
        try {
          const { file } = await VXETable.readFile({
            types: ['png', 'jpg', 'jpeg', 'gif'],
          });
          await uploadImage({ data: file, fileName: file.name }).then((result) => {
            if (result.success) {
              row.seriesImageUrl = result.data;
            } else {
              VXETable.modal.message({ content: '上传失败 ' + vaule.error, status: 'error' });
            }
          });
        } catch (e) {}
      };

      const showProjectClick = async (row) => {
        if (row.materialCode) {
          await getProjectInfo([
            {
              code: row.materialCode,
              type: 2,
            },
          ]).then((response) => {
            if (response[0].projects && response[0].projects.length > 0) {
              let date = response[0].projects[0].creationTime.format('YYYY-MM-DD');
              let title = '【' + date + ' 项目信息】' + row.materialCode;
              let content = '';
              for (let item of response[0].projects) {
                content +=
                  '项目：' + item.projectName + '————' + '编码：' + item.projectCode + '\n';
              }
              VXETable.modal.alert({
                title: title,
                escClosable: true,
                content: content,
                height: 'max-content',
                width: 'max-content',
                draggable: false,
              });
            } else {
              VXETable.modal.message({
                content: '无法查到相关项目',
                status: 'error',
              });
            }
          });
        } else {
          VXETable.modal.message({
            content: '物料编码为空无法查看相关项目',
            status: 'error',
          });
        }
      };
      return {
        xGrid,
        gridOptions,
        gridEvents,
        searchValue,
        loading,
        getMaterialTexture,
        headerCellStyle,
        upLoadMaterialImg,
        showProjectClick,
        uploadSeriedImg,
        formattedProductionBatch,
        formattedStorageTime,
        formattedBatchInventory,
        saveTable,
        insertRow,
        importFromExcel,
        deleteRow,
        queryTable,
        importMaterialImage,
        importSeriesImage,
      };
    },
  });
</script>
<style scoped>
  :deep().vxe-buttons--wrapper {
    margin-top: 4px;
    margin-bottom: 8px;
  }

  :deep().vxe-tools--wrapper {
    margin-top: 4px;
    margin-bottom: 8px;
  }
</style>
