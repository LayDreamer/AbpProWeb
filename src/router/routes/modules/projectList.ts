import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const projectList: AppRouteModule = {
  path: '/projectList',
  name: 'projectList',
  component: LAYOUT,
  redirect: '/projectList/gyhProjectList',
  meta: {
    orderNo: 61,
    icon: 'fluent-mdl2:product',
    title: t('routes.projectManagement.name'),    
    // roles:[RoleEnum.SUPER],
  },
  children: [
    {
      path: 'gyhProjectList',
      name: 'gyhProjectList',
      component: () => import('/@/views/tempTest/ProjectList.vue'),
      meta: {
        title: t('项目列表'),
        policy: 'YaSha.DataManager.ProjectList',
        // policy: "AbpProductRetrievalManagement.ProjectList", //菜单权限
        // roles:[RoleEnum.SUPER],
      },
    },
  ],
};

export default projectList;
