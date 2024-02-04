<template>
  <div class="m-4 mr-0 overflow-x-auto overflow-auto bg-white">
    <BasicTree
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      ref="treeRef"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    >
      <template #headerTitle>
        <span style="font-weight: 500">{{ t('routes.productlist.prodcutseries') }}</span>
      </template>
    </BasicTree>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ProductInventoryTreeDto } from '/@/services/ServiceProxies';
  import EventBus from '/@/utils/EventBus';
  import { getPrductArchitectureListTreesAsync } from '/@/views/productlist/index';
  export default defineComponent({
    name: 'productTree',
    components: {
      BasicTree,
    },
    setup() {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<ProductInventoryTreeDto[]>([]);
      const { t } = useI18n();
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      async function fetch() {
        const postData = await getPrductArchitectureListTreesAsync();
        treeData.value = postData;
      }
      function handleSelect(key, e) {
        EventBus.emit('treeSelect', e);
      }
      onBeforeMount(async () => {
        EventBus.on('refreshTree', await fetch);
      });
      onMounted(async () => {
        await fetch();
        getTree().expandAll(true);
      });
      onBeforeUnmount(async () => {
        EventBus.off('refreshTree', await fetch);
      });

      return {
        t,
        treeRef,
        treeData,
        handleSelect,
        refresh: async () => {
          await fetch();
          getTree().expandAll(true);
        },
      };
    },
  });
</script>
