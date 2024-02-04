<template>
  <div
    class="weui-pull-refresh"
    ref="scrollBox"
    :style="style"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <div class="weui-pull-refreshing-box">
      <div v-if="moveState < 2">{{ moveState === 0 ? '下拉即可刷新...' : '释放即可刷新...' }}</div>
      <div v-else><i class="weui-loading"></i> 加载中...</div>
    </div>
    <div class="weui-pull-present-box" ref="box">
      <slot></slot>
    </div>
    <div class="flex justify-center items-center weui-loadmore-box">
      <div v-if="moreState == 'lock'">加载中...</div>
      <div v-else-if="moreState == 'end'">亲没有更多了</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  export default defineComponent({
    name: 'pull-refresh',
    props: {
      loadMore: String,
    },
    emits: ['update:loadMore', 'refresh'],
    watch: {
      loadMore(newVal) {
        if (newVal == 'clear') {
          this.moreState = '';
        } else if (newVal == 'end') {
          this.moreState = 'end';
        }
      },
    },
    setup(_, { emit }) {
      const startY = ref('');
      const moveDistance = ref(0);
      const moveState = ref(0);
      const duration = ref(0);
      const box = ref();
      const moreState = ref('');
      const menuSearch = ref(false);
      watch(moveState, (newVal, oldVal) => {
        if (newVal === 0 && duration.value === 300) {
          moveDistance.value = 0;
        }
      });

      const style = computed(() => {
        if (!menuSearch.value) {
          return {
            transition: `${duration.value}ms`,
            transform: `translate3d(0,${moveDistance.value}px, 0)`,
          };
        } else {
          return {};
        }
      });

      const touchStart = (e) => {
        duration.value = 0;
        moveDistance.value = 0;
        startY.value = e.targetTouches[0].clientY;
      };

      const touchMove = (e) => {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 0) {
          if (moreState.value == 'lock') return;
          let csroll = box.value.getBoundingClientRect().top * -1;

          let cheight = box.value.scrollHeight;
          let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          //console.log(csroll + '-' + cheight + '-' + windowHeight);
          //106 = 50 + 48 + 8
          if (csroll + windowHeight - 56 > cheight) {
            moreState.value = 'lock';
          }
          return;
        }

        let move = e.targetTouches[0].clientY - startY.value;
        if (move > 0) {
          e.preventDefault();
          moveDistance.value = Math.pow(move, 0.8);
          if (moveDistance.value > 50) {
            if (moveState.value === 1) return;
            moveState.value = 1;
          } else {
            //否则 恢复原样
            if (moveState.value === 0) return;
            moveState.value = 0;
          }
        }
      };

      const touchEnd = (e) => {
        duration.value = 300;
        if (moveDistance.value > 50) {
          moveState.value = 2;
          moveDistance.value = 50;
          emit('refresh', () => {
            moveState.value = 0;
          });
        } else {
          moveDistance.value = 0;
          if (moreState.value == 'lock') {
            emit('update:loadMore', 'try');
          }
        }
      };

      return {
        box,
        style,
        moreState,
        moveState,
        menuSearch,
        touchStart,
        touchMove,
        touchEnd,
      };
    },
  });
</script>
<style scoped lang="less">
  .weui-pull-refresh {
    display: flex;
    //height: calc(100vh - 50px);
    flex-direction: column;
    margin-top: -50px;
    .weui-pull-refreshing-box {
      line-height: 50px;
      height: 50px;
      font-size: 14px;
      color: rgba(69, 90, 100, 0.6);
      text-align: center;
      margin-bottom: 8px;
    }
    .weui-pull-present-box {
      //background-color: lighten(#fff, 10%);
    }

    .weui-loadmore-box {
      line-height: 50px;
      height: 50px;
      font-size: 14px;
      color: rgba(69, 90, 100, 0.6);
      text-align: center;
      margin-bottom: 8px;
    }
  }
</style>
