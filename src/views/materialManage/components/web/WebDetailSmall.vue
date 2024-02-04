<template>
  <div class="flex flex-col h-full px-1">
    <div class="px-2 py-4 h-full">
      <div class="flex flex-col">
        <div class="flex flex-row">
          <div class="w-1/2 relative">
            <a-image :src="data.materialImageUrl" width="100%" style="max-height: 116px" />
            <div class="image-div" @click="downloadImag">
              <span
                class="iconify"
                data-icon="fa-solid:download"
                style="font-size: 14px; color: white"
              ></span>
            </div>
          </div>
          <div class="flex-1 ml-2 flex flex-col">
            <div class="flex justify-between items-center">
              <div class="detail-title">{{ data.sequenceCode }}</div>
              <div @click="backHome">
                <span class="iconify" data-icon="ep:back" style="font-size: 30px"></span>
              </div>
            </div>

            <div class="flex space-x-1 mt-1">
              <div class="detail-material">{{ data.materialType }}</div>
              <div class="detail-material">{{ data.materialTexture }}</div>
              <div class="detail-material">{{ data.materialSurface }}</div>
            </div>
            <div class="flex flex-col mt-3">
              <div class="flex flex-row">
                <div class="detail-describe">宽幅：</div>
                <div class="detail-info">{{ data.width }}mm</div>
              </div>
              <div class="flex">
                <div class="detail-describe">厚度：</div>
                <div class="detail-info">{{ formattedThickness() }}</div>
              </div>
            </div>
          </div>
        </div>
        <a-card
          :body-style="{ padding: '0px' }"
          style="width: 100%; margin-top: 16px; border-radius: 8px; height: max-content"
        >
          <template #title>
            <div
              class="flex flex-row items-center justify-between"
              @click="supplierTogglePanel"
              style="cursor: pointer"
            >
              <span style="margin-left: 5px">供应商信息</span>
              <div>
                <div v-if="supplierCollapsed">
                  <span
                    class="iconify"
                    data-icon="icon-park-outline:left"
                    style="font-size: 16px"
                  ></span>
                </div>
                <div v-else>
                  <span
                    class="iconify"
                    data-icon="icon-park-outline:down"
                    style="font-size: 16px"
                  ></span>
                </div>
              </div>
            </div>
          </template>
          <div v-show="!supplierCollapsed" style="padding: 16px">
            <div class="panel-info-top">{{ data.supplier }}</div>
            <div class="panel-info-top">{{ data.supplierCode }}</div>
            <div class="mt-4 flex flex-row">
              <div class="panel-info-buttom">价格区间： </div>
              <div class="panel-info-buttom">{{ data.price }}</div>
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom-fixed">起订量： </div>
              <div class="panel-info-buttom">{{ data.quantity }}</div>
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom">供货周期： </div>
              <div class="panel-info-buttom">{{ data.deliveryCycle }}天</div>
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom-fixed">样册系列名称： </div>
              <div class="panel-info-buttom">{{ data.seriesName }}</div>
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom">样册外观照片： </div>
              <a-image style="width: 25px; height: 25px" :src="data.seriesImageUrl"></a-image>
            </div>
          </div>
        </a-card>
        <a-card
          :body-style="{ padding: '0px' }"
          style="width: 100%; margin-top: 8px; border-radius: 8px; height: max-content"
        >
          <template #title>
            <div
              class="flex flex-row items-center justify-between"
              style="cursor: pointer"
              @click="ysTogglePanel"
            >
              <span style="margin-left: 5px">亚厦信息</span>
              <div>
                <div v-if="ysCollapsed">
                  <span
                    class="iconify"
                    data-icon="icon-park-outline:left"
                    style="font-size: 16px"
                  ></span>
                </div>
                <div v-else>
                  <span
                    class="iconify"
                    data-icon="icon-park-outline:down"
                    style="font-size: 16px"
                  ></span>
                </div>
              </div>
            </div>
          </template>

          <div v-show="!ysCollapsed" style="padding: 16px">
            <div class="panel-info-top">{{ data.materialCode }}</div>
            <!-- <div class="flex flex-row">
              <div class="panel-info-buttom">封样样品存放处： </div>
              <div class="panel-info-buttom">{{ data.storagePlace }}</div>
            </div> -->
            <div class="flex mt-2">
              <div class="panel-info-buttom">应用项目： </div>
              <div
                class="panel-info-buttom"
                style="color: rgb(55, 116, 197); cursor: pointer"
                @click="showProject"
                >查看</div
              >
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom">总库存： </div>
              <div class="panel-info-buttom">{{ data.totalInventory }}</div>
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom-fixed">生产批次： </div>
              <div class="panel-info-buttom" style="word-break: break-all">{{
                data.productionBatch
              }}</div>
            </div>
            <div class="flex mt-2">
              <div class="panel-info-buttom-fixed">批次库存： </div>
              <div class="panel-info-buttom">{{ data.batchInventory }}</div>
            </div>
          </div>
        </a-card>
      </div>
    </div>
    <Loading :loading="loading" :absolute="absolute" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { Card } from 'ant-design-vue';
