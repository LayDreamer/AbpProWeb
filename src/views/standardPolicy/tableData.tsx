import { BasicColumn } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';

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
    field: 'status',
    label: '状态',
  },
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
    label: '生效日期',
  },
  {
    field: 'loseDate',
    label: '失效日期',
  },
  {
    field: 'standardCategory',
    label: '标准分类',
  },
];

export const policySchema: DescItem[] = [
  {
    field: 'status',
    label: '状态',
  },
  {
    field: 'dispatchFont',
    label: '发文字号',
  },
  {
    field: 'publishingUnit',
    label: '发布单位',
  },
  {
    field: 'theme',
    label: '主题',
  },
  {
    field: 'publishingDate',
    label: '发布日期',
  },
  {
    field: 'ImplementationDate',
    label: '实施日期',
  },
  {
    field: 'loseDate',
    label: '失效日期',
  },
];
