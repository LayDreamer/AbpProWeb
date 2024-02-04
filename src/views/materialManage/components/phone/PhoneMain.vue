<template>
  <toolBar
    :view="currentView"
    :shopNum="shopList.length"
    @event="toolBarClick"
    @back="toolBarBack"
    ref="toolbarRef"
  >
    <wxScroll @refresh="phoneRefresh" v-model:loadMore="loadMore" ref="wxScroll">
      <div class="grid grid-cols-3 gap-2" v-show="currentView == 'main'">
        <a-card
          v-for="item in mainData"
          :title="null"
          :body-style="{ padding: '0px', height: '150px' }"
          style="height: max-content"
          @click="detailClick(item)"
        >
          <div class="flex w-full h-full">
            <img :src="item.materialImageUrl" alt="img" style="width: 100%; height: 100%" />
          </div>
          <div class="phone-card-similar" v-if="item.similarity">
            <span>{{ item.similarity }}%</span>
          </div>
          <div
            class="phone-card-picker"
            style="border-radius: 8px; border: 1px solid #3774c5; background: white"
            v-if="!item.picker"
            @click.stop="pickerMaterial(item)"
          >
            <span class="iconify" data-icon="mdi:add-bold" style="font-size: 16px"></span>
          </div>
          <div class="phone-card-picker" v-if="item.picker">
            <span class="iconify" data-icon="fa:check" style="font-size: 16px"></span>
          </div>
          <div class="phone-card-describe">
            <span>{{ item.materialType.replace('（', '(').replace('）', ')') }}</span>
            <span>{{ item.materialTexture }}</span>
            <span>{{ item.materialSurface }}</span>
          </div>
        </a-card>
        <div class="drawer" v-if="phoneMenuShow">
          <div class="mask-show" @click="maskClick"></div>
          <div class="drawer-main">
            <div v-for="(item, index) in selectSearchList" class="phone-search-type-content">
              <span>{{ item.title }}</span>
              <div style="border: 1px solid #ccc"></div>
              <div class="phone-search-type-body">
                <div
                  v-for="select in item.data"
                  :class="searchPhoneTabTheme(select)"
                  @click="selectChange(item, select)"
                  >{{ select.name }}</div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <Detail
        :init-data="detailData"
        v-show="currentView == 'detail'"
        @detailPicker="detailPicker"
      ></Detail>
      <Shop
        v-show="currentView == 'shop'"
        v-model:init-data="shopList"
        @shopdelete="shopdelete"
      ></Shop>
    </wxScroll>
    <CameraResult
      ref="cameraresult"
      v-show="currentView == 'main'"
      @clipResult="imageSearch"
    ></CameraResult>
    <Loading :loading="loading" :absolute="absolute" :tip="tip" />
  </toolBar>
</template>
<script lang="ts">
  import { Card } from 'ant-design-vue';
