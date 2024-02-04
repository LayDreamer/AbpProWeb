<template>
  <div class="m-4 mr-4 flex flex-col">
    <div class="h-30/30">
      <BasicTable
        :searchInfo="searchInfo"
        @register="registerTable"
        @resizeColumn="handleResizeColumn"
        @row-click="tableRowClick"
      >
        <template #toolbar>
          <a-input-search
            v-model:value="namevalue"
            placeholder="名称"
            allow-clear
            style="width: 200px"
            @search="searchName"
          />
          <a-input-search
            v-model:value="codevalue"
            placeholder="型号"
            style="width: 200px"
            allow-clear
            @search="searchCode"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <TableImg :size="90" :simpleShow="true" :imgList="[record.imagePath]" />
          </template>
          <template v-if="column.key === 'creationTime'">{{
            new Date(record.creationTime).toLocaleString()
          }}</template>
          <template v-else-if="column.key === 'lastModificationTime'">{{
            record.lastModificationTime === undefined
              ? ''
              : new Date(record.lastModificationTime).toLocaleString()
          }}</template>
          <template v-else-if="column.key === 'action'">
            <div @click.stop>
              <TableAction :actions="createActions(record)" />
            </div>
          </template>
        </template>
      </BasicTable>
      <input
        v-if="hasPermission('YaSha.DataManager.NewFamilyLib.Update')"
        type="file"
        ref="fileInput"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, onBeforeMount, onMounted, onBeforeUnmount, ref } from 'vue';
  import { BasicTable, BasicColumn, useTable, TableAction, TableImg } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getListByTreeId, uploadFamilyLibImage } from './index';
  import EventBus from '/@/utils/EventBus';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'NewFamilyLibrary',
    components: {
      BasicTable,
      TableAction,
      TableImg,
    },
    setup() {
      onBeforeMount(() => {
        EventBus.on('newFamilyTreeSelect', refreshTable);
      });
      onMounted(() => {});
      onBeforeUnmount(() => {
        EventBus.off('newFamilyTreeSelect', refreshTable);
      });
      const fileInput = ref<HTMLElement | null>(null);
      const select = ref();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const { t } = useI18n();
      const searchInfo = reactive<Recordable>({});
      const go = useGo();
      const { hasPermission } = usePermission();
      const [createContextMenu, destroyContextMenu] = useContextMenu();
      const treeRef = ref();
      const namevalue = ref<string>('');
      const codevalue = ref<string>('');
      const columns: BasicColumn[] = [
        {
          title: t('routes.newFamilyLibrary.illustration'),
          dataIndex: 'image',
          width: 150,
          customCell: (_) => ({
            onContextmenu: (e) => {
              if (hasPermission('YaSha.DataManager.NewFamilyLib.Update')) {
                const menu = [
                  {
                    label: '更新图片',
                    icon: 'material-symbols:upload-sharp',
                    handler: () => {
                      select.value = _;
                      let oBtn = fileInput.value as HTMLInputElement;
                      oBtn.click();
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
        },
        {
          title: t('routes.newFamilyLibrary.name'),
          dataIndex: 'displayName',
          sorter: true,
          resizable: true,
        },

        {
          title: t('routes.newFamilyLibrary.type'),
          dataIndex: 'type',
          resizable: true,
        },
        {
          title: t('routes.newFamilyLibrary.processType'),
          dataIndex: 'processMode',
        },
        {
          title: t('routes.newFamilyLibrary.length'),
          dataIndex: 'length',
        },
        {
          title: t('routes.newFamilyLibrary.width'),
          dataIndex: 'width',
        },

        {
          title: t('routes.newFamilyLibrary.height'),
          dataIndex: 'height',
        },
        {
          title: t('routes.newFamilyLibrary.notes'),
          dataIndex: 'notes',
        },
        {
          title: t('routes.newFamilyLibrary.path'),
          dataIndex: 'hierarchy',
        },
        {
          title: t('routes.newFamilyLibrary.creator'),
          dataIndex: 'uploadUser',
          sorter: true,
        },
        {
          title: t('routes.newFamilyLibrary.createTime'),
          dataIndex: 'creationTime',
          sorter: true,
        },
        {
          title: t('routes.newFamilyLibrary.updater'),
          dataIndex: 'updater',
          sorter: true,
        },
        {
          title: t('routes.newFamilyLibrary.updateTime'),
          dataIndex: 'updateTime',
          sorter: true,
        },
      ];
      const [registerTable, { reload }] = useTable({
        title: '列表',
        rowKey: 'id',
        rowSelection: { type: 'checkbox' },
        showTableSetting: true,
        striped: false,
        clickToRowSelect: false,
        isCanResizeParent: true,
        pagination: {
          pageSizeOptions: ['10', '50', '100', '300'],
        },
        columns: columns,
        api: getListByTreeId,
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
          title: '操作',
          dataIndex: 'action',
        },
      });

      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          if (
            files[0].name.includes('.jpg') ||
            files[0].name.includes('.png') ||
            files[0].name.includes('.jpeg')
          ) {
            const response = await uploadFamilyLibImage(select.value.id, {
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

      function tableRowClick() {}

      function searchName() {
        searchInfo.searchValue = namevalue.value;
        reload();
      }

      function searchCode() {
        searchInfo.searchCode = codevalue.value;
        reload();
      }

      function createActions(record) {
        return [
          {
            label: '详情',
            onClick: editData.bind(null, record),
          },
        ];
      }

      function editData(record: Recordable) {
        go('/familylibs/gyhNewFamilyDetail/' + record.id + '?msg=' + record.displayName);
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }
      function refreshTable(newFamilyTreeSelect) {
       
        treeRef.value = newFamilyTreeSelect;
        if (newFamilyTreeSelect) {
          searchInfo.key = newFamilyTreeSelect.node.id;
        }
        reload();
      }

      return {
        codevalue,
        namevalue,
        registerTable,
        searchInfo,
        columns,
        t,
        tableRowClick,
        searchName,
        searchCode,
        createActions,
        handleResizeColumn,
        hasPermission,
        handleFileChange,
        fileInput,
        menuDestory: (_, e) => {
          destroyContextMenu({
            event: e,
          });
        },
      };
    },
  });
</script>
