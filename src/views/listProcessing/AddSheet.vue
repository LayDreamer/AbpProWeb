<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      title="新增清单"
      :canFullscreen="false"
      :maskClosable="false"
      :loading="modalLoading"
      destroyOnClose
      @register="registerModal"
      @ok="ok"
    >
      <div class="p-4">
        <a-form
          ref="formRef"
          :model="formdata"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item
            label="清单文件"
            name="sheetName"
            :rules="[{ required: true, message: '请选择清单', trigger: 'change' }]"
          >
            <div class="flex flex-row">
              <a-input v-model:value="formdata.sheetName" style="width: 300px" />
              <a-tooltip title="上传清单">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="sheetUpload(ListProcessingSelectEnum.Sheet)"
                />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="表单配置" name="configName">
            <div class="flex flex-row">
              <a-select
                v-model:value="formdata.configName"
                placeholder="请选择表单配置"
                :options="configOptions"
                style="width: 300px"
              >
              </a-select>
              <a-tooltip title="上传表单配置">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="sheetUpload(ListProcessingSelectEnum.Config)"
                />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="规则配置" name="ruleName">
            <div class="flex flex-row">
              <a-select
                v-model:value="formdata.ruleName"
                placeholder="请选择规则配置"
                :options="ruleOptions"
                style="width: 300px"
              >
              </a-select>
              <a-tooltip title="上传规则配置">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="sheetUpload(ListProcessingSelectEnum.Rule)"
                />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="套料配置" name="nestName">
            <div class="flex flex-row">
              <a-select
                v-model:value="formdata.nestName"
                placeholder="请选择套料配置"
                :options="nestOptions"
                style="width: 300px"
              >
              </a-select>
              <a-tooltip title="上传套料配置">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="sheetUpload(ListProcessingSelectEnum.Nest)"
                />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="订单类型" name="orderType">
            <a-select
              v-model:value="formdata.orderType"
              placeholder="请选择标准分类"
              :options="orderOptions"
              style="width: 300px"
            >
            </a-select>
          </a-form-item>
          <a-form-item
            label="批量数"
            name="dt"
            :rules="[{ required: true, message: '请输入批量数', trigger: 'change' }]"
          >
            <a-input v-model:value="formdata.dt" allow-clear style="width: 300px" />
          </a-form-item>
        </a-form>
        <div>
          <a-checkbox
            v-model:checked="state.checkAll"
            :indeterminate="state.indeterminate"
            @change="onCheckAllChange"
          >
            一键生成
          </a-checkbox>
        </div>
        <a-divider />
        <a-checkbox-group v-model:value="formdata.sheets" :options="sheetOptions" />
        <a-checkbox v-model:checked="formdata.cover" style="margin-top: 20px">
          当工作表存在时覆盖
        </a-checkbox>
      </div>
    </BasicModal>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { GetSelects, UploadSelects, BuildSheet } from './index';
  import { ListProcessingSelectEnum } from '/@/services/ServiceProxies';
  interface ListProcessingFormData {
    sheetName: string | undefined;
    configName: string | undefined;
    ruleName: string | undefined;
    nestName: string | undefined;
    orderType: string | undefined;
    dt: string | undefined;
    sheets: Array<string>;
    cover: Boolean;
  }
  export default defineComponent({
    components: {
      BasicModal,
    },

    setup(_, { emit }) {
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const modalLoading = ref(false);
      const fileInput = ref<HTMLElement | null>(null);
      const formRef = ref();
      const formdata = ref<ListProcessingFormData>({
        sheetName: '',
        configName: undefined,
        ruleName: undefined,
        nestName: undefined,
        orderType: '顶面单',
        dt: '',
        sheets: ['装配单'],
        cover: false,
      });
      const rules = ref({});
      const configOptions = ref<any[]>([]);
      const ruleOptions = ref<any[]>([]);
      const nestOptions = ref<any[]>([]);
      const orderOptions = ref([
        {
          label: '顶面单',
          value: '顶面单',
        },
        {
          label: '墙面单',
          value: '墙面单',
        },
        {
          label: '卫浴单',
          value: '卫浴单',
        },
        {
          label: '厨房单',
          value: '厨房单',
        },
        {
          label: '地面单',
          value: '地面单',
        },
        {
          label: '隔墙单',
          value: '隔墙单',
        },
        {
          label: '门窗单',
          value: '门窗单',
        },
        {
          label: '基层五金单',
          value: '基层五金单',
        },
      ]);
      const sheetOptions = ['装配单', '车间五金', '发货五金', '开料单', '包装单', '总单'];
      const state = reactive({
        indeterminate: true,
        checkAll: false,
      });
      let type: ListProcessingSelectEnum;

      const [registerModal] = useModalInner(async () => {
        formdata.value = {
          sheetName: '',
          configName: undefined,
          ruleName: undefined,
          nestName: undefined,
          orderType: '顶面单',
          dt: '',
          sheets: ['装配单'],
          cover: false,
        };
        await getConfig();
        await getRule();
        await getNest();
        if (configOptions.value.length > 0) {
          formdata.value.configName = configOptions.value[0].value;
        }
        if (ruleOptions.value.length > 0) {
          formdata.value.ruleName = ruleOptions.value[0].value;
        }
        if (nestOptions.value.length > 0) {
          formdata.value.nestName = nestOptions.value[0].value;
        }
      });

      async function getConfig() {
        configOptions.value = [];
        var configs = await GetSelects(ListProcessingSelectEnum.Config);
        for (let item of configs) {
          configOptions.value.push({
            label: item,
            value: item,
          });
        }
      }

      async function getRule() {
        ruleOptions.value = [];
        var configs = await GetSelects(ListProcessingSelectEnum.Rule);
        for (let item of configs) {
          ruleOptions.value.push({
            label: item,
            value: item,
          });
        }
      }

      async function getNest() {
        nestOptions.value = [];
        var configs = await GetSelects(ListProcessingSelectEnum.Nest);
        for (let item of configs) {
          nestOptions.value.push({
            label: item,
            value: item,
          });
        }
      }

      async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          var response = await UploadSelects(type, {
            data: files[0],
            fileName: files[0].name,
          });
          if (response.success) {
            switch (type) {
              case ListProcessingSelectEnum.Config:
                await getConfig();
                break;
              case ListProcessingSelectEnum.Rule:
                await getRule();
                break;
              case ListProcessingSelectEnum.Nest:
                await getNest();
                break;
              case ListProcessingSelectEnum.Sheet:
                formdata.value.sheetName = files[0].name;
                break;
            }
            formRef.value.validate();
            success('上传成功');
          } else {
            error('上传失败' + response.error);
          }
          input.value = '';
        }
      }

      async function sheetUpload(p) {
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.accept =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
        type = p;
        oBtn.click();
      }

      const onCheckAllChange = (e: any) => {
        if (e.target.checked) {
          formdata.value.sheets = sheetOptions;
          state.indeterminate = false;
        } else {
          formdata.value.sheets = [];
          state.indeterminate = true;
        }
      };

      watch(
        () => formdata.value.sheets,
        (val) => {
          state.indeterminate = !!val.length && val.length < sheetOptions.length;
          state.checkAll = val.length === sheetOptions.length;
        },
      );

      function ok() {
        formRef.value
          .validate()
          .then(async () => {
            try {
              if (formdata.value.sheets.length == 0) {
                error('请选择生成表');
                return;
              }
              modalLoading.value = true;
              var dto = await BuildSheet({
                file: formdata.value.sheetName,
                config: formdata.value.configName,
                rule: formdata.value.ruleName,
                nest: formdata.value.nestName,
                type: formdata.value.orderType,
                dt: formdata.value.dt,
                sheets: formdata.value.sheets,
                replace: formdata.value.cover,
              });
              modalLoading.value = false;
              if (dto.success) {
                success('生成成功');
                emit('submit', true);
              } else {
                error('生成失败' + dto.error);
                emit('submit', false);
              }
            } catch (e) {
              error('生成失败' + e);
              emit('submit', false);
            }
          })
          .catch((e) => {
            error('表单输入有误' + e);
            emit('submit', false);
          });
      }

      return {
        modalLoading,
        fileInput,
        formRef,
        formdata,
        rules,
        configOptions,
        ruleOptions,
        nestOptions,
        ListProcessingSelectEnum,
        sheetOptions,
        state,
        orderOptions,
        handleFileChange,
        registerModal,
        ok,
        sheetUpload,
        onCheckAllChange,
      };
    },
  });
</script>
<style scoped>
  .custom-load {
    padding: 1px 5px;
  }
  .custom-load :deep() .app-iconify {
    width: 16px;
    font-size: 27px !important;
    display: block !important;
    line-height: 0;
  }
</style>
