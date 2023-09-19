<template>
  <div class="mt-2" >
    <Description @register="register"/>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  // import { PageWrapper } from '/@/components/Page';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  export default defineComponent({
    name: 'ProductRetrievalManagement',
    components: {
      Description,
    },
    setup() {
      const mockData: any = {
      productInfo:'项目:特房B1地块装修项目一深化下单、蓝城海宁[海自然字21181号地块] 精装修工程1#2#3#5#批一项目一一营销',
      materialInfo:'原材料合格仓一库存数量: 10 库存金额: 812.2',
        // username: 'test',
        // nickName: 'VB',
        // age: 123,
        // phone: '15695909xxx',
        // email: '190848757@qq.com',
        // addr: '厦门市思明区',
        // sex: '男',
        //certy: '3504256199xxxxxxxxx',
        // tag: 'orange',
      };
      const schema: DescItem[] = [
        // {
        //   field: 'username',
        //   label: '用户名',
        // },
        // {
        //   field: 'nickName',
        //   label: '昵称',
        //   render: (curVal, data) => {
        //     return `${data.username}-${curVal}`;
        //   },
        // },
        // {
        //   field: 'phone',
        //   label: '联系电话',
        // },
        // {
        //   field: 'email',
        //   label: '邮箱',
        // },
        {
          field: 'productInfo',
          label: '产品信息',
        },
        {
          field: 'materialInfo',
          label: '物料信息',
        },
      ];

      const [register] = useDescription({
        title: '详情页',
        data: mockData,
        schema: schema,
        layout: "vertical",
        column: 1,
        //  bordered: false,
      });
      return {
        mockData,
        schema,
        register,
      };
    },
  });
</script>
