<template>
  <div class="h-full px-1">
    <div class="headDetail" v-if="view != 'main'" @click="backPrevious">
      <span class="iconify" data-icon="ion:arrow-back-sharp"></span>
    </div>
    <div class="footTool">
      <div class="flex flex-row justify-between">
        <div class="myicon" @click="toolBarClick('menu')">
          <span class="iconify" data-icon="mingcute:menu-fill"></span>
        </div>
        <div class="myicon" @click="toolBarClick('home')">
          <!-- fa-solid:history -->
          <span class="iconify" data-icon="fluent-mdl2:home-solid"></span>
        </div>
        <div class="myicon" style="color: #3774c5" @click="toolBarClick('camera')">
          <span class="iconify" data-icon="zondicons:camera"></span>
        </div>
        <div class="myicon" @click="toolBarClick('searchshow')">
          <span class="iconify" data-icon="map:search"></span>
        </div>
        <div class="myicon" @click="toolBarClick('shop')" style="position: relative">
          <img src="../../../../assets/svg/icon_pk.svg" style="width: 100%; height: 100%" />
          <div class="shop-number" v-if="shopNum">{{ shopNum }}</div>
        </div>
      </div>
    </div>
    <div>
      <div class="w-full h-8 mt-2 mb-1 relative z-10" v-if="phoneSearchShow">
        <a-input
          ref="phoneInputRef"
          v-model:value="searchValue"
          autocomplete="on"
          style="border-radius: 10px; height: 100%; font-size: 12px !important"
          placeholder="输入顺序码、物料编码、供应商编码"
          @pressEnter="toolBarClick('search')"
        >
        </a-input>
      </div>
      <div style="margin-bottom: 48px">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Badge } from 'ant-design-vue';
import { defineComponent, nextTick, ref } from 'vue';
  export default defineComponent({
    components: { ABadge: Badge },
    props: {
      shopNum: Number,
      view: String,
    },
    setup(_, { emit }) {
      const phoneInputRef = ref();
      const phoneSearchShow = ref(false);
      const searchValue = ref('');

      const toolBarClick = (type) => {
        let data = '';

        if (type == 'searchshow') {
          phoneSearchShow.value = !phoneSearchShow.value;
          if (phoneSearchShow.value) {
            nextTick(() => {
              phoneInputRef.value.focus();
            });
          }
        } else {
          phoneSearchShow.value = false;
        }
        if (type == 'search') {
          data = searchValue.value;
        }
        emit('event', {
          type: type,
          data: data,
        });
      };

      const closeToolBarSearch = () => {
        if (phoneSearchShow.value) {
          phoneSearchShow.value = false;
        }
      };

      const backPrevious = () => {
        emit('back', '');
      };

      return {
        phoneInputRef,
        phoneSearchShow,
        searchValue,
        toolBarClick,
        closeToolBarSearch,
        backPrevious,
      };
    },
  });
</script>
<style scoped>
  .headDetail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 32px;
    padding: 0px 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: rgb(248, 248, 248);
    font-size: 24px;
    color: gray;
    z-index: 1200;
  }

  .footTool {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1200;
    padding: 8px 16px;
    background: rgb(248, 248, 248);
    border-color: rgb(148 163 184);
  }

  .myicon {
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: gray;
  }

  .shop-number {
    position: absolute;
    top: -5px;
    right: -11px;
    z-index: auto;
    min-width: 16px;
    height: 16px;
    padding: 0 6px;
    color: #fff;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    white-space: nowrap;
    text-align: center;
    background: #ff4d4f;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
  }
</style>
