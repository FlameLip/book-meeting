import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/userManage',
    children: [
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('@/views/user-manage/list'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid' }
      }
    ]
  },

  {
    path: '/applyList',
    component: Layout,
    redirect: '/applyList',
    children: [
      {
        path: 'applyList',
        name: 'applyList',
        component: () => import('@/views/apply-list/list'),
        meta: { title: '申请列表', icon: 'el-icon-document' }
      }
    ]
  },

  {
    path: '/auditList',
    component: Layout,
    redirect: '/auditList',
    children: [
      {
        path: 'auditList',
        name: 'auditList',
        component: () => import('@/views/audit-list/list'),
        meta: { title: '当日审核列表', icon: 'el-icon-document-checked' }
      }
    ]
  },

  {
    path: '/callLog',
    component: Layout,
    redirect: '/callLog',
    children: [
      {
        path: 'callLog',
        name: 'callLog',
        component: () => import('@/views/call-log/list'),
        meta: { title: '通话记录查询', icon: 'el-icon-phone-outline' }
      }
    ]
  },

  {
    path: '/memberInfo',
    component: Layout,
    redirect: '/memberInfo',
    children: [
      {
        path: 'memberInfo',
        name: 'memberInfo',
        component: () => import('@/views/member-info/list'),
        meta: { title: '家属信息查询', icon: 'el-icon-info' }
      }
    ]
  },

  // {
  //   path: '/memberAudit',
  //   component: Layout,
  //   redirect: '/memberAudit',
  //   children: [
  //     {
  //       path: 'memberAudit',
  //       name: 'memberAudit',
  //       component: () => import('@/views/member-audit/list'),
  //       meta: { title: '家属批量审核', icon: 'el-icon-s-check' }
  //     }
  //   ]
  // },

  {
    path: '/meettingPolicy',
    component: Layout,
    redirect: '/meettingPolicy',
    children: [
      {
        path: 'meettingPolicy',
        name: 'meettingPolicy',
        component: () => import('@/views/meetting-policy/list'),
        meta: { title: '会见政策', icon: 'el-icon-s-custom' }
      }
    ]
  },

  {
    path: '/callArrange',
    component: Layout,
    redirect: '/callArrange',
    children: [
      {
        path: 'callArrange',
        name: 'callArrange',
        component: () => import('@/views/call-arrange/list'),
        meta: { title: '通话日安排', icon: 'el-icon-mobile-phone' }
      }
    ]
  },

  {
    path: '/systemSetting',
    component: Layout,
    redirect: '/systemSetting',
    children: [
      {
        path: 'systemSetting',
        name: 'systemSetting',
        component: () => import('@/views/system-setting/index'),
        meta: { title: '系统配置', icon: 'el-icon-setting' }
      }
    ]
  },

  {
    path: '/otherModule',
    component: Layout,
    redirect: '/otherModule',
    children: [
      {
        path: 'otherModule',
        name: 'otherModule',
        component: () => import('@/views/other-module/index'),
        meta: { title: '其他', icon: 'el-icon-more' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
