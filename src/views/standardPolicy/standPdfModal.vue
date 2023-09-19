<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="文件详情"
    :height="350"
    :footer="false"
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
<!-- pdf="http://10.10.12.33:9091/StandardAndPolicy/c08b816f-38d2-42b0-9321-a06ae23980c5.pdf" -->
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import VuePdfApp from 'vue3-pdf-app';
  import 'vue3-pdf-app/dist/icons/main.css';
  import { useLoading } from '/@/components/Loading';

  export default defineComponent({
    components: { BasicModal, VuePdfApp },
    setup() {
      var standardPdf = ref('');
      const wrapEl = ref<ElRef>(null);
      const [openWrapLoading, closeWrapLoading] = useLoading({
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

      // const fact = computed(() => {
      //   return standardPdf.value;
      // });

      return {
        // fact,
        register,
        closeModal,
        wrapEl,
        standardPdf,
      };
    },
  });
</script>
