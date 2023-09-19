<template>
  <BasicModal
    v-bind="$attrs"
    title="用量设置"
    :minHeight="100"
    :canFullscreen="false"
    :maskClosable="false"
    destroyOnClose
    @register="registerModal"
  >
    <template #footer> </template>
    <div class="flex p-4 flex-row justify-start overflow-auto">
      <div class="flex-1 flex-col justify-start">
        <div class="grid grid-flow-row gap-4" style="grid-template-columns: repeat(3, 1fr)">
          <div v-for="item in settingTags" :key="item.id">
            <a-tag @click="tagSelect(item)" color="rgb(253 164 175)" class="custom-Tag">{{
              item.name
            }}</a-tag>
          </div>
        </div>
        <div class="flex-1 mt-5">
          <a-textarea
            ref="formulaInput"
            v-model:value="formulaValue"
            allow-clear
            :auto-size="{ minRows: 1, maxRows: 5 }"
            @change="inputChange"
            @blur="handleBlur"
          />
        </div>
      </div>
      <div class="flex w-1/10">
        <div class="flex flex-col justify-start ml-1 h-full">
          <div v-for="item in formulaOptons" :key="item.id">
            <a-tag @click="tagSelect(item)" color="#2db7f5" class="operation-Tag">{{
              item.name
            }}</a-tag>
          </div>
        </div>
      </div>
      <div class="flex w-1/5">
        <div class="flex flex-col justify-between ml-5 h-full">
          <a-button type="primary" @click="saveClick">{{
            t('routes.productlist.productEditSave')
          }}</a-button>
          <a-button type="primary" @click="calcuteClick">计算</a-button>
          <a-input v-model:value="resultValue"></a-input>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { v4 as guid } from 'uuid';
  import { getCalcuteValue } from '../Index';
  interface option {
    id: string;
    name: string;
    value: string;
    dbTag: string;
  }

  export default defineComponent({
    components: {
      BasicModal,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage: msg } = useMessage();
      const { error } = msg;
      const materailSelf = ref();
      const settingTags = ref<option[]>([]);
      const formulaInput = ref();
      const formulaValue = ref();
      const resultValue = ref('');

      const parseFormula = (str) => {
        if (!str) return null;
        var parts = str.split('@@@@@');
        if (parts.length == 2) {
          return parts[0];
        }
        return null;
      };

      const init = (response) => {
        settingTags.value = [];
        formulaValue.value = '用量=';
        resultValue.value = '';
        materailSelf.value = null;
        var initValue = parseFormula(response);
        if (initValue) {
          formulaValue.value = initValue;
        }
      };
      const getOptons = (data) => {
        if (data.product) {
          settingTags.value.push({
            id: guid(),
            name: '产品长度',
            value: data.product.data.length,
            dbTag: '#' + data.product.id + '.length#',
          });
          settingTags.value.push({
            id: guid(),
            name: '产品宽度',
            value: data.product.data.width,
            dbTag: '#' + data.product.id + '.width#',
          });
          settingTags.value.push({
            id: guid(),
            name: '产品高度',
            value: data.product.data.height,
            dbTag: '#' + data.product.id + '.height#',
          });
        }
        if (data.module) {
          settingTags.value.push({
            id: guid(),
            name: '模块长度',
            value: data.module.data.length,
            dbTag: '#' + data.module.id + '.length#',
          });
          settingTags.value.push({
            id: guid(),
            name: '模块宽度',
            value: data.module.data.width,
            dbTag: '#' + data.module.id + '.width#',
          });
          settingTags.value.push({
            id: guid(),
            name: '模块高度',
            value: data.module.data.height,
            dbTag: '#' + data.module.id + '.height#',
          });
        }

        if (data.material) {
          materailSelf.value = data.material;
          settingTags.value.push({
            id: guid(),
            name: '物料长度',
            value: data.material.data.length,
            dbTag: '#' + data.material.id + '.length#',
          });
          settingTags.value.push({
            id: guid(),
            name: '物料宽度',
            value: data.material.data.width,
            dbTag: '#' + data.material.id + '.width#',
          });
          settingTags.value.push({
            id: guid(),
            name: '物料高度',
            value: data.material.data.height,
            dbTag: '#' + data.material.id + '.height#',
          });

          if (data.otherMaterial && data.otherMaterial.length > 0) {
            for (let item of data.otherMaterial) {
              settingTags.value.push({
                id: guid(),
                name: item.data.name,
                value: item.data.usage,
                dbTag: '#' + item.id + '.usage#',
              });
            }
          }
        }
      };
      const formulaOptons = ref<option[]>([
        {
          id: guid(),
          name: '取整',
          value: '',
          dbTag: '',
        },
      ]);
      const [registerModal] = useModalInner((response) => {
        setBackGround();
        init(response.str);
        getOptons(response.data);
      });

      function setBackGround() {
        const elements = document.querySelectorAll('.ant-modal-mask');
        if (elements.length == 2) {
          elements[1].style.background = 'rgba(0,0,0,0)';
        }
      }
      function insertStr(str, index, insertStr) {
        return str.substring(0, index) + insertStr + str.substring(index);
      }
      function setCursorPosition(elem, index) {
        var len = 0;
        setTimeout(() => {
          var val = elem.value;
          len = val.length;
          if (len < index) return;
          setTimeout(() => {
            elem.focus();
            if (elem.setSelectionRange) {
              elem.setSelectionRange(index, index);
            } else {
              var range = elem.createTextRange();
              range.moveStart('character', -len);
              range.moveEnd('character', -len);
              range.moveStart('character', index);
              range.moveEnd('character', 0);
              range.select();
            }
          }, 10);
        }, 50);
      }
      function tagSelect(data) {
        let selectionStart = formulaInput.value.resizableTextArea.textArea.selectionStart;
        if (data.name == '取整') {
          formulaValue.value = insertStr(formulaValue.value, selectionStart, data.name + '()');
          setCursorPosition(
            formulaInput.value.resizableTextArea.textArea,
            selectionStart + data.name.length + 1,
          );
        } else {
          formulaValue.value = insertStr(formulaValue.value, selectionStart, data.name);
          setCursorPosition(
            formulaInput.value.resizableTextArea.textArea,
            selectionStart + data.name.length,
          );
        }
      }

      function calcuteClick() {
        var calcute = formulaValue.value.replace('用量=', '');
        calcute = calcute.replace(new RegExp('（', 'g'), '(');
        calcute = calcute.replace(new RegExp('）', 'g'), ')');
        for (let item of settingTags.value) {
          calcute = calcute.replace(new RegExp(item.name, 'g'), item.value);
        }
        try {
          resultValue.value = getCalcuteValue(calcute);
        } catch (e) {
          error('计算失败' + e);
        }
      }

      function saveClick() {
        var saveStr = formulaValue.value.replace('用量=', '');
        saveStr = saveStr.replace(new RegExp('（', 'g'), '(');
        saveStr = saveStr.replace(new RegExp('）', 'g'), ')');
        for (let item of settingTags.value) {
          saveStr = saveStr.replace(new RegExp(item.name, 'g'), item.dbTag);
        }
        materailSelf.value.data.materialUsageFormula = formulaValue.value + '@@@@@' + saveStr;
        emit('saveUsage', '');
      }
      return {
        formulaInput,
        formulaValue,
        resultValue,
        settingTags,
        t,
        registerModal,
        tagSelect,
        formulaOptons,
        inputChange: () => {
          if (
            formulaValue.value[0] !== '用' ||
            formulaValue.value[1] !== '量' ||
            formulaValue.value[2] !== '='
          ) {
            formulaValue.value = '用量=';
          }
        },
        handleBlur: () => {},
        saveClick,
        calcuteClick,
      };
    },
  });
</script>
<style lang="less">
  .custom-Tag {
    border-radius: 5px;
    cursor: pointer;
  }
  .custom-Tag:hover {
    color: rgb(244 63 94);
  }
  .operation-Tag {
    border-radius: 5px;
    cursor: pointer;
  }
  .operation-Tag:hover {
    color: #3255d1;
  }
</style>
