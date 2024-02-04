<template>
  <div class="m-4 mr-0 overflow-x-auto overflow-auto bg-white">
    <BasicTree
      :clickRowToExpand="false"
      :treeData="treeData"
      ref="treeRef"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
      style="height: 800px"
    >
    </BasicTree>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref, onBeforeMount, onBeforeUnmount } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { getTreeDataAsync } from '/@/views/architectureList/index';
  import EventBus from '/@/utils/EventBus';
  export default defineComponent({
    name: 'productTree',
    components: {
      BasicTree,
    },
    setup() {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<any[]>([]);
      const { t } = useI18n();
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      async function fetch() {
        const postData = await getTreeDataAsync();
        treeData.value = postData;
      }
      async function handleSelect(key, e) {
        await fetch();
        EventBus.emit('architeTreeSelect', e);
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
