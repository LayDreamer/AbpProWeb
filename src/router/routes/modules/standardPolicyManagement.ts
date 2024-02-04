import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '/@/router/constant';
import type { AppRouteModule } from '/@/router/types';

const standardPolicyManagement: AppRouteModule = {
  path: '/standardPolicyManagement',
  name: 'StandardPolicyManagement',
  component: LAYOUT,
  redirect: '/standardPolicyManagement/standardPolicyLib',
  meta: {
    orderNo: 65,
    icon: 'carbon:policy',
    title: t('标准与政策'),
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'standardPolicyLib',
      name: 'StandardPolicyLib',
      component: () => import('/@/views/standardPolicy/index.vue'),
      meta: {
        icon: 'carbon:policy',
        title: t('routes.standardPolicy.standardPolicyName'),
        policy: 'YaSha.DataManager.StandardPolicy',
      },
    },
    {
      path: 'standardDetail',
      name: 'StandardDetail',
      meta: {
        hideMenu: true,
        title: t('routes.familylibs.detail'),
        showMenu: false,
      },
      component: () => import('/@/views/standardPolicy/standardDes.vue'),
    },
  ],
};

export default standardPolicyManagement;