import axios from 'axios';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { VXETable } from 'vxe-table';
import { getDetailData, getProjectInfo } from '../../index';
import { Loading } from '/@/components/Loading';
import { useGo } from '/@/hooks/web/usePage';
import { usePermission } from '/@/hooks/web/usePermission';
import { useTabs } from '/@/hooks/web/useTabs';
import { MaterialManageFullDto } from '/@/services/ServiceProxies';
  export default defineComponent({
    name: 'MaterialLibrayDetail',
    components: { ACard: Card, Loading },
    setup() {
      const compState = reactive({
        absolute: true,
        loading: false,
        tip: '下载中...',
      });
      const go = useGo();
      const { setTitle } = useTabs();
      const { hasPermission } = usePermission();
      const route = useRoute();
      const data = ref();
      data.value = new MaterialManageFullDto();
      onMounted(async () => {
        setTitle('详情:' + route.query.title);
        await getDetailData([route.query.id]).then((response) => {
          data.value = response[0];
        });
      });

      const formattedProductionBatch = () => {
        if (data.value.productionBatch == null) {
          return '';
        }
        const formattedText = data.value.productionBatch
          .replace(/、/g, '<br>')
          .replace(/,/g, '<br>');
        return formattedText.trim();
      };

      const formattedBatchInventory = () => {
        if (data.value.batchInventory == null) {
          return '';
        }
        const formattedText = data.value.batchInventory
          .replace(/、/g, '<br>')
          .replace(/,/g, '<br>');
        return formattedText.trim();
      };

      const formattedThickness = () => {
        if (data.value.thickness == null) return '';
        if (data.value.thickness.includes('.')) {
          return parseFloat(data.value.thickness).toFixed(2);
        } else {
          return data.value.thickness;
        }
      };
      const supplierCollapsed = ref(true);
      const ysCollapsed = ref(true);
      function supplierTogglePanel() {
        supplierCollapsed.value = !supplierCollapsed.value;
      }
      function ysTogglePanel() {
        ysCollapsed.value = !ysCollapsed.value;
      }
      async function downloadImag() {
        compState.loading = true;
        try {
          const response = await axios.get(data.value.materialImageDownLoadUrl, {
            responseType: 'arraybuffer',
          });

          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download =
            data.value.sequenceCode + '.' + getFileExtension(data.value.materialImageDownLoadUrl);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading image:', error);
        }

        function getFileExtension(url) {
          const parts = url.split('.');
          if (parts.length > 1) {
            return parts[parts.length - 1];
          }
          return null;
        }

        compState.loading = false;
      }
      async function showProject() {
        if (data.value.materialCode) {
          await getProjectInfo([
            {
              code: data.value.materialCode,
              type: 2,
            },
          ]).then((response) => {
            if (response[0].projects && response[0].projects.length > 0) {
              let date = response[0].projects[0].creationTime.format('YYYY-MM-DD');
              let title = '【' + date + ' 项目信息】' + data.value.materialCode;
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
      }

      function backHome() {
        go('/materialLibrary/materialLibrayHome');
      }

      return {
        data,
        supplierCollapsed,
        ysCollapsed,
        hasPermission,
        formattedProductionBatch,
        formattedBatchInventory,
        formattedThickness,
        supplierTogglePanel,
        ysTogglePanel,
        downloadImag,
        showProject,
        backHome,
        ...toRefs(compState),
      };
    },
  });
</script>
<style scoped>
  .image-div {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-color: rgba(242, 242, 242, 0.73);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .detail-title {
    color: rgb(51, 51, 51);
    font-family: '微软雅黑 Bold';
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
  }
  .detail-material {
   color: rgb(55, 116, 197);
    background-color: rgba(55, 116, 197, 0.32);
    width: 'max-content';
    padding-left: 4px;
    padding-right: 4px;
    height: 14px;
    border-radius: 4px;
    text-align: center;
    line-height: 14px;
    font-family: '微软雅黑';
    font-size: 10px;
    font-weight: 600;
  }

  .detail-describe {
    color: rgb(85, 85, 85);
    font-size: 10px;
    font-family: '微软雅黑 Bold';
    font-weight: 700;
  }

  .detail-info {
    margin-right: 25px;
    color: rgb(127, 127, 127);
    font-size: 10px;
    font-family: '微软雅黑 Bold';
    font-weight: 700;
  }

  .panel-info {
    color: rgb(51, 51, 51);
    font-family: '微软雅黑';
    font-weight: 400;
  }
  .panel-info-top {
    color: rgb(51, 51, 51);
    font-family: '微软雅黑';
    font-weight: 400;
    font-size: 16px;
  }

  .panel-info-buttom {
    color: rgb(51, 51, 51);
    font-family: '微软雅黑';
    font-weight: 400;
    font-size: 12px;
  }

  .panel-info-buttom-fixed {
    flex-shrink: 0; /* 防止缩小 */
    padding-right: 0px;
    text-align: left;
    color: rgb(51, 51, 51);
    font-family: '微软雅黑';
    font-weight: 400;
    font-size: 12px;
  }

  :deep() .ant-card-head-title {
    padding: 0px;
  }

  :deep() .ant-card-extra {
    padding: 0px;
  }

  :deep() .ant-card-head-wrapper {
    height: max-content;
  }

  :deep() .ant-card-head {
    font-size: 20px;
    font-weight: 500;
    padding: 0px 8px;
    height: 'max-content';
    min-height: fit-content;
  }
</style>
