import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { Tag } from 'ant-design-vue';
import { ProductInventroyTag, ProductInventoryPublishStatus } from '/@/services/ServiceProxies';
const { t } = useI18n();

export function getProductBasicColumns(): BasicColumn[] {
  return [
    {
      title: t('routes.productlist.productStatus'),
      dataIndex: 'status',
      width: 100,
      customRender: ({ record }) => {
        let text = '';
        switch (record.status) {
          case ProductInventoryPublishStatus.InMark:
            text = '上市';
            break;
          case ProductInventoryPublishStatus.DelayInMark:
            text = '待上市';
            break;
          case ProductInventoryPublishStatus.OutMark:
            text = '下市';
            break;
          case ProductInventoryPublishStatus.DelayOutMark:
            text = '待下市';
            break;
        }
        return h('div', text);
      },
    },
    {
      title: t('routes.productlist.productName'),
      dataIndex: 'name',
      width: 300,
      minWidth: 300,
      maxWidth: 450,
      resizable: true,
      sorter: true,
    },
    {
      title: t('routes.productlist.productCode'),
      dataIndex: 'code',
      width: 150,
      sorter: true,
    },
    {
      title: t('routes.productlist.productCategory'),
      dataIndex: 'category',
      width: 100,
    },
    {
      title: t('routes.productlist.productVersion'),
      dataIndex: 'version',
      width: 50,
    },
    {
      title: t('routes.productlist.productLength'),
      dataIndex: 'length',
      width: 80,
    },
    {
      title: t('routes.productlist.productWidth'),
      dataIndex: 'width',
      width: 80,
    },
    {
      title: t('routes.productlist.productHeight'),
      dataIndex: 'height',
      width: 80,
    },
    {
      title: t('routes.productlist.productMaterial'),
      dataIndex: 'materialQuality',
      width: 150,
    },
    {
      title: t('routes.productlist.productColor'),
      dataIndex: 'color',
      width: 100,
    },
    {
      title: t('routes.productlist.productSpecification'),
      dataIndex: 'productSpecification',
      width: 500,
      minWidth: 500,
      maxWidth: 750,
      resizable: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              whiteSpace: 'normal',
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: t('routes.productlist.productProcessNum'),
      dataIndex: 'processNum',
      width: 120,
    },
    {
      title: t('routes.productlist.productAssemblyDrawingNum'),
      dataIndex: 'assemblyDrawingNum',
      width: 120,
    },
    {
      title: t('routes.productlist.productDetailNum'),
      dataIndex: 'detailNum',
      width: 100,
    },
    {
      title: t('routes.productlist.productRemark'),
      dataIndex: 'remark',
      width: 300,
      minWidth: 300,
      maxWidth: 500,
      resizable: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              whiteSpace: 'normal',
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },

    {
      title: t('routes.productlist.productCreater'),
      dataIndex: 'createUser',
      width: 150,
    },
    {
      title: t('routes.productlist.productCreateTime'),
      dataIndex: 'creationTime',
      width: 150,
    },
    {
      title: t('routes.productlist.productUpdate'),
      dataIndex: 'modifiyUser',
      width: 150,
    },
    {
      title: t('routes.productlist.productUpdateTime'),
      dataIndex: 'lastModificationTime',
      width: 150,
    },
  ];
}

