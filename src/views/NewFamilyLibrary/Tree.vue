<template>
  <div class="m-4 mr-0 overflow-x-auto overflow-auto bg-white">
    <BasicTree
      :clickRowToExpand="false"
      :treeData="treeData"
      ref="treeRef"
      :fieldNames="{ key: 'id', title: 'displayName' }"
      @select="handleSelect"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref, onBeforeMount, onBeforeUnmount } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { getRootTree } from '/@/views/NewFamilyLibrary/index';
  import EventBus from '/@/utils/EventBus';
  export default defineComponent({
    name: 'NewFamilyTree',
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
        const postData = await getRootTree();
        treeData.value = postData;
      }
      function handleSelect(key, e) {
        EventBus.emit('newFamilyTreeSelect', e);
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
