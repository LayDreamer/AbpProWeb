<template>
  <div class="p-4">
    <div class="flex flex-row">
      <HomeTree v-if="!goDetail" class="treeContent" @slide="slide" />
      <div class="flex flex-col flex-1 w-full">
        <DetailTable
          class="detailTableContent"
          ref="tableRef"
          @detail="detail"
          @backHome="backHome"
          @add="add"
          @edit="edit"
        ></DetailTable>
        <div class="mt-4 w-full" v-if="!goDetail">
          <HomeList ref="homeList" @goMore="more" @goDes="handleViewDes"></HomeList>
        </div>
      </div>
    </div>
    <AddModal @register="registerModal" @submit="addSubmit"></AddModal>
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs';
  import { defineComponent, nextTick, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { getStandardAndPolicyTreesAsync } from './index';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  import AddModal from '/@/views/standardPolicy/AddStandardAndPolicy.vue';
  import HomeList from '/@/views/standardPolicy/cardList.vue';
  import DetailTable from '/@/views/standardPolicy/DetailTable.vue';
  import HomeTree from '/@/views/standardPolicy/treeList.vue';
  export default defineComponent({
    name: 'standardPolicyLib',
    components: {
      HomeTree,
      HomeList,
      DetailTable,
      AddModal,
    },
    setup() {
      const goDetail = ref(false);
      const tableRef = ref();
      const homeList = ref();
      const [registerModal, { openModal: openAdd, closeModal: closeAdd }] = useModal();
      const go = useGo();
      const router = useRouter();
      function slide(n) {
        var e = document.getElementsByClassName('ant-list-item-meta-title');
        nextTick(() => {
          if (e[n]) {
            document.body.scrollTo({
              top: e[n].offsetTop + 40,
              behavior: 'smooth',
            });
          }
        });
      }
      async function getOptions(name) {
        let selectOptions: any = [];
        await getStandardAndPolicyTreesAsync().then((response) => {
          var dtos = response.filter((x) => x.name == name);
          for (let item of dtos) {
            if (item.children) {
              for (let child of item.children) {
                selectOptions.push({
                  label: child.name,
                  value: child.id,
                });
              }
            }
          }
        });
        return selectOptions;
      }
      async function add(response) {
        openAdd(true, {
          id: null,
          title: response.type + '新增',
          treeData: await getOptions(response.type),
          data: {
            number: '',
            name: '',
            industry: '',
            publishingUnit: '',
            publishingDate: dayjs(new Date().toLocaleDateString()),
            implementationDate: dayjs(new Date().toLocaleDateString()),
            theme: [],
            imagePath: '',
            pdfPath: '',
            linkPath: '',
            type: response.type,
            status: undefined,
            dispatchFont: '',
            loseDate: dayjs(new Date(2049, 0, 1).toLocaleDateString()),
            standardCategory: undefined,
          },
        });
      }

      async function edit(response) {
        let selectData = await getOptions(response.table.type);
        openAdd(true, {
          id: response.table.id,
          title: response.table.type + '修改',
          treeData: selectData,
          data: {
            number: response.table.number,
            name: response.table.name,
            industry: '',
            publishingUnit: response.table.publishingUnit,
            publishingDate: dayjs(response.table.publishingDate),
            implementationDate: dayjs(response.table.implementationDate),
            theme: response.table.theme.map((x) => {
              var find = selectData.filter((y) => y.label == x);
              if (find.length > 0) return find[0].value;
            }),
            imagePath: response.table.imagePath,
            pdfPath: response.table.pdfPath,
            linkPath: response.table.linkPath,
            type: response.table.type,
            status: response.table.status,
            dispatchFont: response.table.dispatchFont,
            loseDate: dayjs(response.table.loseDate),
            standardCategory: response.table.standardCategory,
          },
        });
      }

      function detail() {
        goDetail.value = true;
      }
      function backHome() {
        goDetail.value = false;
      }

      function more(data) {
        goDetail.value = true;
        tableRef.value.moreSearch(data);
      }

      function addSubmit(value) {
        closeAdd();
        if (value) homeList.value.load();
        else tableRef.value.setTableSearch();
      }
      function handleViewDes(data) {
        router.push({
          path: '/standardPolicyManagement/standardDetail',
          query: { id: data.data.id, parentName: data.name },
        });
      }
      return {
        tableRef,
        homeList,
        goDetail,
        scrollTo,
        slide,
        detail,
        go,
        registerModal,
        add,
        edit,
        more,
        backHome,
        handleViewDes,
        addSubmit,
      };
    },
  });
</script>
<style scoped>
  .treeContent {
    width: 250px;
    height: 800px;
    position: sticky;
    top: 80px;
  }

  .detailTableContent {
    position: sticky;
    top: 80px;
    z-index: 400;
  }
</style>
