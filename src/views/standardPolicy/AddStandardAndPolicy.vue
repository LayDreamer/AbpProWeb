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
          <a-form-item label="编号" name="number" v-if="standard">
            <a-input v-model:value="formdata.number" allow-clear />
          </a-form-item>
          <a-form-item label="名称" name="name">
            <a-input v-model:value="formdata.name" allow-clear />
          </a-form-item>
          <!-- <a-form-item label="行业" name="industry">
            <a-input v-model:value="formdata.industry" allow-clear />
          </a-form-item> -->
          <a-form-item label="发布单位" name="publishingUnit">
            <a-input v-model:value="formdata.publishingUnit" allow-clear />
          </a-form-item>
          <a-form-item label="发布日期" name="publishingDate">
            <a-date-picker
              v-model:value="formdata.publishingDate"
              type="date"
              placeholder="选择一个日期"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="实施日期" name="implementationDate">
            <a-date-picker
              v-model:value="formdata.implementationDate"
              type="date"
              placeholder="选择一个日期"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="失效日期" name="loseDate">
            <a-date-picker
              v-model:value="formdata.loseDate"
              type="date"
              placeholder="选择一个日期"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-tag color="blue">{{ status }}</a-tag>
          </a-form-item>
          <a-form-item label="发文字号" name="dispatchFont" v-if="!standard">
            <a-input v-model:value="formdata.dispatchFont" allow-clear />
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
          <a-form-item label="标准分类" name="standardCategory" v-if="standard">
            <a-select
              v-model:value="formdata.standardCategory"
              placeholder="请选择标准分类"
              :options="categoryOptions"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="图片地址" name="imagePath" v-if="standard">
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
          <a-form-item label="原文链接" name="linkPath" v-if="!standard">
            <a-input v-model:value="formdata.linkPath" />
          </a-form-item>
        </a-form>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, nextTick } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
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
      const title = ref('');
      const standard = ref(true);
      let id = undefined;
      const [registerModal] = useModalInner((response) => {
        id = response.id;
        title.value = response.title;
        if (response.title.includes('政策')) {
          standard.value = false;
          rules.value.pdfPath[0].required = false;
        } else {
          standard.value = true;
          rules.value.pdfPath[0].required = true;
        }
        formdata.value = response.data;
        selectOptions.value = response.treeData;
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
        pdfPath: '',
        linkPath: '',
        type: '',
        status: undefined,
        dispatchFont: '',
        loseDate: dayjs(new Date()),
        standardCategory: undefined,
      });
      const status = computed(() => {
        var now = dayjs(new Date());
        if (now.isAfter(formdata.value.loseDate)) {
          return '失效';
        } else if (now.isAfter(formdata.value.implementationDate)) {
          return '现行';
        } else if (now.isAfter(formdata.value.publishingDate)) {
          return '即将实施';
        }
        return '计算失败';
      });
      const selectOptions = ref<SelectProps['options']>([]);
      const selectValue = ref([]);
      const categoryOptions = ref<SelectProps['options']>([
        {
          label: '国家标准',
          value: 1,
        },
        {
          label: '地方标准',
          value: 2,
        },
        {
          label: '行业标准',
          value: 4,
        },
        {
          label: '团体标准',
          value: 8,
        },
        {
          label: '企业标准',
          value: 16,
        },
      ]);
      const rules = ref({
        number: [{ required: true, message: '请输入编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        //industry: [{ required: true, message: '请输入行业', trigger: 'change' }],
        publishingUnit: [{ required: true, message: '请输入发布单位', trigger: 'change' }],
        publishingDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
        implementationDate: [{ required: true, message: '请选择实施日期', trigger: 'change' }],
        loseDate: [{ required: true, message: '请选择实施日期', trigger: 'change' }],
        theme: [{ required: true, message: '请选择主题', trigger: 'blur', type: 'array' }],
        standardCategory: [
          { required: true, message: '请选择标准分类', trigger: 'blur', type: 'number' },
        ],
        imagePath: [{ required: true, message: '请上传图片', trigger: 'change' }],
        pdfPath: [{ required: true, message: '请上传PDF文件', trigger: 'change' }],
        linkPath: [{ required: true, message: '请输入原文链接', trigger: 'change' }],
        dispatchFont: [{ required: true, message: '请输入发文字号', trigger: 'change' }],
      });
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
              formdata.value.imagePath = response.data;
            } else {
              formdata.value.pdfPath = response.data;
            }
            formRef.value.validate();
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
        const successMsg = id == undefined ? '提交成功' : '修改成功';
        const faildMsg = id == undefined ? '提交失败' : '修改失败';
        formRef.value
          .validate()
          .then(async () => {
            try {
              await addStandardAndPolicy(id, {
                themes: formdata.value.theme,
                data: {
                  number: formdata.value.number,
                  name: formdata.value.name,
                  industry: formdata.value.industry,
                  publishingUnit: formdata.value.publishingUnit,
                  publishingDate: formdata.value.publishingDate.format(),
                  implementationDate: formdata.value.implementationDate.format(),
                  loseDate: formdata.value.loseDate.format(),
                  imagePath: formdata.value.imagePath,
                  pdfPath: formdata.value.pdfPath,
                  linkPath: formdata.value.linkPath,
                  type: formdata.value.type,
                  status: -1,
                  dispatchFont: formdata.value.dispatchFont,
                  standardCategory: formdata.value.standardCategory,
                },
              });
              success(successMsg);
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
        standard,
        title,
        fileInput,
        selectOptions,
        selectValue,
        categoryOptions,
        formRef,
        formdata,
        rules,
        status,
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
