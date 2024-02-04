<template>
  <div>
    <BasicModal
      title="显示"
      :canFullscreen="false"
      :minHeight="100"
      :destroyOnClose="true"
      :maskClosable="false"
      @ok="ok"
      @cancel="cancel"
      @register="registerModal"
    >
      <BasicTree
        ref="treeRef"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        v-model:checkedKeys="checkedKeys"
        checkable
        :default-expand-all="true"
    /></BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, toRaw, unref, nextTick } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { hideTreeNode, getStandardAndPolicyTreesAsync } from './index';
  export default defineComponent({
    name: 'HideOrDisplay',
    components: {
      BasicModal,
      BasicTree,
    },
    setup(_, { emit }) {
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const { t } = useI18n();
      const treeData = ref<any[]>([]);
      const checkedKeys = ref<string[]>([]);
      const [registerModal, { closeModal }] = useModalInner(async () => {
        await getStandardAndPolicyTreesAsync().then((dtos) => {
          for (let item of dtos) {
            item.children = item.children?.filter((x) => x.hide);
          }
          treeData.value = dtos;
        });

        nextTick(() => {
          getTree().expandAll(true);
        });
      });
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      const ok = async () => {
        try {
          var selectedKeys = toRaw(checkedKeys.value);
          await hideTreeNode(selectedKeys, false).then(() => {
            closeModal();
            emit('reload');
          });
        } catch (error) {}
      };
      const cancel = () => {
        closeModal();
      };
      return {
        registerModal,
        cancel,
        ok,
        treeData,
        t,
        checkedKeys,
        getTree,
        treeRef,
      };
    },
  });
</script>
