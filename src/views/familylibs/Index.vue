<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <FamilyTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      @row-click="menuDestory"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <TableImg :size="90" :simpleShow="true" :imgList="[record.imagePath]" />
        </template>
        <template v-else-if="column.key === 'creationTime'">
          {{ new Date(record.creationTime).toLocaleString() }}
        </template>
        <template v-else-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: t('routes.familylibs.detail'),
                icon: 'clarity:info-standard-line',
                tooltip: t('routes.familylibs.detailInfo'),
                onClick: handleView.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <input
      v-if="hasPermission('YaSha.DataManager.FamilyLib.Update')"
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
    />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { PageWrapper } from '/@/components/Page';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    BasicTable,
    BasicColumn,
    FormSchema,
    useTable,
    TableImg,
    TableAction,
  } from '/@/components/Table';
  import { IOrderNotificationSearchDto } from '/@/services/ServiceProxies';
  import FamilyTree from './FamilyTree.vue';
  import { getProductLibsAsync, uploadFamilyLibImage } from './Index';
  export default defineComponent({
    name: 'FamilyLibsManagement',
    components: {
      PageWrapper,
      FamilyTree,
      BasicTable,
      TableImg,
      TableAction,
    },
    setup() {
      const { t } = useI18n();
      const { hasPermission } = usePermission();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const go = useGo();
      const fileInput = ref<HTMLElement | null>(null);
      const [createContextMenu, destroyContextMenu] = useContextMenu();
      const select = ref();
      const columns: BasicColumn[] = [
        {
          title: t('routes.familylibs.productName'),
          dataIndex: 'displayName',
          sorter: true,
        },
        {
          title: t('routes.familylibs.productImg'),
          dataIndex: 'image',
          width: 150,
          customCell: (_) => ({
            onContextmenu: (e) => {
              if (hasPermission('YaSha.DataManager.FamilyLib.Update')) {
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
          title: t('routes.familylibs.prodcutUploadUser'),
          dataIndex: 'uploadUser',
          width: 100,
        },
        {
          title: t('routes.familylibs.productUploadHierarchy'),
          dataIndex: 'hierarchy',
        },
        {
          title: t('routes.familylibs.productCreatTime'),
          dataIndex: 'creationTime',
          sorter: true,
          width: 150,
        },
      ];
      const searchFormSchema: FormSchema[] = [
        {
          field: 'searchValue',
          label: t('routes.familylibs.name'),
          component: 'Input',
          colProps: {
            span: 8,
          },
        },
        {
          field: 'searchCode',
          label: t('routes.familylibs.code'),
          component: 'Input',
          colProps: {
            span: 8,
          },
        },
      ];
      const searchInfo = reactive<Recordable>({});

      const [registerTable, { reload }] = useTable({
        title: t('routes.familylibs.productlist'),
        beforeFetch: (data) => {
          const searchDto: IOrderNotificationSearchDto = {
            maxResultCount: data.pageSize,
            skipCount: data.pageIndex,
            sorting: data.sorting,
            key: data.key,
            searchValue: data.searchValue,
            searchCode: data.searchCode,
          };
          return searchDto;
        },
        api: getProductLibsAsync,
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
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        showIndexColumn: true,
        striped: false,
        loading: true,
        handleSearchInfoFn(info) {
          return info;
        },
        actionColumn: {
          width: 100,
          title: t('routes.familylibs.detail'),
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
      function handleSelect(key = '') {
        if (key) {
          searchInfo.key = key;
        }
        reload();
      }

      function handleView(record: Recordable) {
        go('/familylibs/gyhFamilyDetail/' + record.id + '?msg=' + record.displayName);
      }

      onMounted(async () => {
        //选中上次的tree key
      });

      return {
        searchInfo,
        fileInput,
        handleFileChange,
        t,
        hasPermission,
        registerTable,
        handleSelect,
        handleView,
        menuDestory: (_, e) => {
          destroyContextMenu({
            event: e,
          });
        },
      };
    },
  });
</script>
