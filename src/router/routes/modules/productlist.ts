import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const productlist: AppRouteModule = {
  path: '/productList',
  name: 'ProductList',
  component: LAYOUT,
  redirect: '/productList/gyhProductList',
  meta: {
    orderNo: 50,
    icon: 'fluent-mdl2:product',
    title: t('routes.productlist.name'),
    policy: 'YaSha.DataManager.Productlist',
  },
  children: [
    {
      path: 'gyhProductList',
      name: 'ProductListManagement',
      component: () => import('/@/views/productlist/index.vue'),
      meta: {
        title: t('routes.productlist.name'),
        policy: 'YaSha.DataManager.Productlist',
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
        currentActiveMenu: '/productList/gyhProductList',
      },
    },
  ],
};

export default productlist;
