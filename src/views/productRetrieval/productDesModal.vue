<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="项目信息"
    :height="350"
    :footer="null"
    :showOkBtn="false"
    :showCancelBtn="false"
    :maskClosable="false"
    :canFullscreen="false"
  >
    <div ref="wrapEl">
      <a-list size="small" item-layout="horizontal" :data-source="showData">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <label style="font-size: 16px; font-weight: bold">{{ item.title }}</label>
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
  import { defineComponent, ref } from 'vue';
  import { parsingInventory, parsingProjectInfo } from './Index';
  import { useLoading } from '/@/components/Loading';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    ProductInventroyTag,
    ProjectInfoInputType,
    ProjectInfoSearchCodeDto,
  } from '/@/services/ServiceProxies';
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

      const [register, { closeModal }] = useModalInner(async (e) => {
        var data = e.data;

        getDataInfo(data);
      });

      async function getDataInfo(data) {
        showData.value = [];
        desData.value = [];
        openWrapLoading();

        // await parsingInventory([data.materialCode]).then(async (response) => {
        //   var materialDes: any[] = [];
        //   var count = 0;
        //   var money = 0;
        //   for (let item of response.data) {
        //     count += item.inventoryQuantity;
        //     money += item.inventoryAmount;
        //   }
        //   var des = '库存数量：' + count + '，库存金额：' + money;
        //   materialDes.push(des);
        //   desData.value.push({
        //     title: '',
        //     description: materialDes,
        //   });

        //   //物料详情
        //   if (data.materialName != null) {
        //     // let date = '';
        //     // if (response.data.length > 0) {
        //     //   date = response[0].creationTime.format('YYYY-MM-DD');
        //     // }

        //     showData.value.push({
        //       title: '【 物料库存】' + data.materialName,
        //       description: materialDes,
        //     });
        //   }

        //   closeWrapLoading();
        // });

        let name = '';
        var productDes: any[] = [];
        let body: ProjectInfoSearchCodeDto = new ProjectInfoSearchCodeDto();
        switch (data.tag) {
          case ProductInventroyTag.Product:
            body.code = data.productCode;
            body.type = ProjectInfoInputType.Producut;
            name = data.productName;
            break;
          case ProductInventroyTag.Modules:
            body.code = data.moduleCode;
            body.type = ProjectInfoInputType.Module;
            name = data.moduleName;
            break;
          case ProductInventroyTag.Material:
            body.code = data.materialCode;
            body.type = ProjectInfoInputType.Material;
            name = data.materialName;
            break;
          default:
        }
        await parsingProjectInfo([body]).then((response1) => {
          for (let item of response1.data) {
            if (item.projects)
              for (let project of item.projects) {
                var des = '';
                des += '项目：' + project.projectName;
                des += ' —— 编码：' + project.projectCode;
                productDes.push(des);
                desData.value.push({
                  title: '',
                  description: productDes,
                });
              }
          }
          // let date = '';
          // if (response1.length > 0 && response1[0].projects && response1[0].projects.length > 0) {
          //   date = response1[0].projects[0].creationTime.format('YYYY-MM-DD');
          // }
          showData.value.push({
            title: '【' + name + '】' + body.code,
            description: productDes,
          });
        });

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
