<template>
  <div class="m-4 mr-0 overflow-auto bg-white">
    <BasicTree
      toolbar
      search
      treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'displayName' }"
      ref="treeRef"
      @select="handleSelect"
    >
      <template #headerTitle>
        <span style="font-weight: 500"> {{ t('routes.familylibs.familylibs') }}</span>
      </template>
    </BasicTree>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { FamilyTreeDto } from '/@/services/ServiceProxies';
  import { getProductTreesAsync } from '/@/views/familylibs/index';
  export default defineComponent({
    name: 'FamilyTree',
    components: {
      BasicTree,
    },
    emits: ['select'],
    setup(_, { emit }) {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<FamilyTreeDto[]>([]);
      const { t } = useI18n();
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      async function fetch() {
        treeData.value = await getProductTreesAsync();
      }
      function handleSelect(keys) {
        emit('select', keys[0]);
      }
      onMounted(async () => {
        await fetch();
        getTree().filterByLevel(1);
      });
      return {
        t,
        treeRef,
        treeData,
        handleSelect,
      };
    },
  });
</script>
