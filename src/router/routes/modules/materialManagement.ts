import { LAYOUT } from '/@/router/constant';
import type { AppRouteModule } from '/@/router/types';

const materialManagement: AppRouteModule = {
  path: '/materialLibrary',
  name: 'MaterialLibrary',
  component: LAYOUT,
  redirect: '/materialLibrary/testSearchImage',
  meta: {
    orderNo: 70,
    icon: 'simple-icons:openai',
    title: '面层材质库',
  },
  children: [
    {
      path: 'materialLibrayHome',
      name: 'MaterialLibrayHome',
      meta: {
        title: '材质选型',
        policy: 'YaSha.DataManager.MaterialManage',
      },
      component: () => import('/@/views/materialManage/index.vue'),
    },
    {
      path: 'materialLibrayManage',
      name: 'MaterialLibrayManage',
      meta: {
        hideMenu: true,
        title: '材质管理',
        showMenu: false,
        currentActiveMenu: '/materialLibrary/materialLibrayHome',
        policy: 'YaSha.DataManager.MaterialManage.Create',
      },
      component: () => import('/@/views/materialManage/Manage.vue'),
    },
    {
      path: 'materialLibrayDetail',
      name: 'MaterialLibrayDetail',
      meta: {
        hideMenu: true,
        title: '详情',
        showMenu: false,
        currentActiveMenu: '/materialLibrary/materialLibrayHome',
        policy: 'YaSha.DataManager.MaterialManage',
      },
      component: () => import('/@/views/materialManage/Detail.vue'),
    },
  ],
};

export default materialManagement;
