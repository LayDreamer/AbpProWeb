import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const productManagement: AppRouteModule = {
  path: '/productManagement',
  name: 'ProductManagement',
  component: LAYOUT,
  redirect: '/productManagement/gyhProductList',
  meta: {
    orderNo: 60,
    icon: 'fluent-mdl2:product',
    title: t('routes.productManagement.name'),
    policy: 'YaSha.DataManager.ProductList',
  },
  children: [
    {
      path: 'gyhProductList',
      name: 'ProductListManagement',
      component: () => import('/@/views/productlist/index.vue'),
      meta: {
        icon: 'lucide:layout-list',
        title: t('routes.productlist.name'),
        policy: 'YaSha.DataManager.ProductList',
      },
    },
    {
      path: 'gyhProductDetail/:id',
      name: 'gyhProductDetail',
      component: () => import('/@/views/productlist/ProductDetail.vue'),
      meta: {
        hideMenu: true,
        title: t('routes.productlist.productDetail'),
        // ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/productManagement/gyhProductList',
      },
    },
    {
      path: 'gyhProductRetrieval',
      name: 'ProductRetrievalManagement',

      component: () => import('/@/views/productRetrieval/Index.vue'),
      meta: {
        icon: 'uil:file-search-alt',
        title: t('routes.productManagement.productRetrieval'),
        policy: 'YaSha.DataManager.ProductRetrieval',
      },
    },
    {
      path: 'basicTest',
      name: 'basicTest',
      component: () => import('/@/views/tempTest/basicTitle.vue'),
      meta: {
        icon: 'teenyicons:ab-testing-outline',
        title: t('基础测试项'),
        //policy: 'YaSha.DataManager.Test',
      },
    },
    {
      path: 'projectList',
      name: 'projectList',
      component: () => import('/@/views/tempTest/ProjectList.vue'),
      meta: {
        icon: 'mdi:ab-testing',
        title: t('项目测试'),
        //policy: 'YaSha.DataManager.Test',
      },
    },
  ],
};

export default productManagement;
