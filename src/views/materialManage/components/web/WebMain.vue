<template>
  <div class="flex flex-col h-full px-2">
    <Search
      v-model:showImg="showImgRef"
      @searchByInput="searchByInput"
      @searchByCamera="searchByCamera"
    ></Search>
    <div class="search-content">
      <div class="search-top-area">
        <div class="search-top-area-right">
          <div
            v-if="showImgRef != 'none'"
            class="search-top-area-right-imgbutton"
            :style="
              showImgRef == 'open'
                ? ' background: rgb(46, 176, 194)'
                : 'background: rgb(115, 109, 109)'
            "
            @click="imgLevitateClick"
            >原图悬浮</div
          >
          <div style="cursor: pointer" @click="selectSearchCollapsedClick">
            <div v-if="selectSearchCollapsed">
              <span
                class="iconify"
                data-icon="icon-park-outline:down"
                style="font-size: 32px"
              ></span>
            </div>
            <div v-else>
              <span
                class="iconify"
                data-icon="icon-park-outline:left"
                style="font-size: 32px"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div class="search-bottom-area" v-if="selectSearchCollapsed">
        <div
          v-for="(item, index) in selectSearchList"
          class="search-bottom-area-row"
          :style="{ borderBottom: index != 2 ? ' 1px dashed rgb(215, 215, 215)' : 'none' }"
        >
          <span class="row-name">{{ item.title }}:</span>
          <div class="flex">
            <div
              v-for="select in item.data"
              :class="searchTabTheme(select)"
              @click="selectChange(item, select)"
              >{{ select.name }}</div
            >
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-5 gap-3">
      <Loading :loading="loading" :absolute="absolute" :tip="tip" />
      <a-card
        v-for="item in mainData"
        hoverable
        :title="null"
        :body-style="{ padding: '0px', height: '200px' }"
        style="border-radius: 8px; height: max-content"
        @click="detailClick(item)"
      >
        <div class="flex w-full h-full">
          <img
            :src="item.materialImageUrl"
            style="width: 60%; border-bottom-left-radius: 8px; border-top-left-radius: 8px"
          />
          <div class="flex-1 flex flex-col ml-2">
            <div v-if="item.similarity" class="h-3/10 flex items-center">
              <span
                style="
                  font-size: 20px;
                  font-weight: 700;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #2eb0c2;
                "
                >相似度{{ item.similarity }}%</span
              >
            </div>
            <div
              class="card-describe-content"
              :class="{ 'h-full': !item.similarity, 'h-7/10': item.similarity }"
            >
              <div class="flex mt-1">
                <span class="card-describe-title">类型: </span>
                <span>{{ item.materialType }}</span>
              </div>
              <div class="flex mt-1">
                <span class="card-describe-title">纹理: </span>
                <span>{{ item.materialTexture }}</span>
              </div>
              <div class="flex mt=1">
                <span class="card-describe-title">质感: </span>
                <span>{{ item.materialSurface }}</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <div class="flex justify-end mt-4 mb-4">
      <a-pagination
        v-model:current="pageRef.current"
        v-model:pageSize="pageRef.pageSize"
        show-quick-jumper
        showSizeChanger
        :total="pageRef.total"
        :page-size-options="['20', '60', '100']"
        :show-total="(total) => `共 ${total} 条数据`"
      >
        <template #buildOptionText="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>
<script lang="ts">
  import { Card } from 'ant-design-vue';
