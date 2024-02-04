<template>
  <PageWrapper>
    <div v-loading="loadingRef" loading-tip="加载中...">
      <a-list item-layout="horizontal" :data-source="showData">
        <!-- :pagination="pagination" -->
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <div class="flex" style="margin-top: 20px">
                  <label
                    style="font-size: large; font-weight: bold; min-width: 190px; max-width: 200px"
                  >
                    <Icon
                      v-if="item.parentName == '标准'"
                      icon="cil:tag"
                      color="gray"
                      class="mr-1"
                    />
                    <Icon
                      v-if="item.parentName == '政策'"
                      class="iconify"
                      style="font-size: 20px; color: gray"
                      data-icon="material-symbols:policy-outline"
                    />
                    {{ item.title }}</label
                  >
                </div>
              </template>

              <template #description>
                <div :class="`${prefixCls}__content`">
                  <a-list>
                    <a-row :gutter="10">
                      <template v-for="desItem in item.description">
                        <a-col :span="5">
                          <a-list-item>
                            <template v-if="desItem.title.length > 10" #title>{{
                              desItem.title
                            }}</template>
                            <a-card
                              :loading="loadingCard"
                              :hoverable="true"
                              :class="`${prefixCls}__card`"
                              :body-style="bstyle"
                              @click="goDes(desItem, item.parentName)"
                            >
                              <div
                                :class="`${prefixCls}__card-title`"
                                style="
                                  font-weight: bold;
                                  white-space: nowrap;
                                  word-break: keep-all;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
                                {{ desItem.title }}
                              </div>
                              <div :class="`${prefixCls}__card-detail`">
                                <label>{{ desItem.description }} </label>
                                <label>{{ desItem.number }} </label>
                              </div>
                            </a-card>
                          </a-list-item>
                        </a-col>
                      </template>
                      <div class="pl-10 pt-3 flex flex-col justify-center">
                        <a-button
                          type="primary"
                          size="large"
                          @click="goDetail(item)"
                          style="font-size: 14px; font-style: italic; margin-left: 20px"
                          >更多
                          <Icon icon="ic:round-double-arrow" color="white" />
                        </a-button>
                      </div>
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
  import { Card, Col, List, Row } from 'ant-design-vue';
  import { defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
  import { cardDataList } from './index';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EventBus from '/@/utils/EventBus';
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

      onBeforeMount(() => {
        EventBus.on('TreeReload', load);
      });
      onMounted(() => {});
      onBeforeUnmount(() => {
        EventBus.off('TreeReload', load);
      });

      async function load() {
        loadingCard.value = true;
        loadingRef.value = true;
        showData.value = await cardDataList();
        loadingRef.value = false;
        loadingCard.value = false;
      }

      function goDetail(data) {
        emit('goMore', data);
      }

      function goDes(data, name) {
        emit('goDes', { data: data, name: name });
      }

      return {
        prefixCls: 'list-card',
        bstyle: { padding: '5px' },
        //list: desList,
        //pagination,
        loadingCard,
        namevalue,
        showData,
        selectData,
        loadingRef,
        t,
        goDetail,
        goDes,
        load,
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
        font-size: 14px;
        font-weight: bold;

        .icon {
          margin-top: -5px;
          margin-right: 10px;
          font-size: 38px !important;
        }
      }

      &-detail {
        padding-top: 10px;
        // padding-left: 30px;
        color: @text-color-secondary;
        font-size: 12px;
      }
    }
  }
</style>
