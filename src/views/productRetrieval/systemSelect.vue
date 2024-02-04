<template>
  <a-space>
    <a-select
      ref="select"
      v-model:value="selectSystem"
      style="width: 120px"
      :options="systemData.map((pro) => ({ value: pro }))"
      @focus="focus"
      @change="handleChange"
      allowClear
      placeholder="系统"
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
      allowClear
      placeholder="系列"
      show-search
    />
  </a-space>
  <a-space>
    <a-select
      ref="select"
      v-model:value="selectLevel"
      style="width: 80px; margin-left: 10px"
      :options="levelOptions"
      @focus="focus"
      allowClear
      placeholder="层级"
      show-search
    />
  </a-space>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, computed } from 'vue';
  const systemData = [
    '墙面系统',
    '地面系统',
    '吊顶系统',
    '厨房系统',
    '卫浴系统',
    '隔墙系统',
    '门窗系统',
    '地暖系统',
    '调平系统',
  ];
  const seriesData = {
    墙面系统: [
      '科睿墙面系列·科耐',
      '科睿墙面系列·科岩',
      '科宜墙面系列·科耐',
      '科宜墙面系列·科岩',
      '科宜墙面系列·找平基层',
      '科誉墙面系列·科耐',
      '科睿墙面系列·科晶(医疗)',
      '科睿墙面系列·科晶',
      '科睿墙面系列·科耐·背景墙',
    ],
    地面系统: ['科睿地面系列·CS架空', '科睿地面系列·科岩', '科宜地面系列·琉晶架空'],
    吊顶系统: ['科睿吊顶系列·琉晶'],
    厨房系统: ['科睿厨房系列·瓷砖'],
    卫浴系统: ['科睿卫浴系列·瓷砖', '科睿卫浴系列·科岩'],
    隔墙系统: ['科睿隔墙系列·CS隔墙', '科誉隔墙系列·钢制隔墙', '科睿隔墙系列·RGS隔墙'],
    门窗系统: [],
    地暖系统: [],
    调平系统: ['科宜墙面调平系列·38系碳钢龙骨', '科睿墙面调平系列·50系碳钢龙骨'],
  };

  export default defineComponent({
    setup() {
      const selectSystem = ref();
      const selectSeries = ref();
      const selectLevel = ref();

      const levelOptions = computed(() => {
        if (selectSystem.value || selectSeries.value) {
          return [
            {
              lable: '产品',
              value: '产品',
            },
          ];
        } else {
          return [
            {
              lable: '产品',
              value: '产品',
            },
            {
              lable: '模块',
              value: '模块',
            },
            {
              lable: '物料',
              value: '物料',
            },
          ];
        }
      });
      const state = reactive({
        systemData,
        seriesData,
        selectSystem,
        selectSeries,
        selectLevel,
      });

      const series = computed(() => {
        return selectSystem.value ? seriesData[state.selectSystem] : undefined;
      });

      const handleChange = () => {
        if (selectSystem.value) {
          selectLevel.value = '产品';
        }
      };

      return {
        levelOptions,
        handleChange,
        focus,
        ...toRefs(state),
        series,
        get: () => {
          return { state };
        },
      };
    },
  });
</script>
