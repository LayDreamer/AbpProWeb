<template>
  <PageWrapper :title="`详情`" contentBackground @back="goBack">
    <div class="flex p-4 m-4 desc-wrap bg-white">
      <img class="w-3/13 min-h-100 max-h-120" v-bind:src="standardImage" />
      <!-- src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" -->
      <div class="ml-5 w-10/13">
        <label style="font-size: 20px; font-weight: bold">{{ standardTitle }}</label>
        <div class="flex justify-end">
          <a-button
            v-if="standardLinkPath != '' && standardLinkPath != null"
            type="primary"
            style="margin-right: 10px"
            @click="handleCopy"
            >{{ t('复制原文链接') }}</a-button
          >
          <a-button disabled type="primary">{{ t('收藏') }}</a-button>
        </div>
        <a-divider />
        <Description
          size="large"
          :bordered="true"
          :column="3"
          :data="mockData"
          :schema="standardSchema"
        />
        <!-- :collapseOptions="{ canExpand: true, helpMessage: 'help me' }" -->
        <a-divider />

        <div class="mt-10">
          <a-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :showUploadList="{
              showRemoveIcon: false,
              showDownloadIcon: true,
            }"
            @preview="OpenPdfModal"
            @download="downloadModal"
          >
          </a-upload>
          <a-modal :visible="previewVisible" :title="previewTitle" :footer="null">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </div>
      <div>
        <pdfModal @register="registerPdfModal" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, unref, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Description } from '/@/components/Description/index';
  import { standardSchema, policySchema } from './tableData';
  import { useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import VuePdfApp from 'vue3-pdf-app';
  import 'vue3-pdf-app/dist/icons/main.css';
  import pdfModal from './standPdfModal.vue';
  import { useModal } from '/@/components/Modal';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { UploadProps } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  export default defineComponent({
    components: {
      PageWrapper,
      Description,
      VuePdfApp,
      pdfModal,
      PlusOutlined,
    },
    setup() {
      const { t } = useI18n();
      const route = useRoute();
      const { setTitle } = useTabs();
      const go = useGo();
      const [registerPdfModal, { openModal: PdfInfo }] = useModal();
      const { createMessage: msg } = useMessage();
      const { error, success, info, warning } = msg;
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const selectData = ref(route.query).value;
      const standardTitle = ref(selectData.title);
      const standardImage = selectData.imagePath?.toString();
      const standardPdf = selectData.pdfPath?.toString();
      const standardLinkPath = selectData.linkPath?.toString();
      // const standardThemes = GetThemes(selectData.theme);
      // const standardName = new URLSearchParams(window.location.search).get('msg');
      const mockData: any = {
        number: selectData.number,
        theme: selectData.theme,
        publishingUnit: selectData.publishingUnit,
        publishingDate: selectData.publishingDate,
        ImplementationDate: selectData.implementationDate,
      };

      const previewVisible = ref(false);
      const previewImage = ref('');
      const previewTitle = ref('');
      const fileList = ref<UploadProps['fileList']>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://img.shouji.com.cn/simg/20170918/9389366385.jpg',
        },
      ]);

      onMounted(() => {
        setTitle('详情: ' + selectData.title);
      });
      function goBack() {
        go('/standardPolicy/gyhStandardPolicyLib');
      }

      function OpenPdfModal() {
        PdfInfo(true, {
          data: standardPdf,
        });
      }

      function GetThemes(themes) {
        const result: any[] = [];
        for (let i = 0; i < themes.length; i++) {
          result.push({
            theme: themes[i] + ';',
          });
        }
        return result;
      }

      function downloadModal() {
        let fileUrl = standardPdf; //所下载文件的网络地址
        let fileName = standardTitle.value; //下载成功后保存的文件名
        const link = document.createElement('a');
        link.target = '_blank'; //如果该值为‘_self'该行可忽略
        link.style.display = 'none';
        fetch(fileUrl)
          .then((res) => res.blob())
          .then((blob) => {
            link.href = URL.createObjectURL(blob);
            link.download = fileName + '.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
          });
      }

      function handleCopy() {
        const value = standardLinkPath;
        if (!value) {
          warning('复制链接为空！');
          return;
        }
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          success('复制链接成功！');
        }
      }

      return {
        t,
        unref,
        ref,
        mockData,
        standardSchema,
        goBack,
        standardTitle,
        standardImage,
        standardPdf,
        standardLinkPath,
        registerPdfModal,
        OpenPdfModal,
        downloadModal,
        PdfInfo,
        GetThemes,
        previewVisible,
        previewImage,
        fileList,
        previewTitle,
        handleCopy,
      };
    },
  });
</script>
