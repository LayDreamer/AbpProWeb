<template>
  <!-- <h2 style="margin-top: 10px">use options (recommend)</h2> -->
  <a-space>
    <a-select
      ref="select"
      v-model:value="selectSystem"
      style="width: 120px"
      :options="systemData.map((pro) => ({ value: pro }))"
      @focus="focus"
      @change="handleChange"
      allowClear
      placeholder="请选择系统"
      show-search
    />
  </a-space>
  <a-space>
    <a-select
      ref="select"
      v-model:value="selectSeries"
      style="width: 180px; margin-left: 10px"
      :options="series != null ? series.map((ser) => ({ value: ser })) : null"
      @focus="focus"
      @change="handleChange"
      allowClear
      placeholder="请选择系列"
      show-search
    />
  </a-space>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, computed, watch } from 'vue';
  const systemData = ['墙面系统', '地面系统', '吊顶系统','厨房系统', '卫浴系统', '隔墙系统','门窗系统', '地暖系统', '调平系统'];
  const seriesData = {
    墙面系统: ['科睿墙面系列·科耐', '科睿墙面系列·科岩', '科宜墙面系列·科耐', '科宜墙面系列·科岩','科宜墙面系列·找平基层', '科誉墙面系列·科耐','科睿墙面系列·科晶(医疗)', '科睿墙面系列·科晶', '科睿墙面系列·科耐·背景墙'],
    地面系统: ['科睿地面系列·CS架空', '科睿地面系列·科岩','科宜地面系列·琉晶架空'],
    吊顶系统: ['科睿吊顶系列·琉晶'],
    厨房系统: ['科睿厨房系列·瓷砖'],
    卫浴系统: ['科睿卫浴系列·瓷砖', '科睿卫浴系列·科岩'],
    隔墙系统: ['科睿隔墙系列·CS隔墙', '科誉隔墙系列·钢制隔墙','科睿隔墙系列·RGS隔墙',],
    门窗系统: [],
    地暖系统: [],
    调平系统: ['科宜墙面调平系列·38系碳钢龙骨', '科睿墙面调平系列·50系碳钢龙骨',],
  };
  export default defineComponent({
    setup(_, { emit }) {
      const selectSystem = undefined;
      const selectSeries = undefined;
      const state = reactive({
        systemData,
        seriesData,
        selectSystem,
        selectSeries,
      });

      const series = computed(() => {
        return state.selectSystem != undefined ? seriesData[state.selectSystem] : undefined;
      });
      watch(
        () => state.selectSystem,
        () => {
          //val
          // state.selectSeries = val != null ? state.seriesData[val][0] : null;
          state.selectSeries = undefined;
        },
      );
      const focus = () => {
        //console.log('focus');
      };

      const handleChange = (value: string) => {
        // console.log(`selected ${value}`);
      };

      return {
        ref,
        focus,
        handleChange,
        ...toRefs(state),
        series,
        get: () => {
          return { state };
        },
        // searchBySystem: () => {
        //   emit('drawerSearch', state);
        // },
      };
    },
  });
</script>
