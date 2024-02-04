<template>
  <div class="flex flex-col overflow-y-scroll m-4 mr-4">
    <div class="flex h-full max-h-135 enter-y">
      <BasicTable
        :searchInfo="searchInfo"
        @register="registerMainTable"
        @resizeColumn="handleResizeColumn"
        @row-click="mainTableClick"
        :rowClassName="rowClassName"
      >
        <template #toolbar>
          <a-button type="primary" @click="sheetInfo">图纸</a-button>
          <a-input-search
            placeholder="名称"
            allow-clear
            style="width: 200px"
            @search="searchName"
          />
          <a-input-search
            placeholder="型号"
            style="width: 200px"
            allow-clear
            @search="searchModel"
          />
          <a-select
            style="width: 100px"
            v-model:value="publishSelect"
            :options="selectOptions"
            @change="selectChange"
          />
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                treeNodeType == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                treeNodeType == '项目')
            "
            type="primary"
            @click="addData"
            >新增</a-button
          >
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                treeNodeType == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                treeNodeType == '项目')
            "
            type="primary"
            @click="copyData"
            >复制</a-button
          >
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                treeNodeType == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                treeNodeType == '项目')
            "
            type="primary"
            @click="deleteData"
            >删除</a-button
          >
          <a-button
            v-if="
              (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                treeNodeType == '固化') ||
              (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                treeNodeType == '项目')
            "
            type="primary"
            @click="importExcel"
            >导入</a-button
          >
          <a-dropdown>
            <template #overlay>
              <a-menu @click="changeStatus">
                <a-menu-item key="上市">上市</a-menu-item>
                <a-menu-item key="待上市">待上市</a-menu-item>
                <a-menu-item key="下市">下市</a-menu-item>
                <a-menu-item key="待下市">待下市</a-menu-item>
              </a-menu>
            </template>
            <a-button
              v-if="
                (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                  treeNodeType == '固化') ||
                (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                  treeNodeType == '项目')
              "
              type="primary"
              >修改状态</a-button
            >
          </a-dropdown>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'creationTime'">{{
            new Date(record.creationTime).toLocaleString()
          }}</template>
          <template v-else-if="column.key === 'lastModificationTime'">{{
            record.lastModificationTime === undefined
              ? ''
              : new Date(record.lastModificationTime).toLocaleString()
          }}</template>
          <template v-else-if="column.key === 'action'">
            <div
              @click.stop
              v-if="
                (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
                  treeNodeType == '固化') ||
                (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
                  treeNodeType == '项目')
              "
            >
              <TableAction :actions="createActions(record)" />
            </div>
          </template>
        </template>
      </BasicTable>
    </div>
    <div class="flex h-1/20 mt-1 enter-y">
      <div
        class="w-1/15 border-solid border-1 border-gray-400 text-xl font-bold flex justify-center items-center"
      >
        备注:
      </div>
      <a-textarea v-model:value="systemRemark" />
      <div class="flex justify-center">
        <a-button
          v-if="
            (hasPermission('YaSha.DataManager.ArchitectureList.SolidifyEdit') &&
              treeNodeType == '固化') ||
            (hasPermission('YaSha.DataManager.ArchitectureList.ProjectEdit') &&
              treeNodeType == '项目')
          "
          class="custom-button ml-2 mr-2 w-25"
          type="primary"
          @click="modifySystemRemark"
          >更新</a-button
        >
      </div>
    </div>
    <div class="flex h-1/10 enter-y">
      <a-tabs v-model:activeKey="activeKey" default-active-key="detail">
        <a-tab-pane key="detail" tab="详情及生产信息" />
        <a-tab-pane key="matieral" tab="物料信息" />
        <a-tab-pane key="process" tab="安装信息" />
        <a-tab-pane key="three" tab="三维族" />
      </a-tabs>
    </div>

    <!-- <div class="h-13/30"> -->
    <div class="enter-y min-h-25">
      <div v-if="activeKey == 'detail'">
        <table class="detailTable">
          <tr v-for="(item, index) in detailInfo" :key="index">
            <td class="detailTilte">{{ item.title }}</td>
            <td class="detailValue">
              <div v-if="Array.isArray(item.value)" class="flex flex-row justify-start">
                <div v-for="b in item.value">
                  <a-button type="primary" style="margin-right: 10px" @click="showSheet(b.value)">
                    {{ b.name }}
                  </a-button>
                </div>
              </div>
              <div v-else>
                {{ item.value }}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div v-else-if="activeKey == 'matieral'" class="h-full">
        <BasicTable
          @register="registerMaterialTable"
          @resizeColumn="handleResizeColumn"
          :dataSource="materialData"
        >
        </BasicTable>
      </div>
      <div v-else-if="activeKey == 'process'" class="flex">
        <div class="w-1/4 max-h-90" v-if="optional">
          <BasicTable
            @register="registerOptionalTable"
            @resizeColumn="handleResizeColumn"
            @row-click="optionalRowClick"
            :dataSource="optionalData"
          >
          </BasicTable>
        </div>
        <div class="w-1/80" v-if="optional"></div>
        <div :class="{ 'w-3/4 ml-1 ': optional, 'w-full': !optional }">
          <BasicTable
            @register="registerProcessingTable"
            @resizeColumn="handleResizeColumn"
            :dataSource="processData"
          >
          </BasicTable>
        </div>
      </div>
      <div
        v-else-if="activeKey == 'three'"
        class="h-max flex flex-row"
        ref="viewer"
        style="position: relative"
      >
        <div class="w-1/3 h-full mr-4" v-if="threeData">
          <table class="detailTable">
            <tr>
              <td class="detailTilte">族名称</td>
              <td class="detailValue"> {{ threeData.displayName }} </td>
            </tr>
            <tr>
              <td class="detailTilte">长(mm)</td>
              <td class="detailValue"> {{ threeData.length }} </td>
            </tr>
            <tr>
              <td class="detailTilte">宽(mm)</td>
              <td class="detailValue"> {{ threeData.width }} </td>
            </tr>
            <tr>
              <td class="detailTilte">高(mm)</td>
              <td class="detailValue"> {{ threeData.height }} </td>
            </tr>
            <tr>
              <td class="detailTilte">路径</td>
              <td class="detailValue"> {{ threeData.hierarchy }} </td>
            </tr>
          </table>
        </div>
        <div class="w-2/3 h-auto" v-if="threeData && threeData.externalData != ''">
          <iframe
            :src="
              `https://bds.chinayasha.com/bdsthreeviewservice/website/index.html#model=` +
              threeData.externalData
            "
            style="height: 100%; width: 100%; border: 2px dashed rgb(156 163 175)"
          ></iframe>
          <div
            style="position: absolute; top: 10px; right: 10px; cursor: pointer"
            @click="toggleDom"
          >
            <span
              class="iconify"
              data-icon="fluent-mdl2:full-screen"
              style="font-size: 32px; color: gray"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <AddModal @register="registerAddModal" @save="saveChanges"></AddModal>
    <EditModal @register="registerEditModal" @save="saveChanges"></EditModal>
    <FileShowModal @register="registerFileShowModal"></FileShowModal>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script lang="ts">
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { useFullscreen } from '@vueuse/core';
  import { Modal } from 'ant-design-vue';
  import {
    createVNode,
    defineComponent,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { read, utils } from 'xlsx';
  import { useLoading } from '/@/components/Loading';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    ArchitectureListFileStatus,
    ArchitectureListMaterialTag,
    ArchitectureListPublishStatus,
    ArchitectureListTreeDto,
  } from '/@/services/ServiceProxies';
  import EventBus from '/@/utils/EventBus';
  import { default as AddModal, default as EditModal } from '/@/views/architectureList/Edit.vue';
  import FileShowModal from '/@/views/architectureList/FileShow.vue';
  import {
    copyDataAsync,
    deletDataAsync,
    exportFromExcel,
    getThreeUrlAsync,
    pageTableAsync,
    updateDataStatusAsync,
    updateTreeNodeAsync,
  } from '/@/views/architectureList/index';
  import {
    mainTableColumn,
    materialTableColumn,
    optionalTableColumn,
    processingTableColumn,
  } from '/@/views/architectureList/tableData';

  export default defineComponent({
    name: 'productTable',
    components: {
      BasicTable,
      TableAction,
      EditModal,
      AddModal,
      FileShowModal,
    },
    setup(_, { emit }) {
      onBeforeMount(() => {
        EventBus.on('architeTreeSelect', refreshTable);
      });
      onMounted(() => {});
      onBeforeUnmount(() => {
        EventBus.off('architeTreeSelect', refreshTable);
      });
      const router = useRouter();
      const { t } = useI18n();
      const { hasPermission } = usePermission();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '导入中...',
      });
      const fileInput = ref<HTMLElement | null>(null);
      const searchInfo = reactive<Recordable>({});
      const activeKey = ref('detail');
      const publishSelect = ref(ArchitectureListPublishStatus.InMark);
      const systemRemark = ref('');
      const selectIndex = ref({
        index: -1,
        select: false,
      });
      const selectOptions = ref([
        { label: '上市', value: ArchitectureListPublishStatus.InMark },
        { label: '下市', value: ArchitectureListPublishStatus.OutMark },
        { label: '待上市', value: ArchitectureListPublishStatus.DelayInMark },
        { label: '待下市', value: ArchitectureListPublishStatus.DelayOutMark },
      ]);
      const detailInfo = ref([
        {
          title: '定制规范',
          value: '',
        },
        {
          title: '装配图图号',
          value: undefined as any,
        },
        {
          title: '节点图图号',
          value: undefined as any,
        },
        {
          title: '加工图图号',
          value: undefined as any,
        },
        {
          title: '加工码',
          value: '',
        },
        {
          title: '供货方式',
          value: '',
        },
      ]);
      const materialData = ref<any[]>([]);
      const processData = ref<any[]>([]);
      const optionalData = ref<any[]>([]);
      let selectMaterialData: any[] = [];
      const optional = ref(false);
      const selectSearchCollapsed = ref(true);
      const treeNodeType = ref('');
      let selectTreeNode: any;
      const viewer = ref<Nullable<HTMLElement>>(null);
      const threeData = ref();
      const { toggle: toggleDom } = useFullscreen(viewer);
      const [registerMainTable, { reload, clearSelectedRowKeys, getSelectRowKeys, getSelectRows }] =
        useTable({
          title: '列表',
          rowKey: 'id',
          rowSelection: { type: 'checkbox' },
          showTableSetting: true,
          striped: false,
          size: 'small',
          clickToRowSelect: false,
          canResize: true,
          isCanResizeParent: true,
          pagination: {
            pageSizeOptions: ['10', '50', '100', '300'],
          },
          columns: mainTableColumn(),
          api: pageTableAsync,
          beforeFetch: (data) => {
            return {
              maxResultCount: data.pageSize,
              skipCount: data.pageIndex,
              sorting: data.sorting,
              key: data.key,
              searchValue: data.searchValue,
              searchCode: data.searchCode,
              status: data.status,
            };
          },
          actionColumn: {
            width: 60,
            title: '操作',
            dataIndex: 'action',
          },
        });

      const [registerMaterialTable] = useTable({
        showTableSetting: false,
        striped: false,
        clickToRowSelect: false,
        canResize: false,
        pagination: false,
        isCanResizeParent: true,
        columns: materialTableColumn(),
      });

      const [registerProcessingTable] = useTable({
        showTableSetting: false,
        striped: false,
        clickToRowSelect: false,
        canResize: false,
        pagination: false,
        isCanResizeParent: true,
        columns: processingTableColumn(),
      });

      const [registerOptionalTable, { getSelectRowKeys: getOptionKeys }] = useTable({
        showTableSetting: false,
        rowSelection: {
          type: 'radio',
        },
        striped: false,
        clickToRowSelect: true,
        canResize: true,
        pagination: false,
        isCanResizeParent: true,
        columns: optionalTableColumn(),
      });

      const [registerEditModal, { openModal, closeModal }] = useModal();
      const [registerAddModal, { openModal: openAddModal, closeModal: closeAddModal }] = useModal();

      const [registerFileShowModal, { openModal: openFileShow }] = useModal();

      function readExcel(file) {
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
            }
          };
          reader.readAsArrayBuffer(file);
        });
      }
      async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (!file.name.includes('产品模块') && !file.name.includes('定制加工')) {
            error('文件名应包含产品模块或定制加工');
          } else {
            readExcel(file).then(async (json) => {
              openFullLoading();
              try {
                await exportFromExcel(json, file.name.includes('定制加工'));
                success('导入成功');
              } catch (e) {
                error('导入失败' + e);
              }
              closeFullLoading();
            });
          }
        } else {
          error('文件选择异常');
        }
        input.value = '';
      }

      function refreshTable(treeSelect) {
        selectTreeNode = treeSelect;
        if (treeSelect) {
          searchInfo.status = publishSelect.value;
          searchInfo.searchValue = '';
          searchInfo.searchCode = '';
          if (treeSelect.selected) {
            searchInfo.key = treeSelect.node.id;
            systemRemark.value = treeSelect.node.data;
            if (treeSelect.node.name.props.name.indexOf('系统') > 0) {
              treeNodeType.value = '固化';
            } else if (treeSelect.node.name.props.name.indexOf('项目') > 0) {
              treeNodeType.value = '项目';
            } else {
              treeNodeType.value = '';
            }
          } else {
            searchInfo.key = '';
            treeNodeType.value = '';
          }
        }
        reload();
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }

      function createActions(record) {
        return [
          {
            label: '编辑',
            onClick: editData.bind(null, record),
          },
        ];
      }

      function rowClassName(record, index) {
        if (selectIndex.value.index == index && selectIndex.value.select) {
          return 'selectblue';
        } else {
          return 'selectwhite';
        }
      }

      async function mainTableClick(record, index, event) {
        //同一行重复点击 点击效果轮显 新的一行显示点击效果
        if (selectIndex.value.index == index) {
          selectIndex.value.select = !selectIndex.value.select;
        } else {
          selectIndex.value.select = true;
        }
        selectIndex.value.index = index;

        var file0 = record.files
          .filter((x) => x.type == ArchitectureListFileStatus.Assembly)
          .map((x) => {
            return {
              name: x.fileName.substr(0, 10),
              value: x.filePath,
            };
          });
        var file1 = record.files
          .filter((x) => x.type == ArchitectureListFileStatus.Detail)
          .map((x) => {
            return {
              name: x.fileName.substr(0, 10),
              value: x.filePath,
            };
          });
        var file2 = record.files
          .filter((x) => x.type == ArchitectureListFileStatus.Processing)
          .map((x) => {
            return {
              name: x.fileName.substr(0, 10),
              value: x.filePath,
            };
          });
        detailInfo.value[0].value = record.moduleSpecification;
        detailInfo.value[1].value = file0.length > 0 ? file0 : record.assemblyDrawingNum;
        detailInfo.value[2].value = file1.length > 0 ? file1 : record.detailNum;
        detailInfo.value[3].value = file2.length > 0 ? file2 : record.processNum;
        detailInfo.value[4].value = record.processingCode;
        detailInfo.value[5].value = record.supplyMode;

        if (record.optional) {
          selectMaterialData = record.materials;
          optional.value = true;
          optionalData.value = JSON.parse(record.optional);
        } else {
          selectMaterialData = [];
          optional.value = false;
          optionalData.value = [];
        }

        //物料信息赋值
        materialData.value = record.materials.filter(
          (x) => x.tag === ArchitectureListMaterialTag.Assemble,
        );

        //安装信息
        processData.value = record.materials.filter(
          (x) => x.tag === ArchitectureListMaterialTag.Install,
        );

        //三维信息
        threeData.value = await getThreeUrlAsync(record.name, record.model, record.processingMode);
      }

      function showSheet(url) {
        openFileShow(true, {
          url: url,
        });
      }

      function optionalRowClick(record) {
        if (getOptionKeys().length == 0) {
          processData.value = selectMaterialData.filter(
            (x) => x.tag === ArchitectureListMaterialTag.Install,
          );
          return;
        }
        if (record.value != '无') {
          var a = record.value.split('+');
          if (a.length > 0) {
            processData.value = [];
            for (let item of a) {
              var filter = selectMaterialData.filter((x) => x.id == item);
              if (filter.length > 0) {
                processData.value.push(filter[0]);
              }
            }
          } else {
            processData.value = [];
          }
        } else {
          processData.value = [];
        }
      }

      function sheetInfo() {
        if (
          selectTreeNode == undefined ||
          ![
            '吊顶系统',
            '墙面系统',
            '地面系统',
            '厨房系统',
            '卫浴系统',
            '隔墙系统',
            '门窗系统',
          ].includes(selectTreeNode.node.name.props.name)
        ) {
          error('左侧树选择正确节点');
        } else {
          router.push({
            path: '/productManagement/architectureFileManage',
            query: {
              id: selectTreeNode.node.id,
              title: selectTreeNode.node.name.props.name,
              type: treeNodeType.value,
            },
          });
        }
      }

      function searchName(value) {
        searchInfo.searchValue = value;
        reload();
      }

      function searchModel(value) {
        searchInfo.searchCode = value;
        reload();
      }

      function selectChange() {
        searchInfo.status = publishSelect.value;
        reload();
      }

      function editData(record: Recordable) {
        if (record.status != 1000) {
          error('非待上市状态，不可编辑！');
          return;
        }

        openModal(true, {
          selectData: record,
          type: 'edit',
          title: '编辑',
          addEnable: true,
        });
      }

      function addData() {
        if (!selectTreeNode || !selectTreeNode.selected) {
          error('请选择左侧树节点！');
          return;
        }
        if (
          ![
            '吊顶系统',
            '墙面系统',
            '地面系统',
            '厨房系统',
            '卫浴系统',
            '隔墙系统',
            '门窗系统',
          ].includes(selectTreeNode.node.name.props.name)
        ) {
          error('左侧树请选择正确节点！');
        } else {
          openAddModal(true, {
            id: selectTreeNode.node.id,
            type: 'add',
            title: '新增',
            addEnable: false,
          });
        }
      }

      async function copyData() {
        var keys = getSelectRowKeys();
        if (keys.length == 0) {
          error('请选择需复制的模块');
          return;
        }
        try {
          await copyDataAsync(keys);
          reload().then(() => {
            success('复制成功');
          });
        } catch (e) {
          error('复制失败' + e);
        }
      }

      function deleteData() {
        var selectRows = getSelectRows();
        if (selectRows.length == 0) {
          error('请选择需删除数据');
          return;
        }
        var inMark = selectRows.find((x) => x.status === 0);
        if (inMark != undefined) {
          error('删除列表中包含上市模块');
          return;
        }
        var keys = selectRows.map((x) => x.id);
        Modal.confirm({
          title: () => '你想要删除这些产品吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            const data = await deletDataAsync(keys);
            if (data.success) {
              reload();
            } else {
              error(data.error);
            }
          },
          onCancel() {
            clearSelectedRowKeys();
          },
        });
      }

      function changeStatus(e) {
        var selectIds = getSelectRowKeys();
        if (selectIds.length == 0) {
          error('请选择数据');
          return;
        }
        let state;
        switch (e.key) {
          case '上市':
            state = ArchitectureListPublishStatus.InMark;
            break;
          case '待上市':
            state = ArchitectureListPublishStatus.DelayInMark;
            break;
          case '下市':
            state = ArchitectureListPublishStatus.OutMark;
            break;
          case '待下市':
            state = ArchitectureListPublishStatus.DelayOutMark;
            break;
        }
        Modal.confirm({
          title: () => '你想要让这些模块' + e.key + '吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            await updateDataStatusAsync({
              id: selectIds,
              status: state,
            });
            clearSelectedRowKeys();
            reload();
          },
          onCancel() {
            clearSelectedRowKeys();
          },
        });
      }

      function importExcel() {
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }

      function saveChanges(value) {
        if (value.success) {
          closeModal();
          reload().then(() => {
            // //刷新选中内容
            // if (selectIndex.value.index != -1) {
            //   var data = getDataSource();
            //   mainTableClick(data[selectIndex.value.index], selectIndex.value.index, null);
            // }
            success('保存成功');
          });
        } else {
          error('保存失败' + value.error);
        }
      }

      async function modifySystemRemark() {
        const remark = systemRemark.value;
        if (!selectTreeNode.selected) {
          return;
        }
        var selectedNode = selectTreeNode.node;
        var updateNode = new ArchitectureListTreeDto();
        updateNode.data = remark;
        updateNode.id = selectedNode.id;
        try {
          await updateTreeNodeAsync(updateNode);
          success('备注更新成功！');
        } catch {
          error('备注更新失败！');
        }
      }

      function selectSearchCollapsedClick() {
        selectSearchCollapsed.value = !selectSearchCollapsed.value;
      }

      return {
        viewer,
        fileInput,
        searchInfo,
        publishSelect,
        selectOptions,
        activeKey,
        detailInfo,
        materialData,
        processData,
        optionalData,
        optional,
        threeData,
        t,
        hasPermission,
        registerMainTable,
        rowClassName,
        registerMaterialTable,
        registerProcessingTable,
        registerOptionalTable,
        registerEditModal,
        registerAddModal,
        registerFileShowModal,
        handleFileChange,
        handleResizeColumn,
        createActions,
        mainTableClick,
        optionalRowClick,
        sheetInfo,
        searchName,
        searchModel,
        selectChange,
        addData,
        copyData,
        deleteData,
        importExcel,
        changeStatus,
        saveChanges,
        showSheet,
        toggleDom,
        systemRemark,
        modifySystemRemark,
        treeNodeType,
        selectSearchCollapsed,
        selectSearchCollapsedClick,
      };
    },
  });
</script>
<style scoped>
  .detailTable {
    width: 100%;
    background-color: white;
  }

  .detailTilte {
    width: 100px;
    height: auto;
    padding: 8px;
    border: 1px solid rgb(229, 231, 235);
    background-color: #0960bd;
    text-align: center;
    color: white;
  }

  .detailValue {
    height: auto;
    padding: 8px;
    border: 1px solid rgb(229, 231, 235);
    text-align: left;
    word-break: break-word;
  }

  :deep() .ant-table-tbody .selectwhite {
    background-color: white !important;
  }
  :deep() .ant-table-tbody .selectblue {
    background-color: rgb(227, 244, 252) !important;
  }
  /* :deep()
    .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: rgb(227, 244, 252);
    cursor: default;
  } */

  .custom-span {
    display: block;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -icab-text-overflow: ellipsis;
    -khtml-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
  }
</style>
