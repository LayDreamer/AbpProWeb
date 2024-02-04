<template>
  <div class="flex flex-col ml-3 mr-3">
    <div class="flex justify-between">
      <div>
        <a-card
          title="产品编码"
          size="small"
          style="width: 150px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <div class="flex justify-start w-full">
            <a-tooltip :title="response.data.code">
              <a-input v-model:value="response.data.code" :style="inputStyle" />
            </a-tooltip>
            <a-tooltip title="搜索编码">
              <a-button
                class="custom-product-select"
                type="primary"
                preIcon="fluent:search-32-regular"
                @click="productCodeSearch"
              ></a-button>
            </a-tooltip>
          </div>
        </a-card>
      </div>
      <div>
        <a-card
          title="产品名称"
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
            <a-tooltip title="选择产品名称">
              <a-button
                class="custom-product-select"
                type="primary"
                preIcon="ep:select"
                @click="productNameSelect"
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
            :style="checkLengthInputStyle"
            @change="lengthChange"
          />
        </a-card>
        <p :style="errorLengthInfoStyle">长度输入有误</p>
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
            :style="checkWidthInputStyle"
            @change="widthChange"
          />
        </a-card>
        <p :style="errorWdithInfoStyle">宽度输入有误</p>
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
            :style="checkHeightInputStyle"
            @change="heightChange"
          />
        </a-card>
        <p :style="errorHeightInfoStyle">高度输入有误</p>
      </div>
      <div>
        <a-card
          title="结构类别"
          size="small"
          style="width: 110px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-tooltip :title="response.data.category">
            <a-cascader
              v-model:value="response.data.category"
              :options="getProductCategoryData()"
              expand-trigger="hover"
              @change="categoryChange"
            />
          </a-tooltip>
        </a-card>
      </div>
    </div>
    <div class="flex justify-between mt-5">
      <div>
        <a-card
          title="系统"
          size="small"
          style="width: 100px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.system"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="系列"
          size="small"
          style="width: 160px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.series"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="材质"
          size="small"
          style="width: 180px; text-align: center"
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
          title="版本"
          size="small"
          style="width: 60px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.version"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
    </div>
    <div class="flex justify-between mt-5">
      <div>
        <a-card
          title="加工图图号"
          size="small"
          style="width: 150px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.processNum"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="装配图图号"
          size="small"
          style="width: 150px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.assemblyDrawingNum"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="节点图图号"
          size="small"
          style="width: 150px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.detailNum"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="项目编码"
          size="small"
          style="width: 100px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.projectCode"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
      <div>
        <a-card
          title="项目名称"
          size="small"
          style="width: 100px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.projectName"
            :auto-size="{ minRows: 1, maxRows: 3 }"
            :style="inputStyle"
          />
        </a-card>
      </div>
    </div>
    <div class="flex justify-start mt-5">
      <div>
        <a-card
          title="产品定制规范"
          size="small"
          style="width: 600px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <a-textarea
            v-model:value="response.data.productSpecification"
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
    <div class="flex justify-start mt-5">
      <div>
        <a-card
          title="限制"
          size="small"
          style="width: 500px; text-align: center"
          :head-style="tstyle"
          :body-style="bstyle"
        >
          <div
            v-for="(index, i) in limitDatas"
            :key="index.id"
            :class="{ 'mt-5': i != 0 }"
            class="flex justify-between"
          >
            <a-input
              v-model:value="limitDatas[i].min"
              placeholder="最小值"
              style="width: 80px; text-align: center"
            />
            <a-select v-model:value="limitDatas[i].limitMin" style="width: 80px">
              <a-select-option value="<" label="<" />
              <a-select-option value="≤" label="≤" />
            </a-select>
            <a-select v-model:value="limitDatas[i].limitData" style="width: 100px">
              <a-select-option value="长度" label="长度" />
              <a-select-option value="宽度" label="宽度" />
              <a-select-option value="高度" label="高度" />
            </a-select>
            <a-select v-model:value="limitDatas[i].limitMax" style="width: 80px">
              <a-select-option value="<" label="<" />
              <a-select-option value="≤" label="≤" />
            </a-select>
            <a-input
              v-model:value="limitDatas[i].max"
              placeholder="最大值"
              style="width: 80px; text-align: center"
            />
          </div>
        </a-card>
      </div>
      <div>
        <a-button type="primary" @click="addLimteClick" style="margin-left: 25px; margin-top: 5px"
          >添加</a-button
        >
      </div>
    </div>
  </div>
  <NameSelect @register="register" @confirmClick="getSelect"></NameSelect>
