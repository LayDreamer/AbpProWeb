import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const processingList: AppRouteModule = {
  path: '/processingList',
  name: 'ProcessingList',
  component: LAYOUT,
  redirect: '/processingList/gyhProcessingList',
  meta: {
    orderNo: 50,
    icon: 'iconoir:privacy-policy',
    title: t('routes.processingList.excelList'),
  },
  children: [
    {
      path: 'gyhProcessingList',
      name: 'gyhProcessingList',
      component: () => import('/@/views/processingList/index.vue'),
      meta: {
        icon: 'file-icons:microsoft-excel',
        title: t('routes.processingList.processingList'),
        policy: 'YaSha.DataManager.ProcessingList',
      },
    },
    {
      path: 'gyhExcelDes/:data',
      name: 'gyhExcelDes',
      meta: {
        hideMenu: true,
        title: t('routes.familylibs.detail'),
        showMenu: false,
        currentActiveMenu: '/processingList/gyhProcessingList',
      },
      component: () => import('/@/views/processingList/ExcelDes.vue'),
    },
    {
      path: 'listProcessing',
      name: 'listProcessing',
      component: () => import('/@/views/listProcessing/index.vue'),
      meta: {
        icon: 'vaadin:split',
        title: '制造拆单',
        policy: 'YaSha.DataManager.ListProcessing',
      },
    },
    {
      path: 'gyhMeasuringExcels',
      name: 'gyhMeasuringExcels',
      component: () => import('/@/views/measuringExcels/index.vue'),
      meta: {
        icon: 'icon-park-outline:tape-measure',
        title: t('routes.measuringExcels.measuringExcels'),
        policy: 'YaSha.DataManager.MeasuringExcel',
      },
    },
    {
      path: 'gyhSaleOderList',
      name: 'gyhSaleOderList',
      component: () => import('/@/views/saleOderList/Index.vue'),
      meta: {
        icon: 'iconoir:home-sale',
        title: t('routes.saleOderList.saleOderList'),
        policy: 'YaSha.DataManager.SaleOder',
      },
    },
  ],
};
export default processingList;
