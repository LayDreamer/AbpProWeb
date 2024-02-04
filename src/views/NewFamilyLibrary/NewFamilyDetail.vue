<template>
  <div>
    <PageWrapper :title="fileName + `的资料`" contentBackground @back="goBack">
      <template #footer>
        <a-tabs default-active-key="detail" v-model:activeKey="currentKey" @change="tabChange">
          <a-tab-pane key="table" :tab="t('routes.newFamilyLibrary.moduleDetail')" />
          <a-tab-pane key="show" :tab="t('routes.newFamilyLibrary.moduleShow')" />
        </a-tabs>
      </template>
      <div class="pt-4 m-4 desc-wrap">
        <template v-if="currentKey == 'table'">
          <BasicTable @register="registerTable" @fetch-success="onFetchSuccess" />
        </template>

        <div v-else-if="currentKey == 'show'" class="desc-wrap" ref="viewer">
          <div class="w-full h-full">
            <iframe
              :src="
                `https://bds.chinayasha.com/bdsthreeviewservice/website/index.html#model=` +
                `https://bds.chinayasha.com/bdsfileservice/FamilyLib/Revit/` +
                fileName +
                `.glb`
              "
              style="height: 700px; width: 100%; border: 2px dashed rgb(156 163 175)"
            ></iframe>
          </div>

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
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { useFullscreen } from '@vueuse/core';
  import { Tag } from 'ant-design-vue';
  import { defineComponent, h, nextTick, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { getFamilyInfo } from './index';
  import { PageWrapper } from '/@/components/Page';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    components: {
      BasicTable,
      PageWrapper,
    },
    setup() {
      const go = useGo();
      const { t } = useI18n();
      const route = useRoute();
      const fileName = new URLSearchParams(window.location.search).get('msg')?.replace('.rfa', '');
      const userId = ref(route.params.data);
      const currentKey = ref('table');
      let url = '';
      const viewer = ref<Nullable<HTMLElement>>(null);
      const { toggle } = useFullscreen();
      const { toggle: toggleDom } = useFullscreen(viewer);
      const columns: BasicColumn[] = [
        {
          title: t('routes.newFamilyLibrary.attribute'),
          dataIndex: 'description',
          customRender: ({ record }) => {
            let text = '';
            let color = '';
            switch (record.description) {
              case 'C':
                text = '模块';
                color = 'yellow';
                break;
              case 'W':
                text = '物料';
                color = 'black';
                break;
              case 'X':
                text = '详图族';
                color = '#6495ED';
                break;
              default:
                text = '未知';
                color = 'red';
                break;
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
          title: t('routes.newFamilyLibrary.name'),
          dataIndex: 'displayName',
          width: 400,
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: {
                  textAlign: 'left !important',
                  textIndent: '35px',
                },
              },
              text,
            );
          },
        },
        {
          title: t('routes.newFamilyLibrary.typeOrCode'),
          dataIndex: 'number',
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
          title: t('routes.newFamilyLibrary.usage'),
          dataIndex: 'usage',
        },
        {
          title: t('routes.newFamilyLibrary.unit'),
          dataIndex: 'unit',
        },
        {
          title: t('routes.newFamilyLibrary.version'),
          dataIndex: 'version',
        },
      ];
      const [registerTable, { reload, expandAll }] = useTable({
        rowKey: 'id',
        striped: false,
        pagination: false,
        isTreeTable: true,
        columns: columns,
        api: getFamilyInfo,
        beforeFetch: () => {
          return userId.value;
        },
        afterFetch: (data) => {
          for (let item of data) {
            if (item.parent == null) {
              url = item.externalData;
            }
          }
        },
      });
      function goBack() {
        go('/familylibs/gyhNewFamilyLibs');
      }
      function tabChange(activeKey) {
        if (activeKey === 'show') {
        }
      }

      function onFetchSuccess() {
        nextTick(expandAll);
      }

      return {
        goBack,
        registerTable,
        reload,
        t,
        fileName,
        currentKey,
        tabChange,
        toggleDom,
        toggle,
        viewer,
        onFetchSuccess,
      };
    },
  });
</script>