</template>

<script lang="ts">
  import { Card, Cascader, Tooltip } from 'ant-design-vue';
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { getErpDataByNameCode, setErpDataToEdit } from '../index';
  import { getProductCategoryData } from '../tableData';
  import NameSelect from './ErpNameSelect.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    ProductInventoryFullDto,
    ProductInventoryModifyStatus,
  } from '/@/services/ServiceProxies';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  interface limitRow {
    id: number;
    min: string;
    limitMin: string;
    limitData: string;
    limitMax: string;
    max: string;
  }

  export default defineComponent({
    components: { ACard: Card, ATooltip: Tooltip, NameSelect, ACascader: Cascader },
    props: {
      initData: {
        type: Object as PropType<ProductInventoryFullDto>,
        required: true,
      },
    },
    watch: {
      initData(newVal) {
        this.switchProduct = false;
        this.response = newVal;
        setTimeout(() => {
          this.switchProduct = true;
        }, 10);
        this.getData();
        this.checkWhenRuleChange();
      },
    },
    setup(props) {
      onMounted(() => {
        getData();
      });
      const response = ref();
      const switchProduct = ref(true);
      response.value = props.initData;
      const limitDatas = ref<limitRow[]>([]);
      const isLengthError = ref(false);
      const checkLengthInputStyle = computed(() => ({
        borderColor: isLengthError.value ? 'red' : '',
        boxShadow: isLengthError.value ? '0 0 5px red' : '',
        textAlign: 'center',
      }));
      const errorLengthInfoStyle = computed(() => ({
        fontSize: '10px',
        marginTop: '1px',
        color: 'red',
        display: isLengthError.value ? '' : 'none',
      }));
      const isWidththError = ref(false);
      const checkWidthInputStyle = computed(() => ({
        borderColor: isWidththError.value ? 'red' : '',
        boxShadow: isWidththError.value ? '0 0 5px red' : '',
        textAlign: 'center',
      }));
      const errorWdithInfoStyle = computed(() => ({
        fontSize: '10px',
        marginTop: '1px',
        color: 'red',
        display: isWidththError.value ? '' : 'none',
      }));
      const isHeightError = ref(false);
      const checkHeightInputStyle = computed(() => ({
        borderColor: isHeightError.value ? 'red' : '',
        boxShadow: isHeightError.value ? '0 0 5px red' : '',
        textAlign: 'center',
      }));
      const errorHeightInfoStyle = computed(() => ({
        fontSize: '10px',
        marginTop: '1px',
        color: 'red',
        display: isHeightError.value ? '' : 'none',
      }));
      const [register, { openModal, closeModal }] = useModal();
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      function getData() {
        limitDatas.value = [];
        if (
          isNullOrUnDef(response.value.data.limitInfos) ||
          isEmpty(response.value.data.limitInfos)
        )
          return;
        var lists = response.value.data.limitInfos.split('*');
        for (let item of lists) {
          const map = item.split(';');
          let id = lists.indexOf(item);
          limitDatas.value.push({
            id: id,
            min: map[0],
            limitMin: map[1],
            limitData: map[2],
            limitMax: map[3],
            max: map[4],
          });
        }
      }
      function setData() {
        let str = '';
        for (let i = 0; i < limitDatas.value.length; i++) {
          if (i == 0) {
            str +=
              limitDatas.value[i].min +
              ';' +
              limitDatas.value[i].limitMin +
              ';' +
              limitDatas.value[i].limitData +
              ';' +
              limitDatas.value[i].limitMax +
              ';' +
              limitDatas.value[i].max;
          } else {
            str +=
              '*' +
              limitDatas.value[i].min +
              ';' +
              limitDatas.value[i].limitMin +
              ';' +
              limitDatas.value[i].limitData +
              ';' +
              limitDatas.value[i].limitMax +
              ';' +
              limitDatas.value[i].max;
          }
        }
        response.value.data.limitInfos = str;
      }
      function addLimteClick() {
        limitDatas.value?.push({
          id: limitDatas.value.length,
          min: '50',
          limitMin: '≤',
          limitData: '长度',
          limitMax: '≤',
          max: '3020',
        });
      }
      function checkInvaild(name, data) {
        let result = false;
        if (data) {
          var findRule = limitDatas.value.find((x) => x.limitData == name);
          if (findRule !== undefined) {
            var index = limitDatas.value.indexOf(findRule);
            const convertData = parseFloat(data);
            const min = parseFloat(limitDatas.value[index].min);
            const max = parseFloat(limitDatas.value[index].max);
            let flag1 = false;
            if (limitDatas.value[index].limitMin == '<') {
              flag1 = convertData > min;
            } else {
              flag1 = convertData > min || convertData == min;
            }
            let flag2 = false;
            if (limitDatas.value[index].limitMax == '<') {
              flag2 = convertData < max;
            } else {
              flag2 = convertData < max || convertData == max;
            }
            if (!flag1 || !flag2) {
              result = true;
            }
          }
        } else {
          result = true;
        }
        return result;
      }
      function checkWhenRuleChange() {
        isLengthError.value = checkInvaild('长度', response.value.data.length);
        isWidththError.value = checkInvaild('宽度', response.value.data.width);
        isHeightError.value = checkInvaild('高度', response.value.data.height);
      }
      function lengthChange() {
        response.value.data.length = response.value.data.length.replace(/[^\d]/g, '');
        isLengthError.value = checkInvaild('长度', response.value.data.length);
      }
      function widthChange() {
        response.value.data.width = response.value.data.width.replace(/[^\d]/g, '');
        isWidththError.value = checkInvaild('宽度', response.value.data.width);
      }
      function heightChange() {
        response.value.data.height = response.value.data.height.replace(/[^\d]/g, '');
        isHeightError.value = checkInvaild('高度', response.value.data.height);
      }
      watch(
        limitDatas,
        () => {
          setData();
          checkWhenRuleChange();
        },
        { deep: true },
      );
      watch(
        response,
        () => {
          if (switchProduct.value && response.value.status == ProductInventoryModifyStatus.Normal) {
            response.value.status = ProductInventoryModifyStatus.Modify;
          }
        },
        { deep: true },
      );

      return {
        response,
        switchProduct,
        tstyle: { background: 'rgb(203 213 225)' },
        bstyle: { padding: '0' },
        inputStyle: { textAlign: 'center' },
        checkLengthInputStyle,
        errorLengthInfoStyle,
        checkWidthInputStyle,
        errorWdithInfoStyle,
        checkHeightInputStyle,
        errorHeightInfoStyle,
        limitDatas,
        register,
        getData,
        lengthChange,
        widthChange,
        heightChange,
        addLimteClick,
        checkWhenRuleChange,
        productNameSelect: () => {
          openModal(true, {
            title: '产品选择',
          });
        },
        getSelect: (erp) => {
          if (erp.length > 0) {
            setErpDataToEdit(response.value.data, erp[0]);
          }
          closeModal();
          setTimeout(() => {
            checkWhenRuleChange();
          }, 50);
        },
        productCodeSearch: async () => {
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
        getProductCategoryData,
        categoryChange: (value) => {
          if (value) {
            response.value.data.category = value[value.length - 1];
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

  .custom-product-select {
    padding: 0;
    width: 20px;
  }
  .custom-product-select :deep() .app-iconify {
    font-size: 15px !important;
    display: block !important;
    line-height: 0;
  }

  .ant-cascader {
    width: 100%;
  }
</style>