export function getProductDetailColumns(): BasicColumn[] {
  return [
    {
      title: t('routes.productlist.productDetailLevel'),
      dataIndex: ['data', 'level'],
      width: 100,
    },
    {
      title: t('routes.productlist.productDetailName'),
      dataIndex: ['data', 'name'],
      width: 320,
      minWidth: 320,
      maxWidth: 400,
      resizable: true,
      customRender: ({ text, record }) => {
        if (record.data.inModuleMaterial) {
          return h(
            'div',
            {
              style: {
                textAlign: 'left !important',
                textIndent: '35px',
              },
            },
            text,
          );
        }
        return h(
          'div',
          {
            style: {
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: t('routes.productlist.productDetailCode'),
      dataIndex: ['data', 'code'],
      width: 100,
    },
    {
      title: t('routes.productlist.productDetailCategory'),
      dataIndex: ['data', 'category'],
      width: 100,
    },
    {
      title: t('routes.productlist.productDetailVersion'),
      dataIndex: ['data', 'version'],
      width: 60,
    },
    {
      title: t('routes.productlist.productDetailLength'),
      dataIndex: ['data', 'length'],
      width: 80,
    },
    {
      title: t('routes.productlist.productDetailWidth'),
      dataIndex: ['data', 'width'],
      width: 80,
    },
    {
      title: t('routes.productlist.productDetailHeight'),
      dataIndex: ['data', 'height'],
      width: 80,
    },
    {
      title: t('routes.productlist.productDetailSupplyMode'),
      dataIndex: ['data', 'supplyMode'],
      width: 100,
    },
    {
      title: t('routes.productlist.productDetailModuleRule'),
      dataIndex: ['data', 'moduleSpecification'],
      width: 250,
      minWidth: 250,
      maxWidth: 350,
      resizable: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              whiteSpace: 'normal',
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: t('routes.productlist.productDetailProperty'),
      dataIndex: ['data', 'property'],
      width: 80,
    },
    {
      title: t('routes.productlist.productDetailMaterial'),
      dataIndex: ['data', 'materialQuality'],
      width: 200,
    },
    {
      title: t('routes.productlist.productDetailColor'),
      dataIndex: ['data', 'color'],
      width: 60,
    },
    {
      title: t('routes.productlist.productDetailUsage'),
      dataIndex: ['data', 'usage'],
      width: 80,
      customRender: ({ text }) => {
        if (text === null) return h('div', '');
        const formattedText = parseFloat(text).toFixed(5);
        return h('div', formattedText);
      },
    },
    {
      title: t('routes.productlist.productDetailUnits'),
      dataIndex: ['data', 'unit'],
      width: 60,
    },
    {
      title: t('routes.productlist.productDetailProcess'),
      dataIndex: ['data', 'isProcess'],
      width: 100,
    },
    {
      title: t('routes.productlist.productDetailTag'),
      dataIndex: ['data', 'category'],
      width: 80,
      fixed: 'right',
      customRender: ({ record }) => {
        let text = '';
        let color = '';
        if (record.tag == ProductInventroyTag.Modules) {
          text = '模块';
          color = 'blue';
        } else if (record.tag == ProductInventroyTag.Material) {
          text = '物料';
          color = 'yellow';
        }
        return h(
          Tag,
          {
            color: color,
          },
          () => text,
        );
      },
    },
    {
      title: '用量公式',
      dataIndex: ['data', 'materialUsageFormula'],
      width: 150,
      customRender: ({ record }) => {
        if (record.data.materialUsageFormula) {
          let text = '';
          var parts = record.data.materialUsageFormula.split('@@@@@');
          if (parts.length == 2) {
            text = parts[0];
          }
          return h('div', { style: {} }, text);
        }
      },
    },
  ];
}

export function getEditProductColumns(): BasicColumn[] {
  return [
    {
      title: t('routes.productlist.productDetailName'),
      dataIndex: ['data', 'name'],
      width: 330,
      maxWidth: 400,
      minWidth: 250,
      resizable: true,
      align: 'left',
      // customCell: (_, index) => ({
      //   onclick: (e) => {
      //     destroyMenu(e);
      //   },
      //   onContextmenu: (e) => {
      //     handleContext(e, _);
      //   },
      // }),
      // customRender: ({ text }) => {
      //   return h(
      //     'div',
      //     {
      //       style: {
      //         textAlign: 'left !important',
      //       },
      //     },
      //     text,
      //   );
      // },
    },
    {
      title: t('routes.productlist.productDetailCode'),
      dataIndex: ['data', 'code'],
      width: 150,
      minWidth: 150,
      maxWidth: 200,
      resizable: true,
    },
    {
      title: t('routes.productlist.productDetailLength'),
      dataIndex: ['data', 'length'],
      width: 80,
    },
    {
      title: t('routes.productlist.productDetailWidth'),
      dataIndex: ['data', 'width'],
      width: 80,
    },
    {
      title: t('routes.productlist.productDetailHeight'),
      dataIndex: ['data', 'height'],
      width: 80,
    },
  ];
}

export function getErpProductColumns(): BasicColumn[] {
  return [
    {
      title: t('routes.productlist.erpProductName'),
      dataIndex: 'name',
    },
    {
      title: t('routes.productlist.erpProductCode'),
      dataIndex: 'code',
      width: 120,
    },
  ];
}

export function getProductCategoryData() {
  return [
    {
      value: '顶面面层',
      label: '顶面面层',
      children: [
        {
          value: '顶面平面板',
          label: '顶面平面板',
        },
        {
          value: '顶面折弯板',
          label: '顶面折弯板',
        },
        {
          value: '顶面叠层板',
          label: '顶面叠层板',
        },
        {
          value: '顶面围合',
          label: '顶面围合',
        },
        {
          value: '顶面线条',
          label: '顶面线条',
        },
        {
          value: '顶面连接件',
          label: '顶面连接件',
        },
      ],
    },
    {
      value: '顶面基层',
      label: '顶面基层',
      children: [
        {
          value: '顶面基层龙骨',
          label: '顶面基层龙骨',
        },
        {
          value: '顶面基层吊杆',
          label: '顶面基层吊杆',
        },
        {
          value: '顶面基层吊件',
          label: '顶面基层吊件',
        },
        {
          value: '顶面基层加固支撑',
          label: '顶面基层加固支撑',
        },
      ],
    },
    {
      value: '顶面后置',
      label: '顶面后置',
      children: [
        {
          value: '顶面后置',
          label: '顶面后置',
        },
      ],
    },
    {
      value: '墙面面层',
      label: '墙面面层',
      children: [
        {
          value: '墙面平面板',
          label: '墙面平面板',
        },
        {
          value: '墙面折弯板',
          label: '墙面折弯板',
        },
        {
          value: '墙面造型板',
          label: '墙面造型板',
        },
        {
          value: '墙面线条',
          label: '墙面线条',
        },
        {
          value: '墙面踢脚线条',
          label: '墙面踢脚线条',
        },
        {
          value: '墙面连接件',
          label: '墙面连接件',
        },
      ],
    },
    {
      value: '墙面基层',
      label: '墙面基层',
      children: [
        {
          value: '墙面找平',
          label: '墙面找平',
        },
        {
          value: '墙面基层框架',
          label: '墙面基层框架',
        },
        {
          value: '墙面阴角件',
          label: '墙面阴角件',
        },
        {
          value: '隔墙',
          label: '隔墙',
        },
        {
          value: '隔墙配件',
          label: '隔墙配件',
        },
      ],
    },
    {
      value: '墙面后置',
      label: '墙面后置',
      children: [
        {
          value: '墙面后置',
          label: '墙面后置',
        },
      ],
    },
    {
      value: '地面面层',
      label: '地面面层',
      children: [
        {
          value: '地面面层',
          label: '地面面层',
        },
        {
          value: '地面线条',
          label: '地面线条',
        },
      ],
    },
    {
      value: '地面基层',
      label: '地面基层',
      children: [
        {
          value: '地面承重板',
          label: '地面承重板',
        },
        {
          value: '地面平衡板',
          label: '地面平衡板',
        },
        {
          value: '地面基层',
          label: '地面基层',
        },
        {
          value: '地面找平',
          label: '地面找平',
        },
      ],
    },
    {
      value: '地面后置',
      label: '地面后置',
      children: [
        {
          value: '地面后置',
          label: '地面后置',
        },
      ],
    },
  ];
}
