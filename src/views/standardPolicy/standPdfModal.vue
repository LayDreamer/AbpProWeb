<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="文件详情"
    :height="350"
    :footer="null"
    :showOkBtn="false"
    :showCancelBtn="false"
    :maskClosable="false"
    :canFullscreen="false"
    :defaultFullscreen="true"
    :keyboard="false"
  >
    <div ref="wrapEl">
      <VuePdfApp style="height: 100vh" :pdf="standardPdf"></VuePdfApp>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import VuePdfApp from 'vue3-pdf-app';
  import 'vue3-pdf-app/dist/icons/main.css';
  import { useLoading } from '/@/components/Loading';
  export default defineComponent({
    components: { BasicModal, VuePdfApp },
    setup() {
      var standardPdf = ref('');
      const wrapEl = ref<ElRef>(null);
      const [] = useLoading({
        target: wrapEl,
        props: {
          tip: '加载中...',
          absolute: true,
        },
      });
      const [register, { closeModal }] = useModalInner(async (e) => {
        var data = e.data;
        standardPdf.value = data;
      });
      return {
        register,
        closeModal,
        wrapEl,
        standardPdf,
      };
    },
  });
</script>
