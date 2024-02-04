<template>
  <BasicModal
    v-bind="$attrs"
    title="显示"
    :footer="null"
    :canFullscreen="false"
    :maskClosable="false"
    :draggable="false"
    destroyOnClose
    width="90%"
    :height="800"
    @register="registerModal"
  >
    <div class="p-2 h-190">
      <iframe
        v-if="url != '' && url.includes('.dwg')"
        :src="`https://bds.chinayasha.com/bdsautodeskservice/?src=` + url"
        style="height: 100%; width: 100%; border: 2px dashed rgb(156 163 175)"
      ></iframe>
      <VuePdfApp
        v-if="url != '' && url.includes('.pdf')"
        :pdf="url"
        style="height: 100%"
      ></VuePdfApp>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import VuePdfApp from 'vue3-pdf-app';
  import 'vue3-pdf-app/dist/icons/main.css';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: {
      BasicModal,
      VuePdfApp,
    },
    setup(_, { emit }) {
      const url = ref('');
      const [registerModal, { closeModal }] = useModalInner((response) => {
        url.value = response.url;
      });
      return {
        registerModal,
        url,
      };
    },
  });
</script>
<style></style>
