<template>
  <div class="p-4">
    <div class="flex flex-row">
      <HomeTree ref="homeTree" class="flex-1" v-if="!goDetail" />
      <div class="min-w-4/5 flex flex-col">
        <HomeBar
          :class="barClass"
          v-bind="detailData()"
          @addNew="addNew"
          @homeSearch="homeSearch"
        ></HomeBar>
        <HomeList v-if="!goDetail" @goMore="more" @goDes="handleViewDes"></HomeList>
        <DetailTable v-bind="tableSearch" v-if="goDetail" @backHome="backHome"></DetailTable>
      </div>
    </div>
    <AddModal @register="registerModal" @submit="addSubmit"></AddModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import HomeTree from '/@/views/standardPolicy/treeList.vue';
  import HomeBar from '/@/views/standardPolicy/toolBar.vue';
  import HomeList from '/@/views/standardPolicy/cardList.vue';
  import DetailTable from '/@/views/standardPolicy/DetailTable.vue';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  import AddModal from '/@/views/standardPolicy/AddStandardAndPolicy.vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    name: 'standardPolicyLib',
    components: {
      HomeTree,
      HomeBar,
      HomeList,
      DetailTable,
      AddModal,
    },
    setup() {
      const goDetail = ref(false);
      const homeTree = ref();
      const tableSearch = ref({
        id: '',
        code: '',
        name: '',
      });
      const [registerModal, { openModal: openAdd, closeModal: closeAdd }] = useModal();
      const go = useGo();
      const router = useRouter();
      function addNew() {
        openAdd(true, {
          treeData: homeTree.value.getTreeData(),
        });
      }

      const barClass = computed(() => {
        if (!goDetail.value) {
          return 'ml-4';
        } else return 'mb-4';
      });

      //首页搜索
      function homeSearch(data) {
        goDetail.value = true;
        tableSearch.value.id = '';
        tableSearch.value.code = data.code ? data.code : '';
        tableSearch.value.name = data.name ? data.name : '';
      }
      function more(id) {
        setTimeout(() => {
          goDetail.value = true;
          tableSearch.value.id = id;
        }, 100);
      }
      function backHome() {
        goDetail.value = false;
      }
      function addSubmit() {
        closeAdd();
      }

      // function handleViewDes(data) {
      //   go('/standardPolicy/standardDetail/' + data + '?msg=' + data.title);
      // }

      function handleViewDes(data) {
        router.push({
          path: '/standardPolicy/standardDetail',
          query: data,
        });
      }

      // function handleViewDes(data) {
      //   router.push({
      //     path: '/standardPolicy/standardDetail',
      //     query: {
      //       name: 'ming',
      //       age: 18,
      //     },
      //   });
      // }

      function detailData() {
        if (homeTree.value) {
          return {
            detail: goDetail.value,
            select: homeTree.value.getTreeData(),
          };
        }
        return {
          detail: goDetail.value,
          select: [],
        };
      }

      return {
        homeTree,
        goDetail,
        tableSearch,
        barClass,
        go,
        registerModal,
        addNew,
        homeSearch,
        more,
        backHome,
        handleViewDes,
        addSubmit,
        detailData,
      };
    },
  });
</script>
<style lang="less" scoped></style>
