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
      width: 150,
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
      width: 300,
      minWidth: 300,
      maxWidth: 450,
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
        width: 150,
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
    width: 300,
    minWidth: 300,
    maxWidth: 450,
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
      width: 180,
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
        width: 300,
        minWidth: 300,
        maxWidth: 450,
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
    // {
    //   title: t('routes.productManagement.projectCode'),
    //   width: 180,
    // },
    // {
    //   title: t('routes.productManagement.materialInventory'),
    //   width: 180,
    // },  
  ];
}
