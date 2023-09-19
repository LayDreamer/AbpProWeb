<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      title="新增"
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
          <a-form-item label="编号" name="number">
            <a-input v-model:value="formdata.number" allow-clear />
          </a-form-item>
          <a-form-item label="名称" name="name">
            <a-input v-model:value="formdata.name" allow-clear />
          </a-form-item>
          <a-form-item label="行业" name="industry">
            <a-input v-model:value="formdata.industry" allow-clear />
          </a-form-item>
          <a-form-item label="发布单位" name="publishingUnit">
            <a-input v-model:value="formdata.publishingUnit" allow-clear />
          </a-form-item>
          <a-form-item label="发布日期" name="publishingDate">
            <a-date-picker
              v-model:value="formdata.publishingDate"
              show-time
              type="date"
              placeholder="选择一个日期"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="实施日期" name="implementationDate">
            <a-date-picker
              v-model:value="formdata.implementationDate"
              show-time
              type="date"
              placeholder="选择一个日期"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="主题" name="theme">
            <a-select
              v-model:value="formdata.theme"
              mode="multiple"
              placeholder="请选择主题"
              :options="selectOptions"
              :max-tag-count="3"
              allowClear
            >
              <template #maxTagPlaceholder="omittedValues">
                <span style="color: red">+ {{ omittedValues.length }} ...</span>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item label="图片地址" name="imagePath">
            <div class="flex flex-row">
              <a-input v-model:value="formdata.imagePath" />
              <a-tooltip title="上传图片">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="imageUpload"
                />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="PDF地址" name="pdfPath">
            <div class="flex flex-row">
              <a-input v-model:value="formdata.pdfPath" />
              <a-tooltip title="上传PDF">
                <a-button
                  class="custom-load"
                  type="link"
                  preIcon="ep:upload-filled"
                  @click="pdfUpload"
                />
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="原文链接" name="linkPath">
            <a-input v-model:value="formdata.linkPath" />
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
  import type { Rule } from 'ant-design-vue/es/form';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadStandardAndPolicyFile, addStandardAndPolicy } from '/@/views/standardPolicy/index';
  import dayjs from 'dayjs';
  export default defineComponent({
    components: {
      BasicModal,
    },
    setup(_, { emit }) {
      const { createMessage: msg } = useMessage();
      const { error, success } = msg;
      const [registerModal] = useModalInner((response) => {
        formdata.value = {
          number: '',
          name: '',
          industry: '',
          publishingUnit: '',
          publishingDate: dayjs(new Date()),
          implementationDate: dayjs(new Date()),
          theme: [],
          imagePath: '',
          serverimagePath: '',
          pdfPath: '',
          serverpdfPath: '',
          linkPath: '',
        };
        getOptions(response.treeData);
      });
      let isImage = true;
      const formRef = ref();
      const fileInput = ref<HTMLElement | null>(null);
      const formdata = ref({
        number: '',
        name: '',
        industry: '',
        publishingUnit: '',
        publishingDate: dayjs(new Date()),
        implementationDate: dayjs(new Date()),
        theme: [],
        imagePath: '',
        serverimagePath: '',
        pdfPath: '',
        serverpdfPath: '',
        linkPath: '',
      });
      const selectOptions = ref<SelectProps['options']>([]);
      const selectValue = ref([]);
      const rules: Record<string, Rule[]> = {
        // number: [{ required: true, message: '请输入编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        industry: [{ required: true, message: '请输入行业', trigger: 'change' }],
        publishingUnit: [{ required: true, message: '请输入发布单位', trigger: 'change' }],
        publishingDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
        implementationDate: [{ required: true, message: '请选择实施日期', trigger: 'change' }],
        theme: [{ required: true, message: '请输入主题', trigger: 'blur', type: 'array' }],
        imagePath: [{ required: true, message: '请选择图片', trigger: 'change' }],
        pdfPath: [{ required: true, message: '请选择PDF', trigger: 'change' }],
        //linkPath: [{ required: true, message: '请输入原文链接', trigger: 'change' }],
      };
      function getOptions(data) {
        for (let item of data) {
          if (item.children)
            for (let children of item.children) {
              if (selectOptions.value)
                selectOptions.value.push({
                  label: children.name,
                  value: children.id,
                });
            }
        }
      }
      const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        let files = input.files;
        if (files) {
          var response = await uploadStandardAndPolicyFile({
            data: files[0],
            fileName: files[0].name,
          });
          if (response.success) {
            if (isImage) {
              formdata.value.imagePath = files[0].name.trim();
              formdata.value.serverimagePath = response.data;
            } else {
              formdata.value.pdfPath = files[0].name.trim();
              formdata.value.serverpdfPath = response.data;
            }
            success('上传成功');
          } else {
            error('上传失败' + response.error);
          }
          input.value = '';
        }
      };
      function imageUpload() {
        let oBtn = fileInput.value as HTMLInputElement;
        isImage = true;
        oBtn.accept = 'image/gif,image/jpeg,image/jpg,image/png,image/svg';
        oBtn.click();
      }

      function pdfUpload() {
        let oBtn = fileInput.value as HTMLInputElement;
        isImage = false;
        oBtn.accept = 'application/pdf';
        oBtn.click();
      }

      function ok() {
        formRef.value
          .validate()
          .then(async () => {
            try {
              await addStandardAndPolicy({
                themes: formdata.value.theme,
                data: {
                  number: formdata.value.number,
                  name: formdata.value.number,
                  industry: formdata.value.industry,
                  publishingUnit: formdata.value.publishingUnit,
                  publishingDate: formdata.value.publishingDate.format(),
                  implementationDate: formdata.value.implementationDate.format(),
                  imagePath: formdata.value.serverimagePath,
                  pdfPath: formdata.value.serverpdfPath,
                  linkPath: formdata.value.linkPath,
                },
              });
              success('提交成功');
              emit('submit', '');
            } catch (e) {
              error('提交失败' + e);
            }
          })
          .catch((e) => {
            error('表单输入有误' + e);
          });
      }
      return {
        fileInput,
        selectOptions,
        selectValue,
        formRef,
        formdata,
        rules,
        registerModal,
        ok,
        handleFileChange,
        imageUpload,
        pdfUpload,
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
