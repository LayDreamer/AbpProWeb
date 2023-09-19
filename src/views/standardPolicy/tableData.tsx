import { FormSchema } from '/@/components/Form/index';
import { BasicColumn } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';

export const searchList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 6; i++) {
    result.push({
      id: i,
      title: 'Vben Admin',
      description: ['Vben', '设计语言', 'Typescript'],
      content: '基于Vue Next, TypeScript, Ant Design实现的一套完整的企业级后台管理系统。',
      time: '2020-11-14 11:20',
    });
  }
  return result;
})();

export const actions: any[] = [
  { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'InputSearch',
    label: '项目名',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
];

export function getColumn(): BasicColumn[] {
  return [
    {
      title: '标准编号',
      dataIndex: 'id',
    },
    {
      title: '标准名称',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: '行业',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: '批准日期',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: '实施日期',
      dataIndex: 'id',
      width: 120,
    },
  ];
}

export const standardSchema: DescItem[] = [
  {
    field: 'number',
    label: '编号',
  },
  {
    field: 'theme',
    label: '主题',
  },
  {
    field: 'publishingUnit',
    label: '发布单位',
  },
  {
    field: 'publishingDate',
    label: '发布日期',
  },
  {
    field: 'ImplementationDate',
    label: '实施日期',
  },
];


// export  const policySchema: DescItem[] = [
//   {
//     field: 'publicshingUnit',
//     label: '发布单位',
//   },
//   {
//     field: 'theme',
//     label: '主题',
//   },
//   {
//     field: 'publicshingDate',
//     label: '发布日期',
//   },
//   {
//     field: 'ImplementationDate',
//     label: '实施日期',

//   },
// ];




