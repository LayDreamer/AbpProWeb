<template>
  <div class="p-4">
    <a-tabs v-model:activeKey="activeKey" default-active-key="1" @change="tabsChange">
      <a-tab-pane key="1" tab="节点图" />
      <a-tab-pane key="2" tab="加工图" />
      <a-tab-pane key="4" tab="装配图" />
      <a-tab-pane key="8" tab="物料配件图" />
      <a-tab-pane key="16" tab="物料信息表" />
      <a-tab-pane key="32" tab="产品作业工艺及质量验收标准" />
    </a-tabs>
    <div class="w-full h-188 flex flex-row">
      <div class="w-140 h-full flex flex-col">
        <div class="flex mt-4 mb-8 justify-between">
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                route.query.type == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                route.query.type == '项目')
            "
            type="default "
            @click="oneUpload"
            >单个上传</a-button
          >
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                route.query.type == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                route.query.type == '项目')
            "
            type="default "
            @click="moreUpload"
            >批量上传</a-button
          >
          <a-button
            v-if="hasPermission('YaSha.DataManager.ArchitectureList.Download')"
            type="default "
            @click="moreDownload"
            >批量下载</a-button
          >
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                route.query.type == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                route.query.type == '项目')
            "
            type="default "
            @click="moreDelete"
            >批量删除</a-button
          >
        </div>
        <div class="flex-1 overflow-hidden w-full">
          <BasicTable @register="registeTable" :dataSource="tableData">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction :actions="createActions(record)" />
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
      <div class="flex-1 ml-4 h-full">
        <vue-office-docx
          v-if="showType == 'doc'"
          :src="url"
          style="height: 100%; margin: 0; padding: 0"
        />
        <div v-if="showType == 'excel'" id="luckysheet" style="height: 100%"></div>
        <VuePdfApp v-if="showType == 'pdf'" :pdf="url" style="height: 100%"></VuePdfApp>
        <iframe
          v-if="showType == 'dwg'"
          :src="`https://bds.chinayasha.com/bdsautodeskservice/?src=` + url"
          style="height: 100%; width: 100%; border: 2px dashed rgb(156 163 175)"
        ></iframe>
        <div v-if="showType == 'init'" class="h-full">
          <div
            class="flex justify-center h-full bg-gray-200 border-gray-400 border-2 border-dashed"
          >
            <div
              style="
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
              "
              >预览</div
            >
          </div>
        </div>
      </div>
    </div>
    <input
      type="file"
      ref="fileInput"
      :multiple="fileMutiply"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts">
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import VueOfficeDocx from '@vue-office/docx';
  import '@vue-office/docx/lib/index.css';
  import { Modal } from 'ant-design-vue';
  import LuckyExcel from 'luckyexcel';
  import { createVNode, defineComponent, nextTick, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import VuePdfApp from 'vue3-pdf-app';
  import 'vue3-pdf-app/dist/icons/main.css';
  import { deleteFileAsync, getFileListAsync, insertFileAsync } from './index';
  import { isFunction } from './utils/is';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      VueOfficeDocx,
      VuePdfApp,
    },
    setup() {
      const route = useRoute();
      console.log(route.query);
      onMounted(() => {
        setTitle(route.query.title + '图纸');
      });
      const { setTitle } = useTabs();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const { hasPermission } = usePermission();
      const activeKey = ref('1');
      const tableData = ref<any[]>([]);
      const fileInput = ref();
      const fileMutiply = ref(false);
      const url = ref('');
      const showType = ref('init');
      const columns = [
        {
          title: '文件名',
          dataIndex: 'fileName',
        },
      ];
      const [registeTable, { reload, getSelectRows, clearSelectedRowKeys }] = useTable({
        rowSelection: { type: 'checkbox' },
        pagination: false,
        showTableSetting: false,
        striped: false,
        clickToRowSelect: false,
        canResize: true,
        isCanResizeParent: true,
        columns: columns,
        beforeFetch: () => {
          return {
            id: route.query.id,
            status: activeKey.value,
          };
        },
        api: getFileListAsync,
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
        },
      });

      function createActions(record) {
        return [
          {
            label: '查看',
            onClick: oneView.bind(null, record),
          },
          {
            label: '下载',
            onClick: oneDownload.bind(null, record),
            hidden: !hasPermission('YaSha.DataManager.ArchitectureList.Download'),
          },
          {
            label: '删除',
            hidden:
              (!hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                route.query.type == '固化') ||
              (!hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                route.query.type == '项目'),
            popConfirm: {
              title: '是否删除',
              confirm: oneDelete.bind(null, record),
            },
          },
        ];
      }

      function tabsChange() {
        reload();
      }

      function oneView(record) {
        url.value = record.filePath;
        if (url.value.includes('.docx')) {
          showType.value = 'doc';
        } else if (url.value.includes('.xlsx')) {
          showType.value = 'excel';
          nextTick(() => {
            luckysheet.create({
              container: 'luckysheet',
            });
            loadSheet(record.fileName, record.filePath);
          });
        } else if (url.value.includes('.pdf')) {
          showType.value = 'pdf';
        } else if (url.value.includes('.dwg')) {
          showType.value = 'dwg';
        } else {
          showType.value = 'init';
        }
      }

      function loadSheet(name, value) {
        LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson, luckysheetfile) => {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert(
              'Failed to read the content of the excel file, currently does not support xls files!',
            );
            return;
          }
          isFunction(window?.luckysheet?.destroy) && window.luckysheet.destroy();

          window.luckysheet.create({
            container: 'luckysheet', //luckysheet is the container id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
          });
        });
      }

      function oneUpload() {
        fileMutiply.value = false;
        nextTick(() => {
          let oBtn = fileInput.value as HTMLInputElement;
          oBtn.click();
        });
      }

      function moreUpload() {
        fileMutiply.value = true;
        nextTick(() => {
          let oBtn = fileInput.value as HTMLInputElement;
          oBtn.click();
        });
      }

      async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          let body: any[] = [];
          for (let i = 0; i < files.length; i++) {
            body.push({
              data: files[i],
              fileName: files[i].name,
            });
          }
          var dto = await insertFileAsync(route.query.id, activeKey.value, body);
          if (dto.success) {
            success('上传成功');
            reload();
          } else {
            error('上传失败' + dto.error);
          }
        }
        input.value = '';
      }

      function oneDownload(record) {
        if (record.fileEncryptionPath) {
          let path = encodeURI(record.fileEncryptionPath).replace(/\#/g, '%23');
          window.open(path, '_self');
        }
      }

      function moreDownload() {
        var value = getSelectRows();
        if (value.length == 0) {
          error('请选择要下载文件');
          return;
        }
        const triggerDelay = 100;
        const removeDelay = 1000;
        value.forEach((item, index) => {
          if (item.fileEncryptionPath) {
            let url = encodeURI(item.fileEncryptionPath).replace(/\#/g, '%23');
            createIFrame(url, index * triggerDelay, removeDelay);
          }
        });
        clearSelectedRowKeys();

        function createIFrame(url, triggerDelay, removeDelay) {
          setTimeout(function () {
            const frame = document.createElement('iframe');
            frame.setAttribute('style', 'display: none');
            frame.setAttribute('src', url);
            frame.setAttribute('id', 'iframeName');
            document.body.appendChild(frame);
            setTimeout(function () {
              const node = document.getElementById('iframeName');
              if (node && node.parentNode) {
                node.parentNode.removeChild(node);
              }
            }, removeDelay);
          }, triggerDelay);
        }
      }

      async function oneDelete(record) {
        var dto = await deleteFileAsync([record.id]);
        if (dto.success) {
          success('删除成功');
          reload();
        } else {
          error('删除失败' + dto.error);
        }
      }

      async function moreDelete() {
        var value = getSelectRows();
        if (value.length == 0) {
          error('请选择要删除文件');
          return;
        }
        Modal.confirm({
          title: () => '你想要删除这些表单吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            var keys = value.map((x) => x.id);
            var dto = await deleteFileAsync(keys);
            if (dto.success) {
              success('删除成功');
              reload();
            } else {
              error('删除失败' + dto.error);
            }
          },
          onCancel() {
            clearSelectedRowKeys();
          },
        });
      }

      return {
        route,
        hasPermission,
        url,
        showType,
        tableData,
        activeKey,
        fileInput,
        fileMutiply,
        registeTable,
        tabsChange,
        createActions,
        oneUpload,
        moreUpload,
        moreDownload,
        moreDelete,
        handleFileChange,
      };
    },
  });
</script>
<style scoped>
  :deep() .luckysheet-stat-area {
    background-color: white !important;
  }

  :deep() .adsk-viewing-viewer {
    position: relative !important;
  }
</style>
