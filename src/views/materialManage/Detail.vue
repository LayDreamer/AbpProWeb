<template>
  <div>
    <WebDetail v-if="showMedia == 'web'"></WebDetail>
    <PhoneDetail v-if="showMedia == 'phone'"></PhoneDetail>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import WebDetail from './components/web/WebDetail.vue';
import PhoneDetail from './components/web/WebDetailSmall.vue';
import EventBus from '/@/utils/EventBus';

  export default defineComponent({
    name: 'MaterialLibrayDetail',
    components: { WebDetail, PhoneDetail },
    setup() {
      const showMedia = ref('');
      onMounted(() => {
        if (document.body.clientWidth < 650) {
          EventBus.emit('hideBdsHead', false);
          showMedia.value = 'phone';
        } else {
          showMedia.value = 'web';
        }
        window.addEventListener('resize', hiddenHead);
      });
      onBeforeUnmount(() => {
        window.removeEventListener('resize', hiddenHead);
      });
      const hiddenHead = () => {
        if (document.body.clientWidth <= 650) {
          showMedia.value = 'phone';
          EventBus.emit('hideBdsHead', false);
        } else {
          showMedia.value = 'web';
          EventBus.emit('hideBdsHead', true);
        }
      };
      return { showMedia };
    },
  });
</script>
<style scoped></style>
