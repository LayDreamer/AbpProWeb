<template>
  <div>
    <Web v-if="showMedia == 'web'"></Web>
    <Phone v-if="showMedia == 'phone'"></Phone>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import Phone from './components/phone/PhoneMain.vue';
import Web from './components/web/WebMain.vue';
import EventBus from '/@/utils/EventBus';

  export default defineComponent({
    name: 'MaterialLibrayHome',
    components: { Web, Phone },
    setup() {
      const showMedia = ref('');
      onMounted(() => {
        if (document.body.clientWidth < 650) {
          showMedia.value = 'phone';
          EventBus.emit('hideBdsHead', false);
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
