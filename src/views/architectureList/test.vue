<template>
  <div class="p-4">
    <div class="flex flex-row">
      <div class="w-80 h-250 bg-green-100" :class="{ treestick: istreeStick }">绿色吸顶</div>
      <div :class="{ 'w-4': !istreeStick, 'w-84': istreeStick }"></div>
      <div class="flex flex-col flex-1">
        <div
          class="w-full h-30 bg-yellow-100"
          :class="{ searchstick: issearchStick }"
          :style="searchStickStyles"
          >黄色吸顶</div
        >
        <div class="mt-4 w-full h-2000 bg-red-100" ref="content">
          <div v-for="(index, i) in 100">
            <p>测试</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

  export default defineComponent({
    setup() {
      const content: any = ref(null);
      const istreeStick = ref(false);
      const issearchStick = ref(false);
      const searchStickStyles = ref({
        width: '100%',
      });
      function handleScroll() {
        let scrollTop =
          window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        istreeStick.value = scrollTop > 800 ? true : false;
        if (scrollTop > 300) {
          issearchStick.value = true;
        } else {
          issearchStick.value = false;
        }
        const flex1Width = window.getComputedStyle(content.value).width;
        searchStickStyles.value.width = flex1Width;
      }
      onMounted(() => {
        const body = document.body;
        body.addEventListener('scroll', handleScroll);
      });

      onBeforeUnmount(() => {
        const body = document.body;
        body.removeEventListener('scroll', handleScroll);
      });

      return {
        content,
        istreeStick,
        issearchStick,
        searchStickStyles,
        handleScroll,
      };
    },
  });
</script>

<style scoped>
  .treestick {
    position: fixed;
    top: 80px;
    height: 800px;
    z-index: 100;
  }

  .searchstick {
    position: fixed;
    top: 80px;
    z-index: 100;
  }
</style>
