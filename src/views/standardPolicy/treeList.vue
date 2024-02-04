<template>
  <div class="overflow-x-auto overflow-auto bg-white">
    <BasicTree
      ref="treeRef"
      draggable
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      :beforeRightClick="getRightMenuList"
      @select="handleSelect"
      @drop="dropChanged"
    >
      <template #headerTitle>
        <span style="font-weight: 500">{{ t('routes.standardPolicy.standardPolicyName') }}</span>
        <a-button
          v-if="hasPermission('YaSha.DataManager.StandardPolicy.Create')"
          style="margin-left: 60px"
          @click="hideOrDisplayClick"
        >
          显隐
        </a-button>
      </template>
    </BasicTree>
    <CreateTreeNode @register="registerCreateTree" @reload="reload" />
    <hideOrDisplayTree @register="registerHideOrDisplayTree" @reload="reload" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { StandardAndPolicyTreeDto } from '/@/services/ServiceProxies';
  import {
    getStandardAndPolicyTreesAsync,
    deleteStandardAndPolicyTreesAsync,
    exchangeTreeNodesAsync,
    hideTreeNode,
  } from './index';
  import { useModal } from '/@/components/Modal';
  import EventBus from '/@/utils/EventBus';
  import CreateTreeNode from './CreateStandardAndPolicyTree.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import hideOrDisplayTree from './hideOrDisplayTree.vue';

  export default defineComponent({
    name: 'ProductTree',
    components: {
      BasicTree,
      CreateTreeNode,
      hideOrDisplayTree,
    },
    setup(_, { emit }) {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const treeData = ref<StandardAndPolicyTreeDto[]>([]);
      const { t } = useI18n();
      const { createConfirm, createMessage } = useMessage();
      const { error } = createMessage;
      const { hasPermission } = usePermission();
      const [registerCreateTree, { openModal: openCreateTree }] = useModal();
      const [registerHideOrDisplayTree, { openModal: openHideOrDisplayTree }] = useModal();
      onMounted(async () => {
        await reload();
      });
      function getRightMenuList(node) {
        if (!hasPermission('YaSha.DataManager.StandardPolicy.Create')) {
          return;
        }
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
              label: '删除',
              icon: 'mdi:delete-outline',
              handler: async () => {
                let msg = t('common.askDelete');
                createConfirm({
                  iconType: 'warning',
                  title: t('common.tip'),
                  content: msg,
                  onOk: async () => {
                    await deleteStandardAndPolicyTreesAsync(node.id).then(async () => {
                      await reload();
                    });
                  },
                });
              },
            },
            {
              label: '隐藏',
              icon: 'mdi:hide-outline',
              handler: async () => {
                let msg = t('common.askHide');
                createConfirm({
                  iconType: 'warning',
                  title: t('common.tip'),
                  content: msg,
                  onOk: async () => {
                    await hideTreeNode([node.id], true).then(async () => {
                      await reload();
                    });
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
        await getStandardAndPolicyTreesAsync().then((dtos) => {
          for (let item of dtos) {
            item.children = item.children?.filter((x) => !x.hide);
          }
          treeData.value = dtos;
        });
        EventBus.emit('TreeReload', '');
      }
      async function hideOrDisplayClick() {
        openHideOrDisplayTree(true, {});
      }

      async function reload() {
        await fetch();
        getTree().expandAll(true);
      }

      function handleSelect(key, e) {
        let send: any = 0;
        if (key[0] !== undefined) {
          let ids: any[] = [];
          let size = 0;
          for (let item of treeData.value) {
            ids.push({ id: item.id, send: size });
            if (item.children)
              for (let tmp of item.children) {
                ids.push({ id: tmp.id, send: size++ });
              }
          }
          var find = ids.filter((x) => x.id === key[0]);
          send = find[0].send;
        }
        emit('slide', send);
        //EventBus.emit('TreeReload', key[0]);
      }

      async function dropChanged({ event, node, dragNode }) {
        const dragName = dragNode.name.props.name;
        const isSameLevel = (a, b) => {
          const aLevel = a.pos.split('-').length;
          const bLevel = b.pos.split('-').length;
          return aLevel === bLevel;
        };

        const isSameParent = (a, b) => {
          const aLevel = a.pos.split('-');
          const bLevel = b.pos.split('-');
          aLevel.pop();
          bLevel.pop();
          return aLevel.join('') === bLevel.join('');
        };

        const isDropToFirst = (a, b) => {
          const aLevel = a.pos.split('-');
          const bLevel = b.pos.split('-');
          aLevel.pop();
          return aLevel.join('') === bLevel.join('');
        };

        const canDrop =
          isDropToFirst(dragNode, node) ||
          (isSameParent(dragNode, node) &&
            isSameLevel(dragNode, node) &&
            dragName != '标准' &&
            dragName != '政策');

        if (canDrop) {
          await exchangeTreeNodesAsync(dragNode.id, node.id);
          await reload();
          EventBus.emit('TreeReload', '');
        } else {
          error('无法拖动');
        }
      }

      return {
        treeRef,
        treeData,
        t,
        reload,
        handleSelect,
        getRightMenuList,
        registerCreateTree,
        dropChanged,
        hasPermission,
        registerHideOrDisplayTree,
        hideOrDisplayClick,
      };
    },
  });
</script>
