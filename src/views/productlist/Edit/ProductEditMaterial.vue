<template>
  <div class="flex flex-col ml-3 mr-3">
    <div class="flex justify-between">
      <div>
        <a-card
          title="编码"
          size="small"
          style="width: 140px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <div class="flex justify-start w-full">
            <a-tooltip :title="response.data.code">
              <a-input v-model:value="response.data.code" :style="inputStyle" />
            </a-tooltip>
            <a-tooltip title="搜索编码">
              <a-button
                class="custom-material-select"
                type="primary"
                preIcon="fluent:search-32-regular"
                @click="materialCodeSearch"
              ></a-button>
            </a-tooltip>
          </div>
        </a-card>
      </div>
      <div>
        <a-card
          title="名称"
          size="small"
          style="width: 200px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <div class="flex justify-start w-full">
            <a-tooltip :title="response.data.name">
              <a-input
                class="custom-input-disabled"
                v-model:value="response.data.name"
                :disabled="true"
              />
            </a-tooltip>
            <a-tooltip title="选择物料名称">
              <a-button
                class="custom-material-select"
                type="primary"
                preIcon="ep:select"
                @click="materialNameSelect"
              ></a-button>
            </a-tooltip>
          </div>
        </a-card>
      </div>
      <div>
        <a-card
          title="长"
          size="small"
          style="width: 70px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.length"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
            @change="lengthChange"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="宽"
          size="small"
          style="width: 70px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.width"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
            @change="widthChange"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="高"
          size="small"
          style="width: 70px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.height"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
            @change="heightChange"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="单位"
          size="small"
          style="width: 80px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.unit"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
    </div>
    <div class="flex justify-between mt-5">
      <div>
        <a-card
          title="层级"
          size="small"
          style="width: 100px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.level"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="材质"
          size="small"
          style="width: 160px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.materialQuality"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="颜色"
          size="small"
          style="width: 100px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.color"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="属性"
          size="small"
          style="width: 100px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-select v-model:value="response.data.property" style="width: 100%">
            <a-select-option value="组装物料" label="组装物料"></a-select-option>
            <a-select-option value="安装物料" label="安装物料"></a-select-option>
          </a-select>
        </a-card>
      </div>
      <div>
        <a-card
          title="用量"
          size="small"
          style="width: 110px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <div class="flex justify-start w-full">
            <a-input
              v-model:value="formattedUsage"
              :bordered="false"
              :disabled="true"
              style="color: rgba(0, 0, 0, 1); text-align: center"
            />
            <a-tooltip title="设置用量规则">
              <a-button
                type="primary"
                preIcon="ant-design:setting-twotone"
                @click="setUsageClick"
                class="custom-material-select"
              ></a-button>
            </a-tooltip>
          </div>
        </a-card>
      </div>
      <div>
        <a-card
          title="加工是否"
          size="small"
          style="width: 90px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-select v-model:value="response.data.isProcess" style="width: 100%">
            <a-select-option value="是" label="是"></a-select-option>
            <a-select-option value="否" label="否"></a-select-option>
          </a-select>
        </a-card>
      </div>
    </div>
    <div class="flex justify-start mt-5">
      <div>
        <a-card
          title="供货方式"
          size="small"
          style="width: 120px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-select v-model:value="response.data.supplyMode" style="width: 100%">
            <a-select-option value="自制产品" label="自制产品"></a-select-option>
            <a-select-option value="通用物料" label="通用物料"></a-select-option>
            <a-select-option value="委外产品" label="委外产品"></a-select-option>
            <a-select-option value="/" label="/"></a-select-option>
          </a-select>
        </a-card>
      </div>
      <div style="margin-left: 20px">
        <a-card
          title="备注"
          size="small"
          style="width: 300px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.remark"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            style="
               {
                text-align: left;
              }
            "
          />
        </a-card>
      </div>
    </div>
  </div>
  <NameSelect @register="Erpregister" @confirmClick="getSelect"></NameSelect>
  <UsageSetting @register="register" @saveUsage="saveUsage"></UsageSetting>
</template>

