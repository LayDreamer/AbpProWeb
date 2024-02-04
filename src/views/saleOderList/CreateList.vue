<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      :title="title"
      :canFullscreen="false"
      :maskClosable="false"
      destroyOnClose
      @register="registerModal"
      @ok="ok"
    >
      <div class="m-4">
        <a-form
          ref="formRef"
          :model="formdata"
          :rules="rules"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="单位转化文件" name="convertFile">
            <div class="flex flex-row">
              <a-input v-model:value="formdata.convertFile" allowClear />
              <a-tooltip title="上传文件">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="ConvertFileUpload"
                />
              </a-tooltip>
            </div>
          </a-form-item>

          <a-form-item label="拆单表" name="splitFile">
            <div class="flex flex-row">
              <a-input v-model:value="formdata.splitFile" allowClear />
              <a-tooltip title="上传文件">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="splitFileUpload"
                />
              </a-tooltip>
            </div>
          </a-form-item>

          <a-form-item label="含产成品编码深化清单:" name="productCodeFile">
            <div class="flex flex-row">
              <a-input v-model:value="formdata.productCodeFile" allowClear />
              <a-tooltip title="上传文件">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="CodeFileUpload"
                />
              </a-tooltip>
            </div>
          </a-form-item>

          <a-form-item label="导出文件重命名" name="fileRename">
            <a-input v-model:value="formdata.fileRename" allow-clear />
          </a-form-item>

          <a-form-item label="备注" name="notes">
            <a-input v-model:value="formdata.notes" allow-clear />
          </a-form-item>

          <a-form-item label="要求到货日期" name="requireDate">
            <a-date-picker
              v-model:value="formdata.requireDate"
              type="date"
              placeholder="选择一个日期"
              style="width: 100%"
            />
          </a-form-item>

          <a-form-item label="订单行类型" name="orderType">
            <a-select
              v-model:value="formdata.orderType"
              placeholder="请选择类型"
              :options="selectOptions"
              allowClear
          /></a-form-item>

          <a-form-item label="送达客户编码" name="customerCode">
            <a-input v-model:value="formdata.customerCode" allow-clear />
          </a-form-item>
        </a-form>
        <input
          type="file"
          ref="fileInput"
          accept=".xlsx,.xls,.xlsm"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { SelectProps } from 'ant-design-vue';
  import { Modal } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { createVNode, defineComponent, ref, toRaw } from 'vue';
  import { getErpDataByNameCode } from '../productlist/index';
  import { CreateNewSplitFile, CreateSaleOderFile, UploadFactoryFile } from './index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: {
      BasicModal,
    },
    setup(_, { emit }) {
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const title = ref('');
      let id = undefined;
      const [registerModal] = useModalInner((response) => {
        id = response.id;
        title.value = response.title;
        formdata.value = response.data;
      });
      let isConvert = false;
      let isSplit = false;
      let isCode = false;

      const formRef = ref();
      const fileInput = ref<HTMLElement | null>(null);
      const formdata = ref({
        convertFile: '',
        splitFile: '',
        productCodeFile: '',
        fileRename: '',
        notes: '',
        orderType: undefined,
        requireDate: dayjs(new Date()),
        customerCode: '',
      });
      const selectOptions = ref<SelectProps['options']>([
        {
          lable: '标准',
          value: '标准',
        },
        {
          lable: '配送',
          value: '配送',
        },
      ]);
      const selectValue = ref([]);
      const rules = ref({
        splitFile: [{ required: true, message: '请上传拆单表', trigger: 'change' }],
        fileRename: [{ required: true, message: '请重命名文件', trigger: 'change' }],
        notes: [{ required: true, message: '请输入备注', trigger: 'change' }],
        orderType: [{ required: true, message: '请选择订单行类型', trigger: 'change' }],
        customerCode: [{ required: true, message: '请输入送达客户编码', trigger: 'change' }],
      });

      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          var response = await UploadFactoryFile({
            data: files[0],
            fileName: files[0].name,
          });
          if (response.success) {
            if (isConvert) {
              formdata.value.convertFile = files[0].name;
              isConvert = false;
            } else if (isSplit) {
              formdata.value.splitFile = files[0].name;
              isSplit = false;
            } else if (isCode) {
              formdata.value.productCodeFile = files[0].name;
              isCode = false;
            }
            success('上传成功');
          } else {
            error('上传失败' + response.error);
          }
          input.value = '';
        }
      };

      function ConvertFileUpload() {
        isConvert = true;
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }
      function splitFileUpload() {
        isSplit = true;
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }
      function CodeFileUpload() {
        isCode = true;
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.click();
      }

      function selectIsExport(url) {
        Modal.confirm({
          title: '是否另存拆单文件（含产成品编码）',
          icon: createVNode(ExclamationCircleOutlined),
          content: '点击确认，另存；点击取消，弹窗关闭',
          onOk() {
            let path = encodeURI(url).replace(/\#/g, '%23');
            window.open(path, '_blank');
          },
          onCancel() {},
        });
      }

      function ok() {
        const successMsg = id == undefined ? '提交成功' : '修改成功';
        const faildMsg = id == undefined ? '提交失败' : '修改失败';
        formRef.value
          .validate()
          .then(async () => {
            try {
              var response = await CreateNewSplitFile({
                splitFilePath: formdata.value.splitFile,
                productCodeFilePath: formdata.value.productCodeFile,
                fileRename: formdata.value.fileRename,
              });
              if (response.startsWith('success:')) {
                let copySplitpath = response.replace('success:', '');
                if (copySplitpath != '') {
                  selectIsExport(copySplitpath);
                } else {
                  copySplitpath = formdata.value.splitFile;
                }
                const info = {
                  convertFilePath: formdata.value.convertFile,
                  splitFilePath: copySplitpath,
                  productCodeFilePath: formdata.value.productCodeFile,
                  fileRename: formdata.value.fileRename,
                  notes: formdata.value.notes,
                  requireDate: formdata.value.requireDate.format(),
                  orderType: toRaw(formdata.value.orderType),
                  customerCode: formdata.value.customerCode,
                };
                const currJson = {
                  saleOrder: info,
                  materials: null,
                };
                var result = await CreateSaleOderFile(currJson);
                if (result.success) {
                  success(successMsg);
                  emit('submit', id == undefined ? true : false);
                } else {
                  if (typeof result.data == 'string') {
                    error('错误:' + result.data);
                  } else {
                    const requestBody = {
                      data: [
                        {
                          no: result.data,
                        },
                      ],
                    };
                    const erpDatas = await getErpDataByNameCode(JSON.stringify(requestBody));
                    const json = {
                      saleOrder: info,
                      materials: erpDatas,
                    };
                    var result = await CreateSaleOderFile(json);
                    if (result.success) {
                      success(successMsg);
                      emit('submit', id == undefined ? true : false);
                    } else {
                      error('失败:' + result.data);
                    }
                  }
                }
              } else {
                error(response);
              }
            } catch (e) {
              error(faildMsg + e);
            }
          })
          .catch((e) => {
            error('表单输入有误' + e);
          });
      }
      return {
        title,
        fileInput,
        selectOptions,
        selectValue,
        formRef,
        formdata,
        rules,
        registerModal,
        ok,
        ConvertFileUpload,
        handleFileChange,
        splitFileUpload,
        CodeFileUpload,
        selectIsExport,
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
