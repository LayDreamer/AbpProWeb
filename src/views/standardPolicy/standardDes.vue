<template>
  <PageWrapper :title="`详情`" contentBackground @back="goBack">
    <div class="flex flex-row p-3 m-3 bg-white">
      <div
        v-if="response.lib.imagePath != '' && parentName == '标准'"
        class="flex w-3/13 min-h-115 max-h-120"
        style="border-width: 1px"
      >
        <img class="p-2" v-bind:src="response.lib.imagePath" />
      </div>
      <div class="ml-10 flex-1">
        <label style="font-size: 25px; font-weight: bold">{{ response.lib.name }}</label>
        <div class="flex justify-end">
          <a-button
            v-if="
              response.lib.linkPath != '' && response.lib.linkPath != null && parentName == '政策'
            "
            type="primary"
            style="margin-right: 20px"
            @click="handleCopy"
            >{{ t('阅读原文链接') }}</a-button
          >
          <div class="custom-Icon" v-if="!response.collect" @click="toggleFavorite">
            <span
              class="iconify"
              style="font-size: 32px; color: #eb2f96"
              data-icon="clarity:favorite-line"
            >
            </span>
          </div>
          <div class="custom-Icon" v-if="response.collect" @click="toggleFavorite">
            <span
              class="iconify"
              style="font-size: 32px; color: #eb2f96"
              data-icon="clarity:favorite-solid"
            >
            </span>
          </div>
        </div>
        <a-divider />
        <Description
          :bordered="true"
          size="middle"
          :column="2"
          :data="mockData"
          :schema="desItem"
        />
        <!-- <div class="mt-5" v-if="response.lib.pdfPath != ''">
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
        </div> -->
      </div>
      <!-- <div v-if="parentName == '政策'" class="ml-4 w-2/13 grow max-h-120">
        <div class="inline-flex">
          <span
            class="iconify"
            style="font-size: 26px; color: gray; margin-right: 5px"
            data-icon="tabler:screenshot"
          />
          <label style="font-size: 16px; font-weight: bold"> 原文截图:</label>
        </div>
        <ImageClipBoard v-bind:id="id"></ImageClipBoard>
      </div>-->
    </div>
    <a-divider />
    <!-- <pdfModal @register="registerPdfModal" /> -->
    <div v-if="response.lib.pdfPath != ''" class="p-3 m-3 bg-white">
      <div class="inline-flex mb-1">
        <span
          class="iconify"
          style="font-size: 25px; color: rgb(232, 23, 23)"
          data-icon="fa:file-pdf-o"
        />
        <label style="margin-left: 10px; font-size: 18px; font-weight: bold"> PDF文件:</label>
        <!-- <a-button
          v-if="response.lib.pdfPath != ''"
          style="margin-left: 20px"
          type="primary"
          @click="downloadModal"
          >{{ t('直接下载') }}</a-button
        > -->
      </div>

      <VuePdfApp style="height: 85vh; width: 100%" :pdf="response.lib.pdfPath"></VuePdfApp>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, unref, ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Description, DescItem } from '/@/components/Description/index';
  import { standardSchema, policySchema } from './tableData';
  import { useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import pdfModal from './StandPdfModal.vue';
  import { useModal } from '/@/components/Modal';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { UploadProps } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { getCardDetail, favoriteLib } from '/@/views/standardPolicy/index';
  import { StarTwoTone, HeartTwoTone } from '@ant-design/icons-vue';
  import ImageClipBoard from '/@/views/standardPolicy/PastImage.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import VuePdfApp from 'vue3-pdf-app';
  import dayjs from 'dayjs';
  export default defineComponent({
    components: {
      PageWrapper,
      Description,
      pdfModal,
      PlusOutlined,
      StarTwoTone,
      HeartTwoTone,
      ImageClipBoard,
      VuePdfApp,
    },
    setup() {
      const { t } = useI18n();
      const route = useRoute();
      const id = route.query.id;
      const parentName = route.query.parentName;
      const { setTitle } = useTabs();
      const go = useGo();
      const [registerPdfModal, { openModal: PdfInfo }] = useModal();
      const { createMessage: msg } = useMessage();
      const { success, warning } = msg;
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      const { hasPermission } = usePermission();
      const response = ref({
        lib: {
          id: '',
          number: '',
          name: '',
          industry: '',
          publishingUnit: '',
          publishingDate: '',
          implementationDate: '',
          imagePath: '',
          pdfPath: '',
          linkPath: '',
          dispatchFont: '',
          loseDate: '',
          standardCategory: undefined,
        },
        themes: [],
        collect: false,
      });
      // var item: DescItem[] = [];
      const desItem = ref<DescItem[]>([]);
      const mockData = ref();
      const previewVisible = ref(false);
      const fileList = ref<UploadProps['fileList']>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://img.shouji.com.cn/simg/20170918/9389366385.jpg',
        },
      ]);
      onMounted(async () => {
        response.value = await getCardDetail(id);
        setTitle('详情: ' + response.value.lib.name);
        const formattedImplementationDate =
          response.value.lib.implementationDate !== undefined
            ? new Date(response.value.lib.implementationDate).toLocaleDateString()
            : undefined;
        const formattedPublishingDate =
          response.value.lib.publishingDate !== undefined
            ? new Date(response.value.lib.publishingDate).toLocaleDateString()
            : undefined;
        const formattedLoseDate =
          response.value.lib.loseDate !== undefined
            ? new Date(response.value.lib.loseDate).toLocaleDateString()
            : undefined;
        let category = '';
        if (response.value.lib.standardCategory) {
          switch (response.value.lib.standardCategory) {
            case 1:
              category = '国家标准';
              break;
            case 2:
              category = '地方标准';
              break;
            case 4:
              category = '行业标准';
              break;
            case 8:
              category = '团体标准';
              break;
            case 16:
              category = '企业标准';
              break;
          }
        }
        mockData.value = {
          number: response.value.lib.number,
          theme: response.value.themes.map((x) => x + '；'),
          publishingUnit: response.value.lib.publishingUnit,
          publishingDate: formattedPublishingDate,
          ImplementationDate: formattedImplementationDate,
          dispatchFont: response.value.lib.dispatchFont,
          loseDate: formattedLoseDate,
          standardCategory: category,
          status: computed(() => {
            var now = dayjs(new Date());
            if (now.isAfter(formattedLoseDate)) {
              return '失效';
            } else if (now.isAfter(formattedImplementationDate)) {
              return '现行';
            } else if (now.isAfter(formattedPublishingDate)) {
              return '即将实施';
            }
            return '计算失败';
          }),
        };
        desItem.value = parentName == '标准' ? standardSchema : policySchema;
      });
      function goBack() {
        go('/standardPolicyManagement/standardPolicyLib');
      }
      function OpenPdfModal() {
        PdfInfo(true, {
          data: response.value.lib.pdfPath,
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
        let fileUrl = response.value.lib.pdfPath; //所下载文件的网络地址
        let fileName = response.value.lib.name; //下载成功后保存的文件名
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
        const value = response.value.lib.linkPath;
        if (!value) {
          warning('阅读链接为空！');
          return;
        }
        // clipboardRef.value = value;
        // if (unref(copiedRef)) {
        //   success('复制链接成功！');
        // }
        window.open(value, '_blank');
      }

      async function toggleFavorite() {
        response.value.collect = !response.value.collect;
        await favoriteLib(id, response.value.collect);
      }

      return {
        id,
        response,
        mockData,
        standardSchema,
        policySchema,
        desItem,
        previewVisible,
        fileList,
        t,
        goBack,
        registerPdfModal,
        OpenPdfModal,
        downloadModal,
        PdfInfo,
        GetThemes,
        handleCopy,
        toggleFavorite,
        hasPermission,
        parentName,
      };
    },
  });
</script>
<style scoped>
  .custom-Icon {
    cursor: pointer;
  }
</style>
