<template>
  <PageWrapper :title="fileName + `的资料`" contentBackground @back="goBack">
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey" @change="tabChange">
        <a-tab-pane key="table" :tab="t('routes.familylibs.productdetail')" />
        <a-tab-pane key="show" :tab="t('routes.familylibs.prodcutshow')" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'table'">
        <BasicTable @register="register" @fetch-success="onFetchSuccess" />
      </template>
      <template v-if="currentKey == 'show'">
        <div class="desc-wrap" style="height:600px">
          <div class="toolbar">
            <button class="toolbtn" id="up_button" @click="upclick">上</button>
            <button class="toolbtn" id="down_button" @click="buttomclick">下</button>
            <button class="toolbtn" id="left_button" @click="leftclick">左</button>
            <button class="toolbtn" id="right_button" @click="rightclick">右</button>
            <button class="toolbtn" id="front_button" @click="frontclick">前</button>
            <button class="toolbtn" id="back_button" @click="backclick">后</button>
            <button class="toolbtn" id="fit_button" @click="fitclick">
              <img src="../../assets/icons/home.svg" />
            </button>
            <button class="toolbtn" id="fullscrean_button" @click="toggleDom">
              <img src="../../assets/icons/fit.svg" />
            </button>
          </div>
          <div ref="viewer" />
        </div>
      </template>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick, ref, h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useGo } from '/@/hooks/web/usePage';
import { useTabs } from '/@/hooks/web/useTabs';
import { useFullscreen } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { Tabs, Tag } from 'ant-design-vue';
import { PageWrapper } from '/@/components/Page';
import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
import { FamilyLibDto } from '/@/services/ServiceProxies';
import { getProductModuleAsync } from './Index';
import {
  EmbeddedViewer,
  Camera,
  Coord3D,
  CameraMode,
  RGBAColor,
  RGBColor,
  EdgeSettings,
  SetExternalLibLocation,
} from 'online-3d-viewer';
export default defineComponent({
  name: 'gyhFamilyDetail',
  components: {
    PageWrapper,
    Tabs,
    BasicTable,
  },
  setup() {
    const { setTitle } = useTabs();
    const route = useRoute();
    const userId = ref(route.params.data);
    const fileName = new URLSearchParams(window.location.search).get('msg')?.replace('.rfa', '');
    const { t } = useI18n();
    const go = useGo();
    const currentKey = ref('table');
    const columns: BasicColumn[] = [
      {
        title: t('routes.familylibs.name'),
        dataIndex: 'displayName',
        width: 400,
        // align: "left",
        customRender: ({ text }) => {
          return h('div', {
                        style: {
                            textAlign: 'left !important',
                            textIndent: '35px',
                        },
                    }, text)
            },
      },
      {
        title: t('routes.familylibs.code'),
        dataIndex: 'number',
        // width:150,
      },
      {
        title: t('routes.familylibs.length'),
        dataIndex: 'length',
        // width: 50,
      },
      {
        title: t('routes.familylibs.width'),
        dataIndex: 'width',
        // width: 50,
      },
      {
        title: t('routes.familylibs.height'),
        dataIndex: 'height',
        // width: 50,
      },
      {
        title: t('routes.familylibs.version'),
        dataIndex: 'version',
        // width: 150,
      },
      {
        title: t('routes.familylibs.unit'),
        dataIndex: 'unit',
        // width: 150,
      },
      {
        title: t('routes.familylibs.tag'),
        dataIndex: 'description',
        // width: 150,
        customRender: ({ record }) => {
          let text = '';
          let color = '';
          switch (record.description) {
            case 'C':
              text = '产品';
              color = 'green';
              break;
            case 'M':
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
    ];
    const viewer = ref<Nullable<HTMLElement>>(null);
    const { toggle } = useFullscreen();
    const { toggle: toggleDom } = useFullscreen(viewer);
    let url = '';
    let embeddedViewer: EmbeddedViewer;
    const [register, { expandAll }] = useTable({
      api: getProductModuleAsync,
      beforeFetch: () => {
        return userId.value;
      },
      afterFetch: (data) => {
        let result: any = [];
        for (let item of data) {
          if (item.parent == null) {
            setChild(item);
            url = item.externalData;
            result.push(item);
            break;
          }
        }
        return result;
      },
      pagination: false,
      isTreeTable: true,
      striped:false,
      columns,
      rowKey: 'id',
    });

    onMounted(() => {
      setTitle('详情: ' + fileName);
    });

    function setChild(father: FamilyLibDto) {
      if (father.children) {
        if (father.children.length == 0) {
          father.children = undefined;
          return;
        } else {
          sortChild(father.children);
          for (let child of father.children) {
            if (child.children) {
              if (child.children.length === 0) {
                child.children = undefined;
              } else {
                setChild(child);
              }
            }
          }
        }
      }
    }

    function sortChild(data: any[]) {
      data.sort((a, b) => {
        if (a.description === b.description) {
          return a.displayName.localeCompare(b.displayName, 'zh-CN');
        } else {
          const order = ['C', 'M', 'W', 'X'];
          return order.indexOf(a.description) - order.indexOf(b.description);
        }
      });
    }

    function goBack() {
      go('/familylibs/gyhFamilyLibs');
    }

    function onFetchSuccess() {
      nextTick(expandAll);
    }

    function tabChange(activeKey) {
      if (activeKey === 'show') {
        nextTick(() => {
          SetExternalLibLocation('/@/../node_modules/online-3d-viewer/libs');
          const v = viewer.value;
          if (v) {
            embeddedViewer = new EmbeddedViewer(v, {
              camera: new Camera(
                new Coord3D(-1.5, 2.0, 3.0),
                new Coord3D(0.0, 0.0, 0.0),
                new Coord3D(0.0, 1.0, 0.0),
                45.0,
              ),
              cameraMode: CameraMode.Perspective,
              backgroundColor: new RGBAColor(255, 255, 255, 255),
              defaultColor: new RGBColor(200, 200, 200),
            });
            embeddedViewer.LoadModelFromUrlList([url]);
          }
        });
      }
    }

    function upclick() {
      embeddedViewer?.viewer?.FitModelOnDiretion('top', 1.0);
    }
    function buttomclick() {
      embeddedViewer?.viewer?.FitModelOnDiretion('buttom', 1.0);
    }
    function leftclick() {
      embeddedViewer?.viewer?.FitModelOnDiretion('left', 1.0);
    }
    function rightclick() {
      embeddedViewer?.viewer?.FitModelOnDiretion('right', 1.0);
    }
    function frontclick() {
      embeddedViewer?.viewer?.FitModelOnDiretion('front', 1.0);
    }
    function backclick() {
      embeddedViewer?.viewer?.FitModelOnDiretion('back', 1.0);
    }
    function fitclick() {
      embeddedViewer?.viewer?.FitModelToWindow(false);
    }

    return {
      fileName,
      currentKey,
      viewer,
      toggle,
      toggleDom,
      t,
      goBack,
      register,
      onFetchSuccess,
      tabChange,
      upclick,
      buttomclick,
      leftclick,
      rightclick,
      frontclick,
      backclick,
      fitclick,
    };
  },
});
</script>

<style>
.toolbar {
  display: flex;
  justify-content: flex-start;
  background-color: #f0f0f0;
  padding: 10px;
  /* box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); */
}

.toolbtn {
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toolbtn img {
  display: block;
  width: 50%;
  height: 50%;
}

.toolbtn:hover {
  background-color: #add8e6;
}

#viewer {
  width: 100%;
  min-height: 550px;
}
</style>
