<template>
  <div class="flex">
    <a-input-search
      v-model:value="searchValue"
      :placeholder="t('搜索')"
      allow-clear
      style="width: 200px"
      @search="search"
    />
    <div v-for="(item, i) in buttonInfo">
      <a-button
        type="link"
        style="margin-left: 10px"
        :class="{ active: item.select }"
        @click="buttonClick(item)"
        >{{ item.name }}</a-button
      >
    </div>

    <a-button type="primary" style="margin-left: 10px" @click="addNew" v-if="!detail"
      >新增</a-button
    >
    <a-select
      style="margin-left: 10px"
      class="w-9/20"
      v-model:value="selectValue"
      mode="multiple"
      placeholder="请选择主题"
      :options="options"
      :max-tag-count="5"
      @change="selectChange"
      v-if="detail"
    >
      <template #maxTagPlaceholder="omittedValues">
        <span style="color: red">+ {{ omittedValues.length }} ...</span>
      </template>
    </a-select>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { SelectProps } from 'ant-design-vue';
  import EventBus from '/@/utils/EventBus';
  export default defineComponent({
    props: {
      detail: {
        type: Boolean,
        required: true,
      },
      select: {
        type: Object,
      },
    },
    components: {
      Icon,
      PageWrapper,
    },
    watch: {
      select(_, old) {
        if (old.value) {
          for (let item of old.value) {
            if (item.children)
              for (let children of item.children) {
                if (this.options)
                  this.options.push({
                    label: children.name,
                    value: children.id,
                  });
              }
          }
        }
      },
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const searchValue = ref('');
      const buttonInfo = ref([
        { name: 'GB', select: false },
        { name: 'JG', select: false },
        { name: 'DB', select: false },
        { name: 'TB', select: false },
      ]);
      const options = ref<SelectProps['options']>([]);
      const selectValue = ref([]);
      const code = () => {
        for (let item of buttonInfo.value) {
          if (item.select) {
            return item.name;
          }
        }
        return '';
      };
      return {
        searchValue,
        buttonInfo,
        options,
        selectValue,
        t,
        addNew: () => {
          emit('addNew', '');
        },
        search: () => {
          if (searchValue.value == '') return;
          if (_.detail) {
            EventBus.emit('search', {
              name: searchValue.value,
              unit: searchValue.value,
              code: code(),
              select: selectValue.value,
            });
          } else {
            emit('homeSearch', {
              name: searchValue.value,
            });
          }
        },
        buttonClick: (item) => {
          for (let d of buttonInfo.value) {
            if (d.name == item.name) {
              d.select = !d.select;
              continue;
            }
            d.select = false;
          }
          if (_.detail) {
            EventBus.emit('search', {
              code: code(),
              select: selectValue.value,
            });
          } else {
            const c = code();
            if (c == '') return;
            emit('homeSearch', {
              code: c,
            });
          }
        },
        selectChange: () => {
          EventBus.emit('search', {
            code: code(),
            select: selectValue.value,
          });
        },
      };
    },
  });
</script>

<style scoped>
  .active {
    background-color: #efbd47;
  }
</style>
