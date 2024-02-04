import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const familylibs: AppRouteModule = {
  path: '/familylibs',
  name: 'FamilyLibs',
  component: LAYOUT,
  redirect: '/familylibs/gyhFamilyLibs',
  meta: {
    orderNo: 40,
    icon: 'heroicons-outline:library',
    title: t('routes.familylibs.familylibs'),
    policy: 'YaSha.DataManager.FamilyLib',
  },
  children: [
    {
      path: 'gyhFamilyLibs',
      name: 'FamilyLibsManagement',
      meta: {
        icon: 'heroicons-outline:library',
        title: t('routes.familylibs.gyhfamilylibs'),
        policy: 'YaSha.DataManager.FamilyLib',
      },
      component: () => import('/@/views/familylibs/index.vue'),
    },
    {
      path: 'gyhFamilyDetail/:data',
      name: 'gyhFamilyDetail',
      meta: {
        hideMenu: true,
        title: t('routes.familylibs.detail'),
        showMenu: false,
        currentActiveMenu: '/familylibs/gyhFamilyLibs',
      },
      component: () => import('/@/views/familylibs/FamilyDetail.vue'),
    },
    {
      path: 'gyhNewFamilyLibs',
      name: 'NewFamilyLibsManagement',
      meta: {
        icon: 'heroicons-outline:library',
        title: t('routes.newFamilyLibrary.gyhNewFamilyLibs'),
        policy: 'YaSha.DataManager.NewFamilyLib',
      },
      component: () => import('/@/views/NewFamilyLibrary/Index.vue'),
    },
    {
      path: 'gyhNewFamilyDetail/:data',
      name: 'gyhNewFamilyDetail',
      meta: {
        hideMenu: true,
        title: t('routes.newFamilyLibrary.gyhNewFamilyDetail'),
        showMenu: false,
        currentActiveMenu: '/familylibs/gyhNewFamilyLibs',
      },
      component: () => import('/@/views/NewFamilyLibrary/NewFamilyDetail.vue'),
    },




  ],
};

export default familylibs;
