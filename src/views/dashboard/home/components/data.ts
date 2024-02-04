interface GroupItem {
  title: string;
  icon: string;
  color: string;
  desc: string;
  date: string;
  group: string;
  tag: number;
  url: string;
}

interface NavItem {
  title: string;
  icon: string;
  color: string;
}

interface DynamicInfoItem {
  avatar: string;
  name: string;
  date: string;
  desc: string;
}

export const navItems: NavItem[] = [
  {
    title: '首页',
    icon: 'ion:home-outline',
    color: '#1fdaca',
  },
  {
    title: '仪表盘',
    icon: 'ion:grid-outline',
    color: '#bf0c2c',
  },
  {
    title: '组件',
    icon: 'ion:layers-outline',
    color: '#e18525',
  },
  {
    title: '系统管理',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
  },
  {
    title: '权限管理',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
  },
  {
    title: '图表',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
  },
];

export const dynamicInfoItems: DynamicInfoItem[] = [
  {
    avatar: 'dynamic-avatar-1|svg',
    name: '威廉',
    date: '刚刚',
    desc: `在 <a>开源组</a> 创建了项目 <a>Vue</a>`,
  },
  {
    avatar: 'dynamic-avatar-2|svg',
    name: '艾文',
    date: '1个小时前',
    desc: `关注了 <a>威廉</a> `,
  },
  {
    avatar: 'dynamic-avatar-3|svg',
    name: '克里斯',
    date: '1天前',
    desc: `发布了 <a>个人动态</a> `,
  },
  {
    avatar: 'dynamic-avatar-4|svg',
    name: 'Vben',
    date: '2天前',
    desc: `发表文章 <a>如何编写一个Vite插件</a> `,
  },
  {
    avatar: 'dynamic-avatar-5|svg',
    name: '皮特',
    date: '3天前',
    desc: `回复了 <a>杰克</a> 的问题 <a>如何进行项目优化？</a>`,
  },
  {
    avatar: 'dynamic-avatar-6|svg',
    name: '杰克',
    date: '1周前',
    desc: `关闭了问题 <a>如何运行项目</a> `,
  },
  {
    avatar: 'dynamic-avatar-1|svg',
    name: '威廉',
    date: '1周前',
    desc: `发布了 <a>个人动态</a> `,
  },
  {
    avatar: 'dynamic-avatar-1|svg',
    name: '威廉',
    date: '2021-04-01 20:00',
    desc: `推送了代码到 <a>Github</a>`,
  },
];

export const groupItems: GroupItem[] = [
  {
    title: 'Github',
    icon: 'carbon:logo-github',
    color: '',
    desc: '不要等待机会，而要创造机会。',
    group: '开源组',
    date: '2021-04-01',
  },
  {
    title: 'Vue',
    icon: 'ion:logo-vue',
    color: '#3fb27f',
    desc: '现在的你决定将来的你。',
    group: '算法组',
    date: '2021-04-01',
  },
  {
    title: 'Html5',
    icon: 'ion:logo-html5',
    color: '#e18525',
    desc: '没有什么才能比努力更重要。',
    group: '上班摸鱼',
    date: '2021-04-01',
  },
  {
    title: 'Angular',
    icon: 'ion:logo-angular',
    color: '#bf0c2c',
    desc: '热情和欲望可以突破一切难关。',
    group: 'UI',
    date: '2021-04-01',
  },
  {
    title: 'React',
    icon: 'bx:bxl-react',
    color: '#00d8ff',
    desc: '健康的身体是实目标的基石。',
    group: '技术牛',
    date: '2021-04-01',
  },
  {
    title: 'Js',
    icon: 'ion:logo-javascript',
    color: '#4daf1bc9',
    desc: '路是走出来的，而不是空想出来的。',
    group: '架构组',
    date: '2021-04-01',
  },
];

export const devItems: GroupItem[] = [
  {
    title: '族库管理',
    icon: 'heroicons-outline:library',
    color: '',
    desc: 'Revit端上传产品、模块、物料、详图族等文件,线上同步查看产品层级，三维模型等内部详情',
    group: '开源组',
    date: '2021-04-01',
    tag: 1,
    url: '/familylibs/gyhFamilyLibs',
  },
  {
    title: '产品架构清单',
    icon: 'lucide:layout-list',
    // fluent:text-bullet-list-tree-16-regular
    color: '#3fb27f',
    desc: '可在线新增和上传历史产品架构数据，便捷查询产品架构层级，可变更上下市状态，复制各个层级数据，更新图片等',
    group: '算法组',
    date: '2021-04-01',
    tag: 1,
    url: '/productManagement/gyhProductList',
  },
  {
    title: '产品检索',
    icon: 'uil:file-search-alt',
    color: '#e18525',
    desc: '根据已上传的产品架构清单数据，查询目标材料所在层级以及项目和库存信息',
    group: '上班摸鱼',
    date: '2021-04-01',
    tag: 1,
    url: '/productManagement/gyhProductRetrieval',
  },
  {
    title: '标准与政策',
    icon: 'carbon:policy',
    color: '#bf0c2c',
    desc: '装配式行业标准和政策文件的在线管理平台，可线在线创建相关文件，快速查询、预览和下载指定文件',
    group: 'UI',
    date: '2021-04-01',
    tag: 1,
    url: '/standardPolicyManagement/standardPolicyLib',
  },
  {
    title: '内加工清单',
    icon: 'lucide:layout-list',
    // fluent:text-bullet-list-tree-16-regular
    color: '#3fb27f',
    desc: '可在线下载清单',
    group: '算法组',
    date: '2021-04-01',
    tag: 1,
    url: '/processingList/gyhProcessingList',
  },
  {
    title: '更多功能，敬请期待！',
    // icon: 'fa-solid:ellipsis-h',
    icon: 'la:dev',
    color: '#4daf1bc9',
    desc: '亚厦装饰-工业化-软件产品部',
    group: '技术牛',
    date: '2023',
    tag: -1,
    url: '',
  },
  // {
  //   title: 'Js',
  //   icon: 'ion:logo-javascript',
  //   color: '#4daf1bc9',
  //   desc: '路是走出来的，而不是空想出来的。',
  //   group: '架构组',
  //   date: '2021-04-01',
  // },
];
