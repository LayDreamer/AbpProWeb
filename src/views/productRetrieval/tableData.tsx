import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { ProductInventroyTag } from '/@/services/ServiceProxies';
const { t } = useI18n();

export function getProductBasicColumns(): BasicColumn[] {
  return [
   
    {
      title: t('routes.productManagement.productCode'),
      dataIndex: 'productCode',
      width: 100,
      minWidth: 90,
      maxWidth: 150,
      resizable: true,
      customRender: ({ text, record }) => {
        if(record.tag == ProductInventroyTag.Product)
          return h(
            'div',
            {
              style: {
                color: 'red !important',
              },
            },
            text,
          );
        },
    },
    {
      title: t('routes.productManagement.productName'),
      dataIndex: 'productName',
      width: 200,
      minWidth: 150,
      maxWidth: 250,
      resizable: true,
      customRender: ({ text, record }) => {
        if(record.tag == ProductInventroyTag.Product)
          return h(
            'div',
            {
              style: {
                color: 'red !important',
              },
            },
            text,
          );
        },
    },
    
    {
      title: t('routes.productManagement.moduleCode'),
        dataIndex: 'moduleCode',
        width: 100,
        customRender: ({ text, record }) => {
          if(record.tag == ProductInventroyTag.Modules)
            return h(
              'div',
              {
                style: {
                  color: 'red !important',
                },
              },
              text,
            );
          },
    },
    { 
    title: t('routes.productManagement.moduleName'),
    dataIndex: 'moduleName',
    width: 200,
        minWidth: 150,
        maxWidth: 250,
    resizable: true,
    customRender: ({ text, record }) => {
      if(record.tag == ProductInventroyTag.Modules)
        return h(
          'div',
          {
            style: {
              color: 'red !important',
            },
          },
          text,
        );},
    },

    {
      title: t('routes.productManagement.materialCode'),
        dataIndex: 'materialCode',
      width: 100,
      customRender: ({ text, record }) => {
        if(record.tag == ProductInventroyTag.Material)
          return h(
            'div',
            {
              style: {
                color: 'red !important',
              },
            },
            text,
          );
        },
    },
    {
      title: t('routes.productManagement.materialName'),
        dataIndex: 'materialName',
        width: 200,
        minWidth: 150,
        maxWidth: 250,
        resizable: true,
        customRender: ({ text, record }) => {
          if(record.tag == ProductInventroyTag.Material)
            return h(
              'div',
              {
                style: {
                  color: 'red !important',
                },
              },
              text,
            );
          },
    },
    {
      title: t('库存'),
        dataIndex: 'materialCount',
        width: 100,
    },
    {
      title: t('金额'),
        dataIndex: 'materialMoney',
        width: 100,
    },
  ];
}
