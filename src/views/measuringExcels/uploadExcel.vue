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
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="文件名" name="excelPath">
            <div class="flex flex-row">
              <a-input v-model:value="formdata.excelPath" />
              <a-tooltip title="上传文件">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="excelUpload"
                />
              </a-tooltip>
            </div>
          </a-form-item>

          <a-form-item label="允许偏差值" name="designDiffer">
            <a-input v-model:value="formdata.designDiffer" allow-clear />
          </a-form-item>
          <a-form-item label="最小空腔值" name="minCavityValue">
            <a-input v-model:value="formdata.minCavityValue" allow-clear />
          </a-form-item>
        </a-form>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { UploadMeasuringExcel, AddMeasuringExcel } from '/@/views/measuringExcels/index';
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
        selectOptions.value = response.treeData;
      });

      const formRef = ref();
      const fileInput = ref<HTMLElement | null>(null);
      const formdata = ref({
        designDiffer: '',
        minCavityValue: '',
        excelPath: '',
      });
      const excelPath = ref();
      const selectOptions = ref<SelectProps['options']>([]);
      const selectValue = ref([]);
      const rules = ref({
        excelPath: [{ required: true, message: '请上传表格', trigger: 'change' }],
        // designDiffer: [{ required: true, message: '请输入设计允许偏差值', trigger: 'change' }],
        // minCavityValue: [
        //   { required: true, message: '请输入产品安装最小空腔值', trigger: 'change' },
        // ],
      });
      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          var response = await UploadMeasuringExcel({
            data: files[0],
            fileName: files[0].name,
          });
          if (response.success) {
            formdata.value.excelPath = files[0].name;
            excelPath.value = response.data;
            formRef.value.validate();
            success('上传成功');
          } else {
            error('上传失败' + response.error);
          }
          input.value = '';
        }
      };

      function excelUpload() {
        let oBtn = fileInput.value as HTMLInputElement;
        oBtn.accept =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
        oBtn.click();
      }

      function ok() {
        const successMsg = id == undefined ? '提交成功' : '修改成功';
        const faildMsg = id == undefined ? '提交失败' : '修改失败';
        const json = {
          designDiffer: formdata.value.designDiffer,
          minCavityValue: formdata.value.minCavityValue,
          fileAddress: excelPath.value,
        };
        formRef.value
          .validate()
          .then(async () => {
            try {
              var response = await AddMeasuringExcel(json);
              if (response.success) {
                success(successMsg);
              } else {
                error(response.data);
              }
              emit('submit', id == undefined ? true : false);
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
        excelUpload,
        handleFileChange,
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