import { v4 as guid } from 'uuid';
import { defineComponent, onMounted, reactive, ref, toRefs, watch, watchEffect } from 'vue';
import {
carmeraSearch,
imageCompressor,
initSearchData,
MaterialManageHomeDto,
pageHomeData
} from '../../index';
import CameraResult from './PhoneCamera.vue';
import Detail from './PhoneDetail.vue';
import Shop from './PhoneShop.vue';
import toolBar from './PhoneToolBar.vue';
import wxScroll from './PullRefresh.vue';
import { Loading } from '/@/components/Loading';
import { MATERIALMANAGE_KEY } from '/@/enums/cacheEnum';
import { MaterialManageHomeSearchDto } from '/@/services/ServiceProxies';
import { Persistent } from '/@/utils/cache/persistent';
  export default defineComponent({
    name: 'MaterialLibrayHome',
    components: { ACard: Card, Loading, wxScroll, toolBar, Detail, CameraResult, Shop },
    setup() {
      onMounted(() => {
        const value = Persistent.getMaterialManage(MATERIALMANAGE_KEY);
        if (value) {
          shopList.value = value;
        }
      });
      const toolbarRef = ref();
      const wxScroll = ref();
      const cameraresult = ref();
      const selectSearchList = ref<any[]>([]);
      selectSearchList.value = initSearchData();
      let currentPage = 1;
      let previousView = '';
      const currentView = ref('main');
      const loadMore = ref('');
      const compState = reactive({
        absolute: true,
        loading: false,
        tip: '加载中...',
      });
      let searchBody = new MaterialManageHomeSearchDto();
      const mainData = ref<any[]>([]);
      const phoneMenuShow = ref(false);
      const shopList = ref<any[]>([]);
      const detailData = ref(new MaterialManageHomeDto(undefined, false));
      const searchPhoneTabTheme = (data) => {
        if (!data.active && !data.invalid) {
          return 'phone-search-type-item';
        }
        if (data.active && !data.invalid) {
          return 'phone-search-type-item phone-search-type-item-active';
        }

        if (!data.active && data.invalid) {
          return 'phone-search-type-item phone-search-type-item-invalid';
        }
      };

      const searchByInput = async (value) => {
        currentPage = 1;
        mainData.value = [];
        //清除已有状态
        selectSearchList.value.forEach((x) => {
          x.data.forEach((y) => {
            if (y.name == '全部') {
              y.active = true;
            } else {
              y.active = false;
            }
          });
        });
        searchBody.search = value;
        searchBody.materialType = [];
        searchBody.materialTexture = [];
        searchBody.materialSurface = [];
        await initSearchToolBarAndMainData();
      };

      const selectChange = async (list, value) => {
        //无效的不能点击
        if (value.invalid) return;

        if (list.title == '材质类型') {
          //点击了全部
          if (value.name == '全部') {
            //清空除全部以为的标签
            list.data.forEach((x) => {
              x.active = false;
            });
            searchBody.materialType = [];
            //选中全部
            if (!value.active) {
              value.active = true;
            }
          } else {
            //清楚全部选中的状态
            list.data.forEach((x) => {
              if (x.name == '全部' && x.active) {
                x.active = false;
              }
            });
            //判断是否为空
            if (!searchBody.materialType) {
              searchBody.materialType = [];
            }
            //没有选中则选中
            if (!value.active) {
              value.active = true;
              searchBody.materialType?.push(value.name);
            } else {
              //再次点击取消选中
              value.active = false;
              searchBody.materialType = searchBody.materialType.filter((x) => x != value.name);
              //如果除全部以为选中为空了 选中全部
              if (searchBody.materialType.length == 0) {
                list.data.forEach((x) => {
                  if (x.name == '全部') {
                    x.active = true;
                  }
                });
              }
            }
          }
        } else if (list.title == '材质纹理') {
          if (value.name == '全部') {
            list.data.forEach((x) => {
              x.active = false;
            });
            searchBody.materialTexture = [];
            if (!value.active) {
              value.active = true;
            }
          } else {
            list.data.forEach((x) => {
              if (x.name == '全部' && x.active) {
                x.active = false;
              }
            });
            if (!searchBody.materialTexture) {
              searchBody.materialTexture = [];
            }
            if (!value.active) {
              value.active = true;
              searchBody.materialTexture?.push(value.name);
            } else {
              value.active = false;
              searchBody.materialTexture = searchBody.materialTexture.filter(
                (x) => x != value.name,
              );
              if (searchBody.materialTexture.length == 0) {
                list.data.forEach((x) => {
                  if (x.name == '全部') {
                    x.active = true;
                  }
                });
              }
            }
          }
        } else {
          if (value.name == '全部') {
            list.data.forEach((x) => {
              x.active = false;
            });
            searchBody.materialSurface = [];
            if (!value.active) {
              value.active = true;
            }
          } else {
            list.data.forEach((x) => {
              if (x.name == '全部' && x.active) {
                x.active = false;
              }
            });
            if (!searchBody.materialSurface) {
              searchBody.materialSurface = [];
            }
            if (!value.active) {
              value.active = true;
              searchBody.materialSurface?.push(value.name);
            } else {
              value.active = false;
              searchBody.materialSurface = searchBody.materialSurface.filter(
                (x) => x != value.name,
              );
              if (searchBody.materialSurface.length == 0) {
                list.data.forEach((x) => {
                  if (x.name == '全部') {
                    x.active = true;
                  }
                });
              }
            }
          }
        }
        //console.log(searchBody);
        currentPage = 1;
        mainData.value = [];
        await initSearchToolBarAndMainData();
      };

      const initSearchToolBarAndMainData = async () => {
        searchBody.skipCount = currentPage;
        searchBody.maxResultCount = 21;
        let total = 0;
        await pageHomeData(searchBody)
          .then((response) => {
            if (response) {
              if (response.materialTypes) {
                selectSearchList.value[0].data.forEach((x) => {
                  if (
                    x.name == '全部' ||
                    (response.materialTypes != undefined && response.materialTypes.includes(x.name))
                  ) {
                    x.invalid = false;
                  } else {
                    //如果选中了但后端返回里没有则先取消选中  出现原因材质类型选了PVC（油性）PET
                    //多选时PVC(油性)下面有皮纹 PET下面没有 则要先对选中状态清空
                    if (x.active) {
                      x.active = false;
                    }
                    x.invalid = true;
                  }
                });
              }

              if (response.materialTextures) {
                selectSearchList.value[1].data.forEach((x) => {
                  if (
                    x.name == '全部' ||
                    (response.materialTextures != undefined &&
                      response.materialTextures.includes(x.name))
                  ) {
                    x.invalid = false;
                  } else {
                    if (x.active) {
                      x.active = false;
                    }
                    x.invalid = true;
                  }
                });
              }

              if (response.materialSurfaces) {
                selectSearchList.value[2].data.forEach((x) => {
                  if (
                    x.name == '全部' ||
                    (response.materialSurfaces != undefined &&
                      response.materialSurfaces.includes(x.name))
                  ) {
                    x.invalid = false;
                  } else {
                    if (x.active) {
                      x.active = false;
                    }
                    x.invalid = true;
                  }
                });
              }

              if (response.items) {
                total = response.items.length;
                for (let item of response.items) {
                  if (shopList.value.includes(item.id))
                    mainData.value.push(new MaterialManageHomeDto(item, true));
                  else mainData.value.push(new MaterialManageHomeDto(item, false));
                }
              }
            }
            compState.loading = false;
          })
          .catch(() => {
            compState.loading = false;
          });
        return total;
      };

      watch(loadMore, async (newVal) => {
        if (newVal == 'try') {
          setTimeout(async () => {
            currentPage++;
            var total = await initSearchToolBarAndMainData();
            if (total == 0) {
              loadMore.value = 'end';
            } else {
              loadMore.value = 'clear';
            }
          }, 100);
        }
      });

      watch(currentView, (v, o) => {
        previousView = o;
      });

      watchEffect(async () => {
        compState.loading = true;
        await initSearchToolBarAndMainData();
      });

      const detailClick = (data) => {
        detailData.value = data;
        setTimeout(() => {
          if (toolbarRef.value) {
            toolbarRef.value.closeToolBarSearch();
          }
          currentView.value = 'detail';
        }, 50);
      };

      const searchByCamera = async (file) => {
        currentPage = 1;
        mainData.value = [];
        //清除已有状态
        selectSearchList.value.forEach((x) => {
          x.data.forEach((y) => {
            if (y.name == '全部') {
              y.active = true;
            } else {
              y.active = false;
            }
          });
        });
        searchBody.materialType = [];
        searchBody.materialTexture = [];
        searchBody.materialSurface = [];
        searchBody.search = '';
        searchBody.cameraSearchKey = guid();
        var maxSize = 3 * 1024 * 1024;
        //压缩图片
        if (file.size > maxSize) {
          await imageCompressor(file, 'file', maxSize).then(async (compressfile: any) => {
            if (compressfile) {
              await carmeraSearch(searchBody.cameraSearchKey, {
                data: compressfile,
                fileName: compressfile.name,
              }).then(async () => {
                await initSearchToolBarAndMainData();
              });
            }
          });
        } else {
          await carmeraSearch(searchBody.cameraSearchKey, { data: file, fileName: file.name }).then(
            async () => {
              await initSearchToolBarAndMainData();
            },
          );
        }
      };

      const maskClick = () => {
        wxScroll.value.menuSearch = false;
        phoneMenuShow.value = false;
      };

      const pickerMaterial = (item) => {
        item.picker = true;
        shopList.value.push(item.id);
        Persistent.setMaterialManage(MATERIALMANAGE_KEY, shopList.value);
      };

      const detailPicker = (v) => {
        shopList.value.push(detailData.value.id);
        detailData.value.picker = v;
        Persistent.setMaterialManage(MATERIALMANAGE_KEY, shopList.value);
      };

      const resetMainSearchBody = () => {
        currentPage = 1;
        mainData.value = [];
        //清除已有状态
        selectSearchList.value.forEach((x) => {
          x.data.forEach((y) => {
            if (y.name == '全部') {
              y.active = true;
            } else {
              y.active = false;
            }
          });
        });
        searchBody.cameraSearchKey = '';
        searchBody.search = '';
        searchBody.materialType = [];
        searchBody.materialTexture = [];
        searchBody.materialSurface = [];
      };

      const phoneRefresh = async (fn) => {
        resetMainSearchBody();
        cameraresult.value.reset();
        await initSearchToolBarAndMainData().then(() => {
          setTimeout(() => {
            fn();
          }, 100);
        });
      };

      const toolBarClick = (e) => {
        if (e.type == 'menu') {
          setTimeout(() => {
            if (!phoneMenuShow.value) {
              wxScroll.value.menuSearch = true;
            } else {
              wxScroll.value.menuSearch = false;
            }
            currentView.value = 'main';
            phoneMenuShow.value = !phoneMenuShow.value;
          }, 10);
        } else if (e.type == 'home') {
          setTimeout(async () => {
            resetMainSearchBody();
            cameraresult.value.reset();
            currentView.value = 'main';
            await initSearchToolBarAndMainData();
          }, 10);
        } else if (e.type == 'camera') {
          if (cameraresult.value) {
            setTimeout(() => {
              currentView.value = 'main';
              cameraresult.value.cameraSearch();
            }, 10);
          }
        } else if (e.type == 'searchshow') {
          currentView.value = 'main';
        } else if (e.type == 'search') {
          searchByInput(e.data);
        } else if (e.type == 'shop') {
          currentView.value = 'shop';
        }
      };

      const imageSearch = async (file) => {
        await searchByCamera(file);
      };

      const shopdelete = (data) => {
        if (data.id) {
          mainData.value.forEach((x) => {
            if (x.id == data.id) {
              x.picker = false;
            }
          });
        }
        data.fn();
        Persistent.setMaterialManage(MATERIALMANAGE_KEY, shopList.value);
      };

      const toolBarBack = () => {
        if (currentView.value == 'detail') {
          setTimeout(() => {
            currentView.value = 'main';
          }, 10);
        } else if (currentView.value == 'shop') {
          setTimeout(() => {
            currentView.value = previousView;
          }, 10);
        }
      };

      return {
        toolbarRef,
        wxScroll,
        cameraresult,
        loadMore,
        mainData,
        selectSearchList,
        phoneMenuShow,
        shopList,
        currentView,
        detailData,
        selectChange,
        searchPhoneTabTheme,
        detailClick,
        maskClick,
        pickerMaterial,
        phoneRefresh,
        toolBarClick,
        imageSearch,
        detailPicker,
        shopdelete,
        toolBarBack,
        ...toRefs(compState),
      };
    },
  });
</script>
<style scoped>
  .phone-card-similar {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #2eb0c2;
    background: rgba(242, 242, 242, 0.38);
  }

  .phone-card-picker {
    position: absolute;
    bottom: 6px;
    right: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #3774c5;
  }

  .phone-card-describe {
    position: absolute;
    bottom: 3px;
    left: 3px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.99);
    /* mix-blend-mode: difference; */
  }

  .drawer {
    .mask-show {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.45);
      opacity: 1;
      transition: opacity 0.5s;
    }
    .drawer-main {
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 70%;
      padding: 3rem 0.5rem;
      height: 100%;
      background: rgb(64, 64, 64);
      transition: all 0.5s;
    }
    .phone-search-type-content {
      font-size: 16px;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      color: #f2f2f2;
      display: flex;
      flex-direction: column;
      margin-top: 12px;
    }
    .phone-search-type-body {
      display: flex;
      flex-wrap: wrap;
    }

    .phone-search-type-item {
      margin-left: 8px;
      margin-top: 8px;
      padding: 4px;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .phone-search-type-item-active {
      background-color: #3774c5;
      color: #fff;
    }
    .phone-search-type-item-invalid {
      color: #8c8d8f;
    }
  }
</style>
