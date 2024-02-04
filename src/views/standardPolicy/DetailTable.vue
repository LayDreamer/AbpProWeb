<template>
  <div class="flex flex-col">
    <div class="flex flex-row" :class="{ 'ml-4': home, 'mb-4': !home }">
      <div
        class="h-40 w-full flex justify-center items-center"
        v-if="home"
        style="
          background-image: url('https://bds.chinayasha.com/bdsfileservice/SystemAssets/99878.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
        "
      >
        <div class="flex justify-center items-center">
          <a-input-search
            v-model:value="searchValue"
            size="large"
            :placeholder="searchPlaceOrder"
            style="width: 700px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3)"
            @search="homeSearch"
          >
            <template #addonBefore>
              <a-select v-model:value="treeSelectValue" :options="treeOptions" />
              <a-select
                v-if="treeSelectValue == '标准'"
                v-model:value="codeSelectValue"
                :options="codeOptions"
                style="margin-left: 10px; width: 100px"
              />
              <a-select
                v-if="treeSelectValue == '政策'"
                v-model:value="provinceSelect"
                :options="provinceOptions"
                style="margin-left: 10px; width: 150px"
                placeholder="选择省"
              />
            </template>
          </a-input-search>
        </div>
        <div class="absolute top-0 right-0">
          <a-button
            v-if="hasPermission('YaSha.DataManager.StandardPolicy.Create')"
            type="link"
            style="color: white"
            @click="exportExcel"
            >报表导出</a-button
          >
          <a-dropdown v-if="hasPermission('YaSha.DataManager.StandardPolicy.Create')">
            <template #overlay>
              <a-menu @click="addNew">
                <a-menu-item key="标准">标准</a-menu-item>
                <a-menu-item key="政策">政策</a-menu-item>
              </a-menu>
            </template>
            <a-button type="link" style="color: white">新增</a-button>
          </a-dropdown>
          <a-button type="link" style="color: white" @click="collectSearch">收藏列表</a-button>
        </div>
      </div>
      <div v-if="!home">
        <a-select
          style="width: 800px"
          v-model:value="themeSelectValue"
          mode="multiple"
          placeholder="请选择主题"
          :options="themeOptions"
          :max-tag-count="6"
          @change="themeSearch"
        >
          <template #maxTagPlaceholder="omittedValues">
            <span style="color: red">+ {{ omittedValues.length }} ...</span>
          </template>
        </a-select>
        <a-button
          type="primary"
          style="margin-left: 10px"
          v-if="hasPermission('YaSha.DataManager.StandardPolicy.Delete') && !collectShow"
          @click="toolbarDelete"
          >删除</a-button
        >
      </div>
    </div>
    <BasicTable
      v-if="!home"
      :searchInfo="tableSearchInfo"
      @register="registerTable"
      @resizeColumn="handleResizeColumn"
      @row-click="goDetail"
    >
      <template #tableTitle>
        <a-tooltip title="返回">
          <a-button class="custom-back" type="link" preIcon="ep:back" @click="backHome" />
        </a-tooltip>
        <label style="font-size: 18px; font-weight: bold">{{ navTitle }}</label>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div @click.stop>
            <TableAction :actions="createActions(record)" />
          </div>
        </template>
      </template>
    </BasicTable>

    <a-select
      v-if="collectShow"
      style="width: 800px; margin-top: 16px"
      v-model:value="policythemeSelectValue"
      mode="multiple"
      placeholder="请选择主题"
      :options="policythemeOptions"
      :max-tag-count="6"
      @change="collectPolicythemeSearch"
    >
      <template #maxTagPlaceholder="omittedValues">
        <span style="color: red">+ {{ omittedValues.length }} ...</span>
      </template>
    </a-select>

    <BasicTable
      v-if="collectShow"
      :searchInfo="tableSearchInfo"
      @register="registerPolicyTable"
      @resizeColumn="handleResizeColumn"
      style="margin-top: 10px"
      @row-click="goDetail"
    >
      <template #tableTitle>
        <div>{{ t('routes.standardPolicy.policyCollection') }}</div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div @click.stop>
            <TableAction :actions="createActions(record)" />
          </div>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { SelectProps } from 'ant-design-vue';
  import { Modal, Tag } from 'ant-design-vue';
  import { computed, createVNode, defineComponent, h, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { deleteStandardLibs, exportExcelAsync, getStandardAndPolicyTreesAsync } from './index';
  import {
    ActionItem,
    BasicTable,
    EditRecordRow,
    TableAction,
    useTable,
  } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    StandardAndPolicyCategory,
    StandardAndPolicySearchDto,
  } from '/@/services/ServiceProxies';
  import { getTreeAllDetails } from '/@/views/standardPolicy/index';
  export default defineComponent({
    name: 'ProductTable',
    components: {
      BasicTable,
      TableAction,
    },
    setup(_, { emit }) {
      const { createMessage: msg } = useMessage();
      const { error } = msg;
      const { t } = useI18n();
      const route = useRouter();
      const { hasPermission } = usePermission();
      const home = ref(true);
      const collectShow = ref(false);
      const isStandard = ref(true);
      const navTitle = ref('');
      const searchValue = ref('');
      const collectButtonInfo = ref({
        name: '收藏列表',
        select: false,
      });
      const searchPlaceOrder = computed(() => {
        if (treeSelectValue.value == '标准') {
          return '关键字：标题、发布单位、编号';
        } else {
          return '关键字：标题、发布单位';
        }
      });
      const treeOptions = ref<SelectProps['options']>([
        {
          label: '标准',
          value: '标准',
        },
        {
          label: '政策',
          value: '政策',
        },
      ]);
      const treeSelectValue = ref<any>('标准');
      const themeSelectValue = ref([]);
      const themeOptions = ref<SelectProps['options']>([]);
      const policythemeSelectValue = ref([]);
      const policythemeOptions = ref<SelectProps['options']>([]);
      const codeSelectValue = ref<any>(0);
      const codeOptions = ref<SelectProps['options']>([
        {
          label: '全部',
          value: 0,
        },
        {
          label: '国家标准',
          value: 1,
        },
        {
          label: '地方标准',
          value: 2,
        },
        {
          label: '行业标准',
          value: 4,
        },
        {
          label: '团体标准',
          value: 8,
        },
        {
          label: '企业标准',
          value: 16,
        },
      ]);
      const provinceSelect = ref<any>('全部');
      const provinceOptions = ref<SelectProps['options']>([
        {
          label: '全部',
          value: '全部',
        },
        {
          label: '国家级',
          value: '国家级',
        },
        {
          label: '北京市',
          value: '北京市',
        },
        {
          label: '天津市',
          value: '天津市',
        },
        {
          label: '河北省',
          value: '河北省',
        },
        {
          label: '山西省',
          value: '山西省',
        },
        {
          label: '内蒙古自治区',
          value: '内蒙古自治区',
        },
        {
          label: '辽宁省',
          value: '辽宁省',
        },
        {
          label: '吉林省',
          value: '吉林省',
        },
        {
          label: '黑龙江省',
          value: '黑龙江省',
        },
        {
          label: '上海市',
          value: '上海市',
        },
        {
          label: '江苏省',
          value: '江苏省',
        },
        {
          label: '浙江省',
          value: '浙江省',
        },
        {
          label: '安徽省',
          value: '安徽省',
        },
        {
          label: '福建省',
          value: '福建省',
        },
        {
          label: '江西省',
          value: '江西省',
        },
        {
          label: '山东省',
          value: '山东省',
        },
        {
          label: '河南省',
          value: '河南省',
        },
        {
          label: '湖北省',
          value: '湖北省',
        },
        {
          label: '湖南省',
          value: '湖南省',
        },
        {
          label: '广东省',
          value: '广东省',
        },
        {
          label: '广西壮族自治区',
          value: '广西壮族自治区',
        },
        {
          label: '海南省',
          value: '海南省',
        },
        {
          label: '重庆市',
          value: '重庆市',
        },
        {
          label: '四川省',
          value: '四川省',
        },
        {
          label: '贵州省',
          value: '贵州省',
        },
        {
          label: '云南省',
          value: '云南省',
        },
        {
          label: '西藏自治区',
          value: '西藏自治区',
        },
        {
          label: '陕西省',
          value: '陕西省',
        },
        {
          label: '甘肃省',
          value: '甘肃省',
        },
        {
          label: '青海省',
          value: '青海省',
        },
        {
          label: '宁夏回族自治区',
          value: '宁夏回族自治区',
        },
        {
          label: '新疆维吾尔自治区',
          value: '新疆维吾尔自治区',
        },
        {
          label: '台湾省',
          value: '台湾省',
        },
        {
          label: '香港特别行政区',
          value: '香港特别行政区',
        },
        {
          label: '澳门特别行政区',
          value: '澳门特别行政区',
        },
      ]);
      const tableSearchInfo = reactive<Recordable>({});
      const tableColumn = computed(() => {
        if (isStandard.value || collectShow.value) {
          return [
            {
              title: '标准编号',
              dataIndex: 'number',
              width: 200,
            },
            {
              title: '标准名称',
              dataIndex: 'name',
              width: 400,
            },
            {
              title: '主题',
              customRender: ({ record }) => {
                let group: any[] = [];
                for (let item of record.theme) {
                  group.push(h(Tag, { color: 'blue' }, () => item));
                }
                return h(
                  'div',
                  {
                    class: 'flex flex-row justify-center space-x-2 w',
                  },
                  group,
                );
              },
              width: 400,
              minWidth: 400,
              maxWidth: 600,
              resizable: true,
            },
            {
              title: '发布单位',
              dataIndex: 'publishingUnit',
            },
            {
              title: '发布日期',
              dataIndex: 'publishingDate',
              width: 100,
              sorter: true,
            },
            {
              title: '生效日期',
              dataIndex: 'implementationDate',
              width: 100,
              sorter: true,
            },
            {
              title: '状态',
              width: 100,
              customRender: ({ record }) => {
                let text = '计算失败';
                let color = 'black';
                var now = new Date();
                var pDate = new Date(record.publishingDate);
                var iDate = new Date(record.implementationDate);
                var lDate = new Date(record.loseDate);
                if (now > lDate) {
                  text = '失效';
                  color = '#f50';
                } else if (now > iDate) {
                  text = '现行';
                  color = 'blue';
                } else if (now > pDate) {
                  text = '即将实施';
                  color = '#87d068';
                }
                return h(
                  Tag,
                  {
                    color: color,
                  },
                  () => text,
                );
              },
            },
            {
              title: '标准分类',
              width: 100,
              customRender: ({ record }) => {
                let text = '';
                switch (record.standardCategory) {
                  case StandardAndPolicyCategory.GB:
                    text = '国家标准';
                    break;
                  case StandardAndPolicyCategory.JG:
                    text = '地方标准';
                    break;
                  case StandardAndPolicyCategory.DB:
                    text = '行业标准';
                    break;
                  case StandardAndPolicyCategory.TB:
                    text = '团体标准';
                    break;
                  case StandardAndPolicyCategory.QB:
                    text = '企业标准';
                    break;
                }
                return h(
                  Tag,
                  {
                    color: '#87d068',
                  },
                  () => text,
                );
              },
            },
          ];
        } else {
          return [
            {
              title: '标题',
              dataIndex: 'name',
              sorter: true,
              customRender: ({ text }) => {
                return h(
                  'div',
                  {
                    style: {
                      textAlign: 'left !important',
                    },
                  },
                  text,
                );
              },
            },
            {
              title: '关键字',
              customRender: ({ record }) => {
                let group: any[] = [];
                for (let item of record.theme) {
                  group.push(h(Tag, { color: 'blue' }, () => item));
                }
                return h(
                  'div',
                  {
                    class: 'flex flex-row justify-center space-x-2',
                  },
                  group,
                );
              },
              width: 350,
              minWidth: 400,
              maxWidth: 600,
              resizable: true,
            },
            {
              title: '发布单位',
              dataIndex: 'publishingUnit',
              width: 250,
            },
            {
              title: '发布日期',
              dataIndex: 'publishingDate',
              width: 100,
              sorter: true,
            },
            {
              title: '实施日期',
              dataIndex: 'implementationDate',
              width: 100,
              sorter: true,
            },
            {
              title: '状态',
              width: 100,
              customRender: ({ record }) => {
                let text = '计算失败';
                let color = 'black';
                var now = new Date();
                var pDate = new Date(record.publishingDate);
                var iDate = new Date(record.implementationDate);
                var lDate = new Date(record.loseDate);
                if (now > lDate) {
                  text = '失效';
                  color = '#f50';
                } else if (now > iDate) {
                  text = '现行';
                  color = 'blue';
                } else if (now > pDate) {
                  text = '即将实施';
                  color = '#87d068';
                }
                return h(
                  Tag,
                  {
                    color: color,
                  },
                  () => text,
                );
              },
            },
          ];
        }
      });
      const tablePolicyColumn = () => {
        return [
          {
            title: '标题',
            dataIndex: 'name',
            sorter: true,
            customRender: ({ text }) => {
              return h(
                'div',
                {
                  style: {
                    textAlign: 'left !important',
                  },
                },
                text,
              );
            },
          },
          {
            title: '关键字',
            customRender: ({ record }) => {
              let group: any[] = [];
              for (let item of record.theme) {
                group.push(h(Tag, { color: 'blue' }, () => item));
              }
              return h(
                'div',
                {
                  class: 'flex flex-row justify-center space-x-2',
                },
                group,
              );
            },
            width: 350,
            minWidth: 400,
            maxWidth: 600,
            resizable: true,
          },
          {
            title: '发布单位',
            dataIndex: 'publishingUnit',
            width: 250,
          },
          {
            title: '发布日期',
            dataIndex: 'publishingDate',
            width: 100,
            sorter: true,
          },
          {
            title: '实施日期',
            dataIndex: 'implementationDate',
            width: 100,
            sorter: true,
          },
          {
            title: '状态',
            width: 100,
            customRender: ({ record }) => {
              let text = '计算失败';
              let color = 'black';
              var now = new Date();
              var pDate = new Date(record.publishingDate);
              var iDate = new Date(record.implementationDate);
              var lDate = new Date(record.loseDate);
              if (now > lDate) {
                text = '失效';
                color = '#f50';
              } else if (now > iDate) {
                text = '现行';
                color = 'blue';
              } else if (now > pDate) {
                text = '即将实施';
                color = '#87d068';
              }
              return h(
                Tag,
                {
                  color: color,
                },
                () => text,
              );
            },
          },
        ];
      };

      let searchdto: StandardAndPolicySearchDto = new StandardAndPolicySearchDto();
      let collectPolicySearchDto: StandardAndPolicySearchDto = new StandardAndPolicySearchDto();

      const [registerTable, { reload, getSelectRows, clearSelectedRowKeys }] = useTable({
        rowKey: 'id',
        columns: tableColumn,
        rowSelection: { type: 'checkbox' },
        beforeFetch: (data) => {
          searchdto.skipCount = data.pageIndex;
          searchdto.maxResultCount = data.pageSize;
          searchdto.sorting = data.sorting;
          return searchdto;
        },
        api: getTreeAllDetails,
        afterFetch: async (data) => {
          let result: any[] = [];
          var themes = [] as any[];
          for (let item of data) {
            const formattedImplementationDate =
              item.lib.implementationDate !== undefined
                ? new Date(item.lib.implementationDate).toLocaleDateString()
                : undefined;
            const formattedPublishingDate =
              item.lib.publishingDate !== undefined
                ? new Date(item.lib.publishingDate).toLocaleDateString()
                : undefined;
            const formattedLoseDate =
              item.lib.loseDate !== undefined
                ? new Date(item.lib.loseDate).toLocaleDateString()
                : undefined;
            result.push({
              id: item.lib.id,
              name: item.lib.name,
              number: item.lib.number,
              industry: item.lib.industry,
              publishingUnit: item.lib.publishingUnit,
              publishingDate: formattedPublishingDate,
              implementationDate: formattedImplementationDate,
              imagePath: item.lib.imagePath,
              pdfPath: item.lib.pdfPath,
              linkPath: item.lib.linkPath,
              type: item.lib.type,
              status: item.lib.status,
              dispatchFont: item.lib.dispatchFont,
              loseDate: formattedLoseDate,
              standardCategory: item.lib.standardCategory,
              theme: item.themes,
            });
            for (let child of item.themes) {
              themes.push(child);
            }
          }

          let type = collectShow.value ? '标准' : isStandard.value ? '标准' : '政策';
          themeOptions.value = await setthemeOptions(type, themes);
          return result;
        },
        clickToRowSelect: false,
        showTableSetting: false,
        showIndexColumn: true,
        striped: false,
        loading: false,
        canResize: false,
        pagination: {
          pageSize: 100,
        },
        actionColumn: {
          width: 100,
          title: '详情',
          dataIndex: 'action',
        },
      });

      const [registerPolicyTable, { reload: policyReload }] = useTable({
        rowKey: 'id',
        columns: tablePolicyColumn(),
        rowSelection: { type: 'checkbox' },
        beforeFetch: (data) => {
          collectPolicySearchDto.skipCount = data.pageIndex;
          collectPolicySearchDto.maxResultCount = data.pageSize;
          collectPolicySearchDto.sorting = data.sorting;
          return collectPolicySearchDto;
        },
        api: getTreeAllDetails,
        afterFetch: async (data) => {
          let result: any[] = [];
          var themes = [] as any[];
          for (let item of data) {
            const formattedImplementationDate =
              item.lib.implementationDate !== undefined
                ? new Date(item.lib.implementationDate).toLocaleDateString()
                : undefined;
            const formattedPublishingDate =
              item.lib.publishingDate !== undefined
                ? new Date(item.lib.publishingDate).toLocaleDateString()
                : undefined;
            const formattedLoseDate =
              item.lib.loseDate !== undefined
                ? new Date(item.lib.loseDate).toLocaleDateString()
                : undefined;
            result.push({
              id: item.lib.id,
              name: item.lib.name,
              number: item.lib.number,
              industry: item.lib.industry,
              publishingUnit: item.lib.publishingUnit,
              publishingDate: formattedPublishingDate,
              implementationDate: formattedImplementationDate,
              imagePath: item.lib.imagePath,
              pdfPath: item.lib.pdfPath,
              linkPath: item.lib.linkPath,
              type: item.lib.type,
              status: item.lib.status,
              dispatchFont: item.lib.dispatchFont,
              loseDate: formattedLoseDate,
              standardCategory: item.lib.standardCategory,
              theme: item.themes,
            });
            for (let child of item.themes) {
              themes.push(child);
            }
          }
          policythemeOptions.value = await setthemeOptions('政策', themes);
          return result;
        },
        clickToRowSelect: false,
        showTableSetting: false,
        showIndexColumn: true,
        striped: false,
        loading: false,
        canResize: false,
        pagination: {
          pageSize: 100,
        },
        actionColumn: {
          width: 100,
          title: '详情',
          dataIndex: 'action',
        },
      });

      function createActions(record: EditRecordRow): ActionItem[] {
        return [
          {
            label: '编辑',
            onClick: editDetail.bind(null, record),
          },
        ];
      }

      function goDetail(record: Recordable) {
        route.push({
          path: '/standardPolicyManagement/standardDetail',
          query: {
            id: record.id,
            parentName: record.type,
          },
        });
      }

      function handleResizeColumn(w, col) {
        col.width = w;
      }

      async function setthemeOptions(type, themes) {
        themes = Array.from(new Set(themes));
        var result: any[] = [];
        await getStandardAndPolicyTreesAsync().then((resopone) => {
          var dtos = resopone.filter((x) => x.name == type);
          for (let dto of dtos) {
            if (dto.children) {
              for (let child of dto.children) {
                if (themes.includes(child.name)) {
                  result.push({
                    label: type + ': ' + child.name,
                    value: child.id,
                  });
                }
              }
            }
          }
        });
        return result;
      }

      function clearSetValue() {
        navTitle.value = '';
        themeSelectValue.value = [];
        policythemeSelectValue.value = [];
        collectShow.value = false;
      }

      function homeSearch(searchData) {
        clearSetValue();
        if (treeSelectValue.value == '标准') isStandard.value = true;
        else if (treeSelectValue.value == '政策') isStandard.value = false;
        searchdto.id = '';
        searchdto.type = treeSelectValue.value;
        searchdto.category = isStandard.value ? codeSelectValue.value : 0;
        searchdto.search = searchData;
        searchdto.province = isStandard.value ? '' : provinceSelect.value;
        searchdto.isCollect = false;
        searchdto.themes = [];
        fatherGoDetail();
      }

      function moreSearch(data) {
        clearSetValue();
        if (data.parentName == '标准') isStandard.value = true;
        else if (data.parentName == '政策') isStandard.value = false;
        navTitle.value = data.title;
        searchdto.id = data.id;
        searchdto.type = data.parentName;
        searchdto.category = 0;
        searchdto.search = '';
        searchdto.province = '';
        searchdto.isCollect = false;
        searchdto.themes = [];
        fatherGoDetail();
      }

      function collectSearch() {
        clearSetValue();
        collectShow.value = true;
        isStandard.value = true;
        searchdto.id = '';
        searchdto.type = '标准';
        searchdto.category = 0;
        searchdto.search = '';
        searchdto.province = '';
        searchdto.isCollect = true;
        searchdto.themes = [];

        collectPolicySearchDto.id = '';
        collectPolicySearchDto.type = '政策';
        collectPolicySearchDto.category = 0;
        collectPolicySearchDto.search = '';
        collectPolicySearchDto.province = '';
        collectPolicySearchDto.isCollect = true;
        collectPolicySearchDto.themes = [];

        fatherGoDetail(true);
      }

      function themeSearch(theme) {
        searchdto.themes = theme;
        reload();
      }

      function collectPolicythemeSearch(theme) {
        collectPolicySearchDto.themes = theme;
        policyReload();
      }

      function fatherGoDetail(collect = false) {
        if (!home.value) {
          setTimeout(() => {
            reload();
            if (collect) {
              setTimeout(() => {
                policyReload();
              }, 50);
            }
          }, 50);
          return;
        }
        home.value = false;
        emit('detail', '');
      }

      function backHome() {
        home.value = true;
        clearSetValue();
        emit('backHome', '');
      }

      function addNew(e) {
        emit('add', {
          type: e.key,
        });
      }

      function editDetail(record: Recordable) {
        emit('edit', {
          table: record,
        });
      }

      function toolbarDelete() {
        var value = getSelectRows();
        if (value.length == 0) {
          error('请选择需删除政策');
          return;
        }
        Modal.confirm({
          title: () => '你想要删除这些政策吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            var keys = value.map((x) => x.id);
            await deleteStandardLibs(keys);
            reload();
          },
          onCancel() {
            clearSelectedRowKeys();
          },
        });
      }

      async function exportExcel() {
        await exportExcelAsync();
      }

      return {
        home,
        searchPlaceOrder,
        navTitle,
        treeOptions,
        collectShow,
        treeSelectValue,
        codeOptions,
        codeSelectValue,
        themeOptions,
        themeSelectValue,
        provinceSelect,
        provinceOptions,
        searchValue,
        collectButtonInfo,
        tableSearchInfo,
        policythemeOptions,
        policythemeSelectValue,
        h,
        t,
        hasPermission,
        registerTable,
        registerPolicyTable,
        createActions,
        handleResizeColumn,
        backHome,
        addNew,
        toolbarDelete,
        goDetail,
        homeSearch,
        moreSearch,
        collectSearch,
        themeSearch,
        collectPolicythemeSearch,
        exportExcel,
      };
    },
  });
</script>
<style scoped>
  .custom-back :deep() .app-iconify {
    font-size: 27px !important;
    display: block !important;
    line-height: 0;
  }
  .active {
    background-color: rgb(24, 166, 137);
    color: white !important;
  }

  .homeTable {
    margin-left: 16px;
  }

  .detailTable {
    margin-top: 16px;
  }
</style>
