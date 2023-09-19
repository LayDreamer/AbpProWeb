import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const standardPolicy: AppRouteModule = {
  path: '/standardPolicy',
  name: 'standardPolicy',
  component: LAYOUT,
  redirect: '/standardPolicy/gyhStandardPolicyLib',
  meta: {
    orderNo: 60,
    icon: 'iconoir:privacy-policy',
    title: t('routes.standardPolicy.name'),
    // policy: 'YaSha.DataManager.ProductList',
  },
  children: [
    {
      path: 'gyhStandardPolicyLib',
      name: 'standardPolicyLib',
      component: () => import('/@/views/standardPolicy/index.vue'),
      meta: {
        icon: 'carbon:policy',
        title: t('routes.standardPolicy.standardPolicyName'),
        //policy: 'YaSha.DataManager.Test',
      },
    },
    {
      // path: 'standardDetail/:data',
      path: 'standardDetail',
      name: 'standardDetail',
      meta: {
        hideMenu: true,
        title: t('routes.familylibs.detail'),
        // ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/standardPolicy/gyhStandardPolicyLib',
      },
      component: () => import('/@/views/standardPolicy/standardDes.vue'),
    },
  ],
};

export default standardPolicy;
