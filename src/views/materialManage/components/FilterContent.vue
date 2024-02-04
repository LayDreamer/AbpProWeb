<template>
  <div class="my-filter-content">
    <div class="my-fc-search">
      <div class="my-fc-search-top">
        <vxe-input v-model="option.data.sVal" @input="searchEvent"></vxe-input>
      </div>
      <div class="my-fc-search-content">
        <template v-if="option.data.sVals.length">
          <ul class="my-fc-search-list my-fc-search-list-head">
            <li class="my-fc-search-item">
              <vxe-checkbox v-model="option.data.all" @change="changeAllEvent">全选</vxe-checkbox>
            </li>
          </ul>
          <ul class="my-fc-search-list my-fc-search-list-body">
            <li class="my-fc-search-item" v-for="(item, sIndex) in option.data.sVals" :key="sIndex">
              <vxe-checkbox v-model="item.checked">{{ item.value }}</vxe-checkbox>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="my-fc-search-empty">无匹配项</div>
        </template>
      </div>
    </div>
    <div class="my-fc-footer">
      <vxe-button status="primary" @click="confirmFilterEvent">确认</vxe-button>
      <vxe-button @click="resetFilterEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';
  export default defineComponent({
    name: 'FilterContent',
    props: {
      params: Object as PropType<VxeGlobalRendererHandles.RenderFilterParams>,
    },
    setup(props) {
      const option = ref();

      const load = () => {
        const { params } = props;
        if (params) {
          const { column } = params;
          option.value = column.filters[0];
          // option.value.data.sVal = '';
          // option.value.data.all = false;
          // option.value.data.sVals = [];
        }
      };

      const searchEvent = () => {
        if (option) {
          if (option.value.data.sVal) {
            option.value.data.sVals = option.value.data.vals
              .filter((x) => x.includes(option.value.data.sVal))
              .map((x) => {
                return {
                  checked: false,
                  value: x,
                };
              });
          } else {
            option.value.data.sVals = [];
          }
        }
      };

      const changeAllEvent = () => {
        option.value.data.sVals.forEach((item) => {
          item.checked = option.value.data.all;
        });
      };

      const confirmFilterEvent = () => {
        const { params } = props;
        if (params && option) {
          const { $panel } = params;
          $panel.changeOption(null, true, option.value);
          $panel.confirmFilter();
        }
      };

      const resetFilterEvent = () => {
        const { params } = props;
        if (params) {
          const { $panel } = params;
          $panel.resetFilter();
        }
      };

      load();

      return {
        option,
        searchEvent,
        changeAllEvent,
        confirmFilterEvent,
        resetFilterEvent,
      };
    },
  });
</script>

<style>
  .my-filter-content {
    padding: 10px;
    user-select: none;
  }
  .my-filter-content .my-fc-search .my-fc-search-top {
    position: relative;
    padding: 5px 0;
  }
  .my-filter-content .my-fc-search .my-fc-search-top > input {
    border: 1px solid #ababab;
    padding: 0 20px 0 2px;
    width: 200px;
    height: 22px;
    line-height: 22px;
  }
  .my-filter-content .my-fc-search .my-fc-search-content {
    padding: 2px 10px;
  }
  .my-filter-content .my-fc-search-empty {
    text-align: center;
    padding: 20px 0;
  }
  .my-filter-content .my-fc-search-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .my-filter-content .my-fc-search-list-body {
    overflow: auto;
    height: 200px;
  }
  .my-filter-content .my-fc-search-list .my-fc-search-item {
    padding: 2px 0;
    display: block;
  }
  .my-filter-content .my-fc-footer {
    text-align: right;
    padding-top: 10px;
  }
  .my-filter-content .my-fc-footer button {
    padding: 0 15px;
    margin-left: 15px;
  }
</style>