<script lang="ts">
  import { Card, Tooltip } from 'ant-design-vue';
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { getErpDataByNameCode, setErpDataToEdit } from '../index';
  import NameSelect from './ErpNameSelect.vue';
  import UsageSetting from './MaterialUsage.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    ProductInventoryFullDto,
    ProductInventoryModifyStatus,
  } from '/@/services/ServiceProxies';
  import { getCalcuteValue } from '/@/views/productlist/index';
  export default defineComponent({
    components: { ACard: Card, ATooltip: Tooltip, UsageSetting, NameSelect },
    props: {
      initData: {
        type: Object as PropType<ProductInventoryFullDto>,
        required: true,
      },
      totalData: {
        type: Object as PropType<ProductInventoryFullDto[]>,
        required: true,
      },
    },
    watch: {
      initData(newVal) {
        this.switchMaterial = false;
        this.response = newVal;
        setTimeout(() => {
          this.switchMaterial = true;
        }, 10);
      },
      totalData(newVal) {
        this.totalDataResponse = newVal;
      },
    },
    setup(props) {
      onMounted(() => {});
      const response = ref();
      const totalDataResponse = ref<ProductInventoryFullDto[]>([]);
      const switchMaterial = ref(true);
      response.value = props.initData;
      totalDataResponse.value = props.totalData;
      const formattedUsage = computed(() => {
        if (response.value.data.materialUsageFormula) {
          const calcuteValue = getFormulaCalcuteValue(response.value.data.materialUsageFormula);
          response.value.data.usage = calcuteValue;
          return calcuteValue;
        } else if (response.value.data.usage) {
          return parseFloat(response.value.data.usage).toFixed(3);
        }
        return '';
      });
      const [register, { openModal, closeModal }] = useModal();
      const [Erpregister, { openModal: ErpOpen, closeModal: ErpClose }] = useModal();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      watch(
        response,
        () => {
          if (
            switchMaterial.value &&
            response.value.status == ProductInventoryModifyStatus.Normal
          ) {
            response.value.status = ProductInventoryModifyStatus.Modify;
          }
        },
        { deep: true },
      );

      function getFormulaCalcuteValue(formula) {
        var parts = formula.split('@@@@@');
        if (parts.length !== 2) return '';
        let str = parts[1];
        let matches = str.match(/\#(.+?)\#/g);
        let map = new Map();
        if (matches) {
          for (let item of matches) {
            var t = item.replace(new RegExp('#', 'g'), '');
            var d = t.split('.');
            if (d.length == 2) {
              var obj = totalDataResponse.value.filter((x) => x.id == d[0]);
              if (obj.length > 0) {
                var value;
                switch (d[1]) {
                  case 'length':
                    value = obj[0].data.length;
                    break;
                  case 'width':
                    value = obj[0].data.width;
                    break;
                  case 'height':
                    value = obj[0].data.height;
                    break;
                  case 'usage':
                    value = obj[0].data.usage;
                    break;
                }
                map.set(item, value);
              }
            }
          }
        }
        map.forEach((value, key) => {
          str = str.replace(new RegExp(key, 'g'), value);
        });
        try {
          return getCalcuteValue(str);
        } catch (e) {
          return '';
        }
      }

      function getUsageParamer() {
        const material = response.value;
        let module;
        var product;
        var otherMaterial = totalDataResponse.value.filter(
          (x) => x.parentId === material.parentId && x.id !== material.id,
        );

        var modules = totalDataResponse.value.filter((x) => x.id === material.parentId);
        if (modules && modules.length > 0) {
          module = modules[0];
          var products = totalDataResponse.value.filter((x) => x.id === module.parentId);
          if (products && products.length > 0) {
            product = products[0];
          }
        }
        return {
          product,
          module,
          material,
          otherMaterial,
        };
      }

      function setUsageClick() {
        openModal(true, {
          str: response.value.data.materialUsageFormula,
          data: getUsageParamer(),
        });
      }

      return {
        response,
        totalDataResponse,
        switchMaterial,
        tstyle: { background: 'rgb(203 213 225)' },
        bstyle: { padding: '0' },
        inputStyle: { textAlign: 'center' },
        defaultLevel: ref('/'),
        formattedUsage,
        Erpregister,
        register,
        setUsageClick,
        saveUsage: () => {
          //在这边有时watch监听不到手动判断
          if (response.value.status == ProductInventoryModifyStatus.Normal) {
            response.value.status = ProductInventoryModifyStatus.Modify;
          }
          closeModal();
        },
        lengthChange: () => {
          response.value.data.length = response.value.data.length.replace(/[^\d]/g, '');
        },
        widthChange: () => {
          response.value.data.width = response.value.data.width.replace(/[^\d]/g, '');
        },
        heightChange: () => {
          response.value.data.height = response.value.data.height.replace(/[^\d]/g, '');
        },
        materialNameSelect: () => {
          ErpOpen(true, {
            title: '物料选择',
          });
        },

        getSelect: (erp) => {
          if (erp.length > 0) {
            setErpDataToEdit(response.value.data, erp[0]);
          }
          ErpClose();
        },
        materialCodeSearch: async () => {
          if (response.value.data.code && response.value.data.code !== '') {
            try {
              const requestBody = {
                data: [
                  {
                    no: response.value.data.code,
                  },
                ],
              };
              const erp = await getErpDataByNameCode(JSON.stringify(requestBody));
              if (erp.length == 0) {
                error('Erp中没有包含此编码数据');
              } else {
                setErpDataToEdit(response.value.data, erp[0]);
                success('搜索成功');
              }
            } catch {
              error('搜索编码失败');
            }
          }
        },
      };
    },
  });
</script>
<style scoped>
  .custom-input-disabled {
    color: rgba(0, 0, 0, 0.85);
    background-color: #fff;
    text-align: center;
  }

  .custom-material-select {
    padding: 0;
    width: 20px;
  }
  .custom-material-select :deep() .app-iconify {
    font-size: 15px !important;
    display: block !important;
    line-height: 0;
  }
</style>
