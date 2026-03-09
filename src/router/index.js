import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store'

// 改成懒加载
const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list')
const ProDetail = () => import('@/views/prodetail')
const Pay = () => import('@/views/pay')
const MyOrder = () => import('@/views/myorder/index.vue')
const Address = () => import('@/views/address/index.vue')
const AddressEdit = () => import('@/views/address/edit')
const OrderDetail = () => import('@/views/myorder/detail')
const Comment = () => import('@/views/prodetail/comment')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList },
    { path: '/prodetail/:id', component: ProDetail },
    { path: '/pay', component: Pay },
    { path: '/myorder', component: MyOrder },
    { path: '/address', component: Address },
    { path: '/address/edit', component: AddressEdit },
    { path: '/order/detail', component: OrderDetail },
    { path: '/comment', component: Comment }
  ]
})

// 全局前置导航守卫
// next()    直接放行
// next(路径)进行拦截

// 定义数组，存放用户需要权限才能访问的页面
const authUrls = ['/pay', '/myorder']

router.beforeEach((to, from, next) => {
  // 看to.path是否在authUrls出现
  if (!authUrls.includes(to.path)) {
    // 非权限页面
    next()
    return
  }

  // 权限页面，需要判断token
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
