<template>
  <div class="overflow-x-auto overflow-auto bg-white">
    <BasicTree
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      ref="treeRef"
      @select="handleSelect"
      :beforeRightClick="getRightMenuList"
    >
      <template #headerTitle>
        <span style="font-weight: 500">{{ t('routes.productlist.prodcutseries') }}</span>
      </template>
    </BasicTree>
    <CreateTreeNode @register="registerCreateTree" @reload="reload" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref, onBeforeMount, onBeforeUnmount } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { StandardAndPolicyTreeDto } from '/@/services/ServiceProxies';
  import { getStandardAndPolicyTreesAsync, deleteStandardAndPolicyTreesAsync } from './index';
  import { useModal } from '/@/components/Modal';
  import EventBus from '/@/utils/EventBus';
  import CreateTreeNode from './CreateStandardAndPolicyTree.vue';

  export default defineComponent({
    name: 'productTree',
    components: {
      BasicTree,
      CreateTreeNode,
    },
    setup() {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<StandardAndPolicyTreeDto[]>([]);
      const { t } = useI18n();
      const { createConfirm } = useMessage();
      const [registerCreateTree, { openModal: openCreateTree }] = useModal();
      onMounted(async () => {
        await reload();
      });
      function getRightMenuList(node) {
        if (node.parentId == null) {
          return [
            {
              label: '新增',
              icon: 'icon-park-outline:add',
              handler: () => {
                openCreateTree(true, {
                  id: node.id,
                });
              },
            },
          ];
        } else {
          return [
            {
              label: '新增',
              icon: 'icon-park-outline:add',
              handler: () => {
                openCreateTree(true, {
                  id: node.id,
                });
              },
            },
            {
              label: '删除',
              icon: 'mdi:delete-outline',
              handler: async () => {
                let msg = t('common.askDelete');
                createConfirm({
                  iconType: 'warning',
                  title: t('common.tip'),
                  content: msg,
                  onOk: async () => {
                    await deleteStandardAndPolicyTreesAsync(node.id);
                    await reload();
                  },
                });
              },
            },
          ];
        }
      }
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      async function fetch() {
        const postData = await getStandardAndPolicyTreesAsync();
        treeData.value = postData;
        EventBus.emit('TreeReload', '');
      }

      async function reload() {
        await fetch();
        getTree().expandAll(true);
      }

      function handleSelect(key, e) {
        EventBus.emit('TreeReload', key[0]);
      }
      return {
        treeRef,
        treeData,
        t,
        reload,
        handleSelect,
        getRightMenuList,
        registerCreateTree,
        getTreeData: () => {
          return treeData;
        },
      };
    },
  });
</script>
