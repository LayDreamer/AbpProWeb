<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="详情信息"
    :height="350"
    :footer="false"
    :showOkBtn="false"
    :showCancelBtn="false"
    :maskClosable="false"
  >
    <div ref="wrapEl">
      <a-list size="small" item-layout="horizontal" :data-source="showData">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <!-- <template #avatar>
                <a-avatar
                  :size="30"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              </template> -->
              <!-- :description="item.description" -->
              <template #title>
                <label style="font-size: large; font-weight: bold">{{ item.title }}</label>
              </template>
              <template #description>
                <a-list size="small" bordered :data-source="item.description">
                  <template #renderItem="{ item }">
                    <a-list-item>{{ item }}</a-list-item>
                  </template>
                </a-list>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { parsingInventory, parsingProjectInfo } from './Index';
  import { useLoading } from '/@/components/Loading';
  interface DataItem {
    title: string;
    description: string[];
  }

  const showData = ref<DataItem[]>([]);
  const desData = ref<DataItem[]>([]);
  export default defineComponent({
    components: { BasicModal },
    setup() {
      const wrapEl = ref<ElRef>(null);
      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEl,
        props: {
          tip: '查询中...',
          absolute: true,
        },
      });

      //var productDes = "项目:xxxxxxxxxxxxxxxxxxxx项目一深化下单','xxxxxxxxxxxxxxxxxxxx项目一一营销";
      // var materialDes = '原材料合格仓一库存数量: xxx ,库存金额: xxx.x';

      const [register, { closeModal }] = useModalInner(async (e) => {
        var data = e.data;
        getDataInfo(data);
      });

      async function getDataInfo(data) {
        showData.value = [];
        desData.value = [];

        getInventoryInfo(data);
        getProjectInfo(data);
      }

      async function getInventoryInfo(data) {
        openWrapLoading();
        var resultInfo = await parsingInventory(data.materialCode);
        var materialDes = [];
        // if (resultInfo.length == 0) return;
        for (let item of resultInfo) {
          var des = '';
          des += item.warehouse;
          des += item.warehouseLocationName;
          des += '——库存数量：' + item.inventoryQuantity;
          des += '，库存金额：' + item.inventoryAmount;
          materialDes.push(des);
          desData.value.push({
            title: '',
            description: materialDes,
          });
        }

        //物料详情
        // materialDes = getMaterialInventory(data);
        if (data.materialName != null) {
          showData.value.push({
            title: data.materialName,
            description: materialDes,
          });
        }
        closeWrapLoading();
      }

      async function getProjectInfo(data) {
        openWrapLoading();
        var productDes = [];
        // var input = '';
        // var inputName ='';
        let vv = {
          input: '',
          inputName: '',
        };
        switch (data.tag) {
          case 1:
            vv.input = data.productCode;
            vv.inputName = data.productName;
            break;
          case 2:
            vv.input = data.moduleCode;
            vv.inputName = data.moduleName;
            break;
          case 4:
            vv.input = data.materialCode;
            vv.inputName = data.materialName;
            break;
          default:
          //input = data.materialCode;
        }
        vv.input = vv.input + '|' + data.tag;

        var projectInfo = await parsingProjectInfo(vv.input);
        for (let item of projectInfo) {
          var des = '';
          des += '项目：' + item.projectName;
          des += '—编码：' + item.projectCode;
          productDes.push(des);
          desData.value.push({
            title: '',
            description: productDes,
          });
        }

        //产品详情;
        if (data.tag != null) {
          showData.value.push({
            title: vv.inputName,
            description: productDes,
          });
        }
        closeWrapLoading();
      }

      return {
        register,
        closeModal,
        showData,
        desData,
        wrapEl,
      };
    },
  });
</script>
