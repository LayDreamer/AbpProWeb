import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '/@/router/constant';
import type { AppRouteModule } from '/@/router/types';

const productManagement: AppRouteModule = {
  path: '/productManagement',
  name: 'ProductManagement',
  component: LAYOUT,
  redirect: '/productManagement/gyhProductList',
  meta: {
    orderNo: 60,
    icon: 'fluent-mdl2:product',
    title: t('routes.productManagement.name'),
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
        showMenu: false,
        currentActiveMenu: '/productManagement/gyhProductList',
      },
    },
    {
      path: 'gyhArchitectureList',
      name: 'ArchitectureList',
      component: () => import('/@/views/architectureList/index.vue'),
      meta: {
        icon: 'ant-design:file-excel-outlined',
        title: '产品模块清单',
        // policy: 'YaSha.DataManager.NewProductList',
        policy: 'YaSha.DataManager.ArchitectureList',
      },
    },
    {
      path: 'architectureFileManage',
      name: 'architectureFileManage',
      component: () => import('/@/views/architectureList/File.vue'),
      meta: {
        hideMenu: true,
        title: '相关图纸文件',
        showMenu: false,
        currentActiveMenu: '/productManagement/gyhArchitectureList',
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
    // {
    //   path: 'gyhStandardPolicyLib',
    //   name: 'standardPolicyLib',
    //   component: () => import('/@/views/standardPolicy/index.vue'),
    //   meta: {
    //     icon: 'carbon:policy',
    //     title: t('routes.standardPolicy.standardPolicyName'),
    //     policy: 'YaSha.DataManager.StandardPolicy',
    //   },
    // },
    // {
    //   path: 'standardDetail',
    //   name: 'standardDetail',
    //   meta: {
    //     hideMenu: true,
    //     title: t('routes.familylibs.detail'),
    //     showMenu: false,
    //   },
    //   component: () => import('/@/views/standardPolicy/standardDes.vue'),
    // },
  ],
};

export default productManagement;
