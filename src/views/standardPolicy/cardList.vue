<template>
  <PageWrapper>
    <div v-loading="loadingRef" loading-tip="加载中...">
      <a-list item-layout="horizontal" :pagination="pagination" :data-source="showData">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <div style="margin-top: 20px">
                  <a-button
                    type="link"
                    @click="goDetail(item.id)"
                    style="font-size: large; font-weight: bold"
                    >{{ item.title }}
                    <Icon icon="ic:round-double-arrow" color="gray" />
                  </a-button>
                </div>
              </template>
              <template #description>
                <div :class="`${prefixCls}__content`">
                  <a-list>
                    <a-row :gutter="16">
                      <template v-for="desItem in item.description">
                        <!-- :key="desItem.id" -->
                        <a-col :span="6">
                          <a-list-item>
                            <a-card
                              :loading="loadingCard"
                              :hoverable="true"
                              :class="`${prefixCls}__card`"
                              @click="goDes(desItem)"
                            >
                              <!-- @click="standards(desItem.title)" -->
                              <!-- <template #extra>
                              </template> -->
                              <!-- <div :class="`${prefixCls}__card-detail`">
                              </div> -->
                              <div :class="`${prefixCls}__card-title`" style="font-weight: bold">
                                <!-- <Icon
                                  class="icon"
                                  v-if="item.icon"
                                  :icon="item.icon"
                                  :color="item.color"
                                /> -->
                                {{ desItem.title }}
                              </div>
                              <div>
                                <label>{{ desItem.description }} </label>
                                <label>{{ desItem.number }} </label>
                              </div>
                            </a-card>
                          </a-list-item>
                        </a-col>
                      </template>
                    </a-row>
                  </a-list>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { cardDataList } from './index';
  import { PageWrapper } from '/@/components/Page';
  import { Card, Row, Col, List } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EventBus from '/@/utils/EventBus';
  import dayjs from 'dayjs';
  interface DataItem {
    title: string;
    description: [];
  }
  export default defineComponent({
    name: 'standardPolicy',
    components: {
      Icon,
      PageWrapper,
      [Card.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;
      const namevalue = ref<string>('');
      const showData = ref<DataItem[]>([]);
      const selectData = ref<DataItem>();
      const loadingCard = ref(false);
      const loadingRef = ref(false);
      const pagination = {
        // onChange: (page: number) => {
        //   console.log(page);
        // },
        pageSize: 3,
      };
      onBeforeMount(() => {
        EventBus.on('TreeReload', load);
      });
      onMounted(() => {});
      onBeforeUnmount(() => {
        EventBus.off('TreeReload', load);
      });

      async function load(key) {
        loadingCard.value = true;
        loadingRef.value = true;
        showData.value = await cardDataList(key);
        loadingRef.value = false;
        setTimeout(() => {
          loadingCard.value = false;
        }, 1000);
      }

      function goDetail(id) {
        emit('goMore', id);
      }

      function goDes(data) {
        data.publishingDate = dayjs(data.publishingDate).format('YYYY-MM-DD');
        data.implementationDate = dayjs(data.implementationDate).format('YYYY-MM-DD');
        emit('goDes', data);
      }

      return {
        prefixCls: 'list-card',
        //list: desList,
        pagination,
        loadingCard,
        namevalue,
        showData,
        selectData,
        loadingRef,
        t,
        goDetail,
        goDes,
      };
    },
  });
</script>
<style lang="less" scoped>
  .list-card {
    &__link {
      margin-top: 10px;
      font-size: 14px;

      a {
        margin-right: 30px;
      }

      span {
        margin-left: 5px;
      }
    }

    &__card {
      width: 100%;
      margin-bottom: -8px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        color: @text-color;
        font-size: 16px;
        font-weight: 500;

        .icon {
          margin-top: -5px;
          margin-right: 10px;
          font-size: 38px !important;
        }
      }

      &-detail {
        padding-top: 10px;
        padding-left: 30px;
        color: @text-color-secondary;
        font-size: 14px;
      }
    }
  }
</style>
