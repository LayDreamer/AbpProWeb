import { h } from 'vue';
import { VXETable } from 'vxe-table';
import FilterContent from './components/FilterContent.vue';
export function getManageTableColumn(): any[] {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { type: 'seq', title: '序号', width: 50 },
    {
      title: '材料信息',
      children: [
        {
          title: '材料状态',
          field: 'status',
          width: 150,

          editRender: {
            name: '$select',
            options: [
              { label: '供应商在市', value: '供应商在市' },
              { label: '供应商下市', value: '供应商下市' },
            ],
          },
          slots: {
            default: ({ row }) => {
              return h(
                'div',
                {
                  style: {
                    color: row.status == '供应商在市' ? 'red!important' : 'black!important',
                  },
                },
                row.status,
              );
            },
          },
          filters: [
            { label: '供应商在市', value: '供应商在市' },
            { label: '供应商下市', value: '供应商下市' },
          ],
        },
        {
          title: '材质图片',
          width: 100,
          field: 'materialImageUrl',
          slots: {
            default: 'materialImageUrl_default',
          },
        },
        {
          title: '材质类型',
          width: 180,
          field: 'materialType',
          editRender: {
            name: '$select',
            options: [
              {
                label: 'PVC（水性）',
                value: 'PVC（水性）',
              },
              {
                label: 'PVC（油性）',
                value: 'PVC（油性）',
              },
              {
                label: 'PET',
                value: 'PET',
              },
              {
                label: 'PP（国产）',
                value: 'PP（国产）',
              },
              {
                label: 'PP（进口）',
                value: 'PP（进口）',
              },
              {
                label: 'PVC墙布',
                value: 'PVC墙布',
              },
              {
                label: '墙布',
                value: '墙布',
              },
              {
                label: '皮革',
                value: '皮革',
              },
            ],
          },
          filters: [
            { label: 'PVC（水性）', value: 'PVC（水性）' },
            { label: 'PVC（油性）', value: 'PVC（油性）' },
            { label: 'PET', value: 'PET' },
            { label: 'PP（国产）', value: 'PP（国产）' },
            { label: 'PP（进口）', value: 'PP（进口）' },
            { label: 'PVC墙布', value: 'PVC墙布' },
            { label: '墙布', value: '墙布' },
            { label: '皮革', value: '皮革' },
          ],
        },
        {
          title: '材质纹理',
          width: 120,
          field: 'materialTexture',
          editRender: {},
          slots: {
            edit: 'materialTexture_edit',
          },
        },
        {
          title: '表面质感',
          width: 120,
          field: 'materialSurface',
          editRender: {
            name: '$select',
            options: [
              {
                label: '肤感',
                value: '肤感',
              },
              {
                label: '磨砂',
                value: '磨砂',
              },
              {
                label: '亮光',
                value: '亮光',
              },
              {
                label: '木纹',
                value: '木纹',
              },
              {
                label: '木纹同步纹',
                value: '木纹同步纹',
              },
              {
                label: '布纹',
                value: '布纹',
              },
              {
                label: '皮纹',
                value: '皮纹',
              },
              {
                label: '油漆',
                value: '油漆',
              },
              {
                label: '拉丝',
                value: '拉丝',
              },
              {
                label: '艺术纹',
                value: '艺术纹',
              },
            ],
          },
        },
        {
          title: '顺序码',
          width: 120,
          field: 'sequenceCode',
          editRender: {
            name: '$input',
          },
        },
      ],
    },
    {
      title: '亚厦信息',
      children: [
        {
          title: '亚厦物料编码',
          minWidth: 120,
          field: 'materialCode',
        },
        {
          title: '生产批次',
          minWidth: 200,
          field: 'productionBatch',
          slots: {
            default: 'productionBatch_default',
          },
        },
        {
          title: '入库时间',
          minWidth: 120,
          field: 'storageTime',
          slots: {
            default: 'storageTime_default',
          },
        },
        {
          title: '批次库存',
          minWidth: 100,
          field: 'batchInventory',
          slots: {
            default: 'batchInventory_default',
          },
        },
        {
          title: '总库存',
          minWidth: 100,
          field: 'totalInventory',
        },
        {
          title: '应用项目',
          minWidth: 100,
          field: 'applicationProject',
          slots: {
            default: 'applicationProject_default',
          },
        },
        // {
        //   title: '封样品存放处',
        //   width: 150,
        //   field: 'storagePlace',

        //   editRender: {
        //     name: '$input',
        //   },
        // },
      ],
    },
    {
      title: '供应商信息',
      children: [
        {
          title: '宽幅(mm)',
          width: 120,
          field: 'width',

          editRender: {
            name: '$input',
          },
        },
        {
          title: '厚度',
          width: 120,
          field: 'thickness',

          editRender: {
            name: '$input',
          },
        },
        // {
        //   title: '克重(g/㎡)',
        //   width: 100,
        //   field: 'weight',

        //   editRender: {
        //     name: '$input',
        //   },
        // },
        {
          title: '每卷长度(米)',
          width: 120,
          field: 'length',
          editRender: {
            name: '$input',
          },
        },
        {
          title: '供应商名称',
          width: 250,
          field: 'supplier',
          filters: [],
          editRender: {
            name: '$input',
          },
          //filterRender: { name: 'FilterInput' },
        },
        {
          title: '供应商简称',
          width: 100,
          field: 'supplierOverview',
          editRender: {
            name: '$input',
          },
          //filterRender: { name: 'FilterInput' },
        },
        {
          title: '供应商编码',
          width: 150,
          field: 'supplierCode',
          filters: [{ data: { vals: [], sVal: '', all: false, sVals: [] } }],
          editRender: {
            name: '$input',
          },
          filterRender: { name: 'FilterContent' },
        },

        {
          title: '价格区间',
          width: 140,
          field: 'price',
          editRender: {
            name: '$input',
          },
        },
        {
          title: '起订量',
          width: 100,
          field: 'quantity',
          editRender: {
            name: '$input',
          },
        },
        {
          title: '供货周期',
          width: 150,
          field: 'deliveryCycle',
          editRender: {
            name: '$input',
          },
        },
        {
          title: '样册系列名称',
          width: 200,
          field: 'seriesName',
          filters: [{ data: { vals: [], sVal: '', all: false, sVals: [] } }],
          editRender: {
            name: '$input',
          },
          filterRender: { name: 'FilterContent' },
        },
        {
          title: '样册外观照片',
          width: 150,
          field: 'seriesImageUrl',
          slots: {
            default: 'seriesImageUrl_default',
          },
        },
        {
          title: '样册编码',
          width: 150,
          field: 'seriesCode',
          editRender: {
            name: '$input',
          },
        },
      ],
    },
    {
      title: '操作时间',
      width: 200,
      slots: {
        default: ({ row }) => {
          let time = '';
          if (row.lastModificationTime) {
            time = new Date(row.lastModificationTime).toLocaleString();
          } else if (row.creationTime) {
            time = new Date(row.creationTime).toLocaleString();
          }
          return h('div', {}, time);
        },
      },
    },
    {
      title: '操作用户',
      width: 100,
      field: 'operatingUser',
    },
  ];
}
export function getManageTableColumRule(): any[] {
  return {
    status: [{ required: true, message: '必填项' }],
    materialType: [{ required: true, message: '必填项' }],
    materialTexture: [{ required: true, message: '必填项' }],
    materialSurface: [{ required: true, message: '必填项' }],
    sequenceCode: [{ required: true, message: '必填项' }],
    // storagePlace: [{ required: true, message: '必填项' }],
    width: [{ required: true, message: '必填项' }],
    thickness: [{ required: true, message: '必填项' }],
    // weight: [{ required: true, message: '必填项' }],
    length: [{ required: true, message: '必填项' }],
    supplier: [{ required: true, message: '必填项' }],
    supplierCode: [{ required: true, message: '必填项' }],
    price: [{ required: true, message: '必填项' }],
    quantity: [
      {
        required: true,
        message: '必填项',
        // validator: ({ row }) => {
        //   return new Promise((resolve, reject) => {
        //     if (row.quantity) {
        //       if (!row.quantity.includes('米') && !row.quantity.includes('卷')) {
        //         reject(new Error('单位只能是米/卷'));
        //       } else {
        //         resolve('');
        //       }
        //     } else {
        //       reject(new Error('必填项'));
        //     }
        //   });
        // },
      },
    ],
    deliveryCycle: [{ required: true, message: '必填项' }],
    seriesName: [{ required: true, message: '必填项' }],
    seriesCode: [{ required: true, message: '必填项' }],
  };
}

// 创建一个支持列内容的筛选
VXETable.renderer.add('FilterContent', {
  // 不显示底部按钮，使用自定义的按钮
  showFilterFooter: false,
  // 筛选模板
  renderFilter(renderOpts, params) {
    return <FilterContent params={params}></FilterContent>;
  },
  // 重置数据方法
  filterResetMethod(params) {
    const { options } = params;
    options.forEach((option) => {
      option.data.sVal = '';
      option.data.all = false;
      option.data.sVals = [];
    });
  },
  // 筛选数据方法
  filterMethod(params) {
    console.log('dd');
    const { option, row, column } = params;
    const { vals } = option.data;
    const cellValue = row[column.field];
    return vals.includes(cellValue);
  },
});
