<template>
  <div class="shop-body">
    <div class="shop-content" v-for="(item, index) in tableTitleInfo">
      <div class="shop-rowTitle" v-if="item.title != '操作'">
        {{ item.title }}
      </div>
      <div class="shop-row-line" :style="style(item)"></div>
      <div class="shop-rowContent" v-if="item.title == '材质'">
        <div class="shop-cell" style="position: relative" v-for="data in shopInfo">
          <img :src="data.materialImageUrl" />
          <div class="shop-cell-imgTextContent">
            <span>{{ data.materialType }}</span>
            <span>{{ data.materialTexture }}</span>
            <span>{{ data.materialSurface }}</span>
          </div>
        </div>
      </div>
      <div class="shop-rowContent" v-else-if="item.title == '供应商'">
        <div class="shop-cell" style="position: relative" v-for="data in shopInfo">
          <div class="flex flex-col">
            <div class="flex justify-center items-center text-xs">{{ data.supplierOverview }}</div>
            <div class="flex justify-center items-center text-xs">{{ data.supplierCode }}</div>
          </div>
        </div>
      </div>
      <div class="shop-rowContent" v-else-if="item.title == '价格'">
        <div class="shop-cell" style="position: relative" v-for="data in shopInfo">
          <div>{{ data.price }}</div>
        </div>
      </div>
      <div class="shop-rowContent" v-else-if="item.title == '规格'">
        <div class="shop-cell" style="position: relative" v-for="data in shopInfo">
          <div class="flex flex-col">
            <div class="flex justify-center items-center text-xs">{{ data.width }}mm</div>
            <div class="flex justify-center items-center text-xs">{{ data.thickness }}</div>
          </div>
        </div>
      </div>
      <div class="shop-rowContent" v-else-if="item.title == '起订量'">
        <div class="shop-cell" style="position: relative" v-for="data in shopInfo">
          <div>{{ data.quantity }}</div>
        </div>
      </div>
      <div class="shop-rowContent" v-else-if="item.title == '供货周期'">
        <div class="shop-cell" style="position: relative" v-for="data in shopInfo">
          <div>{{ data.deliveryCycle }}天</div>
        </div>
      </div>
      <div
        class="shop-rowContent"
        v-else-if="item.title == '操作'"
        :style="style(index)"
        style="margin-left: 24px; border-left: 1px solid rgb(215, 215, 215)"
      >
        <div
          class="shop-cell"
          style="position: relative; padding: 8px 0px"
          v-for="data in shopInfo"
        >
          <div @click="deleteShop(data)">
            <span
              class="iconify"
              data-icon="wpf:delete"
              style="color: #3774C5; font-size: 16px"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, Popover } from 'ant-design-vue';
import { createVNode, defineComponent, ref, watch } from 'vue';
import { getDetailData } from '../../index';
  export default defineComponent({
    props: {
      initData: {
        type: Array,
        required: true,
      },
    },
    emits: ['shopdelete', 'update:initData'],
    components: {
      APopover: Popover,
    },
    setup(_, { emit }) {
      watch(
        () => _.initData,
        async (v, o) => {
          if (o.length > v.length || v.length == 0) return;
          var ids = shopInfo.value.map((x) => x.id);
          var id = v.filter((x) => !ids.includes(x));
          if (id && id.length > 0) {
            await getDetailData(id).then((response) => {
              for (let item of response) {
                shopInfo.value.push(item);
              }
            });
          }
        },
        { deep: true },
      );
      const visible = ref(false);
      const shopInfo = ref<any[]>([]);
      const tableTitleInfo = ref([
        {
          title: '材质',
        },
        {
          title: '供应商',
        },
        {
          title: '价格',
        },
        {
          title: '规格',
        },
        {
          title: '起订量',
        },
        {
          title: '供货周期',
        },
        {
          title: '操作',
        },
      ]);
      const style = (index) => {
        if (index != tableTitleInfo.value.length - 1) {
          return {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'rgb(215,215,215)',
          };
        }
        return {};
      };

      const deleteShop = (data) => {
        Modal.confirm({
          title: () => '你想要删除这一条吗？',
          icon: () => createVNode(ExclamationCircleOutlined),
          async onOk() {
            emit(
              'update:initData',
              //更新父页面
              _.initData.filter((x) => x != data.id),
            );
            emit('shopdelete', {
              id: data.id,
              fn: () => {
                //删除操作更新当前页面
                shopInfo.value = shopInfo.value.filter((x) => x != data);
              },
            });
          },
          onCancel() {
            Modal.destroyAll();
          },
        });
      };
      return { visible, tableTitleInfo, shopInfo, style, deleteShop };
    },
  });
</script>
<style scoped>
  .shop-body {
    width: 100%;
    height: max-content;
    border: 1px solid rgb(215, 215, 215);
    margin-top: 32px;
    border-radius: 4px;
    background: white;
    overflow: auto;
    scrollbar-width: none; /* Firefox 64+ */
    overflow: -moz-scrollbars-none; /* Firefox */
  }

  .shop-body::-webkit-scrollbar {
    display: none;
  }

  .shop-content {
    position: relative;
    height: max-content;
    width: max-content;
    min-width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .shop-row-line {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    z-index: 101;
  }

  .shop-rowTitle {
    position: sticky;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    border-right: 1px solid rgb(215, 215, 215);
    min-height: 80px;
    width: 24px;
    background-color: rgb(242, 242, 242);
    color: #3774C5;
    font-size: 12px;
    text-align: center;
    writing-mode: vertical-lr;
    box-sizing: border-box;
    letter-spacing: 4px;
  }

  .shop-rowContent {
    display: flex;
    justify-content: flex-start;
  }

  .shop-cell {
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 0px;
    margin-left: 8px;
  }

  .shop-cell-imgTextContent {
    position: absolute;
    left: 8px;
    bottom: 8px;
    display: flex;
    flex-direction: column;
  }

  .shop-cell-imgTextContent span {
    font-size: 12px;
    color: #ffffff;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.99);
  }

  .shop-cell > img {
    width: 100%;
    height: 150px;
    /* max-width: 100%;
    max-height: 100%; */
  }

  .shop-cell > div {
    color: #555555;
    font-size: 12px;
    font-family: 'Arial Normal', 'Arial';
  }
</style>