import { v4 as guid } from 'uuid';
import { defineComponent, reactive, ref, toRefs, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { carmeraSearch, imageCompressor, initSearchData, pageHomeData } from '../../index';
import Search from './WebSearch.vue';
import { Loading } from '/@/components/Loading';
import { MaterialManageHomeSearchDto } from '/@/services/ServiceProxies';

  export default defineComponent({
    name: 'MaterialLibrayHome',
    components: { Search, ACard: Card, Loading },
    setup() {
      const router = useRouter();
      const compState = reactive({
        absolute: true,
        loading: false,
        tip: '加载中...',
      });
      const showImgRef = ref('none');
      const selectSearchCollapsed = ref(true);
      const selectSearchList = ref<any[]>([]);
      selectSearchList.value = initSearchData();
      const pageRef = ref({
        current: 1,
        pageSize: 20,
        total: 0,
      });
      let searchBody = new MaterialManageHomeSearchDto();
      const mainData = ref<any[]>([]);
      const searchTabTheme = (data) => {
        if (!data.active && !data.invalid) {
          return 'search-bottom-area-cell';
        }
        if (data.active && !data.invalid) {
          return 'search-bottom-area-cell search-bottom-area-cell-active';
        }

        if (!data.active && data.invalid) {
          return 'search-bottom-area-cell search-bottom-area-cell-invalid';
        }
      };
      const searchByInput = async (value) => {
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
        await initSearchToolBarAndMainData();
      };
      const initSearchToolBarAndMainData = async () => {
        compState.loading = true;
        mainData.value = [];
        searchBody.skipCount = pageRef.value.current;
        searchBody.maxResultCount = pageRef.value.pageSize;
        await pageHomeData(searchBody)
          .then((response) => {
            if (response) {
              pageRef.value.total = response.totalCount;
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
                for (let item of response.items) {
                  mainData.value.push({
                    id: item.id,
                    sequenceCode: item.sequenceCode,
                    materialImageUrl: item.materialImageUrl,
                    materialType: item.materialType,
                    materialTexture: item.materialTexture,
                    materialSurface: item.materialSurface,
                    similarity: item.similarity,
                    picker: false,
                  });
                }
              }
            }
            compState.loading = false;
          })
          .catch(() => {
            compState.loading = false;
          });
      };
      watchEffect(async () => {
        await initSearchToolBarAndMainData();
      });

      const selectSearchCollapsedClick = () => {
        selectSearchCollapsed.value = !selectSearchCollapsed.value;
      };

      const detailClick = (data) => {
        router.push({
          path: '/materialLibrary/materialLibrayDetail',
          query: { id: data.id, title: data.sequenceCode },
        });
      };

      const imgLevitateClick = () => {
        if (showImgRef.value == 'close') {
          showImgRef.value = 'open';
        }
      };

      const searchByCamera = async (file) => {
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
      return {
        mainData,
        selectSearchCollapsed,
        selectSearchList,
        pageRef,
        showImgRef,
        selectChange,
        searchTabTheme,
        detailClick,
        selectSearchCollapsedClick,
        searchByInput,
        imgLevitateClick,
        searchByCamera,
        ...toRefs(compState),
      };
    },
  });
</script>
<style scoped>
  .search-content {
    position: sticky;
    top: 80px;
    z-index: 100;
    background-color: rgb(240, 242, 245);
  }

  .search-top-area {
    height: 2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .search-top-area-right {
    display: flex;
    align-items: center;
  }

  .search-top-area-right-imgbutton {
    display: flex;
    margin-right: 15px;
    padding: 2px 10px 2px 10px;
    font-family: 微软雅黑;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: rgb(255, 255, 255);
    border-radius: 6px;
    cursor: pointer;
  }

  .search-bottom-area {
    border: 1px solid rgb(215, 215, 215);
    overflow: hidden;
    background-color: white;
    display: flex;
    flex-direction: column;
  }

  .search-bottom-area-row {
    padding: 2px 0px 2px 0px;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-items: center;
    font-size: 12px;
  }

  .search-bottom-area-row .row-name {
    color: #858b9c;
    margin-left: 5px;
    margin-right: 30px;
  }

  .search-bottom-area-cell {
    padding: 5px 15px 5px 15px;
    margin-left: 2px;
    font-size: 12px;
    font-weight: 400;
    color: rgb(51, 51, 51);
    cursor: pointer;
  }

  .search-bottom-area-cell-active {
    background-color: #3774C5;
    color: #fff;
  }

  .search-bottom-area-cell-invalid {
    color: #c7ccd6;
  }

  .card-describe-content {
    padding: 7px 0px;
    font-size: 12px;
    color: rgb(127, 127, 127);
    font-weight: 400;
    font-family: '微软雅黑';
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .card-describe-title {
    flex-shrink: 0;
    padding-right: 0px;
    text-align: left;
  }

  :deep() .ant-breadcrumb-link {
    font-size: 18px;
    color: rgb(51, 51, 51);
    font-weight: 500;
    font-family: '微软雅黑';
    cursor: pointer;
  }

  :deep() .ant-breadcrumb-separator {
    font-size: 18px;
    color: rgb(51, 51, 51);
    font-weight: 500;
    font-family: '微软雅黑';
  }
</style>
