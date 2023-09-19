<template>
  <Card title="功能介绍" v-bind="$attrs">
    <!-- <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template> -->
    <template v-for="item in items" :key="item">
      <CardGrid class="!md:w-1/3 !w-full">
        <span class="flex">
          <Icon :icon="item.icon" :color="item.color" size="30" />
          <span class="text-lg ml-4">{{ item.title }}</span>
        </span>
        <div class="flex mt-2 h-20 text-secondary"> {{ item.desc }} </div>
        <!-- <div class="flex justify-between text-secondary">
          <span>{{ item.group }}</span>
          <span>{{ item.date }}</span>
        </div> -->
        <div class="flex justify-end text-secondary">
          <!-- <a v-if="item.tag != 0" href="{{item.url}}"
            >{{ '查看' + item.title }} <Icon icon="ph:arrow-right"> </Icon>
          </a> -->
          <a-button type="link" @click="goUrl(item)">
            <div v-if="item.tag == 1"
              >查看
              <Icon icon="ph:arrow-right"></Icon>
            </div>
            <!-- <Icon icon="el:hand-right"></Icon> -->
          </a-button>
        </div>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { devItems } from './data';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    components: { Card, CardGrid: Card.Grid, Icon },
    setup() {
      const go = useGo();
      function goUrl(data) {
        go(data.url);
      }
      return {
        items: devItems,
        goUrl,
      };
    },
  });
</script>
