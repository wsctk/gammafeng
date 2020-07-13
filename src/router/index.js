import Vue from 'vue'
import VueRouter from 'vue-router'

import CheckList from '../components/customer/CheckList.vue'
import Farmer from '../components/customer/Farmer.vue'
import Flyer from '../components/customer/Flyer.vue'
import Normalcustomer from '../components/customer/Normalcustomer.vue'

import Dispatch from '../components/dispatch/Dispatch.vue'
import OrderRetail from '../components/dispatch/OrderRetail.vue'

import InfoList from '../components/InfoList/InfoList.vue'

import Category from '../components/shop/Category.vue'
import Coupon from '../components/shop/Coupon.vue'
import Img from '../components/shop/Img.vue'
import Order from '../components/shop/Order.vue'
import Retail from '../components/shop/Retail.vue'
import Shop from '../components/shop/Shop.vue'

import Keeper from '../components/system/Keeper.vue'
import Mushu from '../components/system/Mushu.vue'
import Tixianmenkan from '../components/system/Tixianmenkan.vue'
import Lunbotu from '../components/system/Lunbotu.vue'
import RegisterCoupon from '../components/system/RegisterCoupon.vue'

import Tixian from '../components/Tixian/Tixian.vue'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/normalcustomer',
      children: [
        { path: '/infoList', component: InfoList },
        { path: '/normalcustomer', component: Normalcustomer },
        { path: '/flyer', component: Flyer },
        { path: '/farmer', component: Farmer },
        { path: '/checkList', component: CheckList },
        { path: '/dispatch', component: Dispatch },
        { path: '/orderRetail', component: OrderRetail },
        { path: '/shop', component: Shop },
        { path: '/order', component: Order },
        { path: '/retail', component: Retail },
        { path: '/img', component: Img },
        { path: '/coupon', component: Coupon },
        { path: '/category', component: Category },
        { path: '/tixian', component: Tixian },
        { path: '/tixianmenkan', component: Tixianmenkan },
        { path: '/mushu', component: Mushu },
        { path: '/keeper', component: Keeper },
        { path: '/lunbotu', component: Lunbotu },
        { path: '/registercoupon', component: RegisterCoupon }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // if (to.path === '/login') {
  //   const checked = localStorage.getItem('checked')
  //   if (checked === 'true') {
  //     next()
  //     return next('/home')
  //   }
  //   const login = window.sessionStorage.getItem('login')
  //   if (!login) {
  //     next()
  //     return next('/login')
  //   }
  // }
  // next()
  if (to.path === '/login') {
    const checked = localStorage.getItem('checked')
    if (checked === 'true') {
      next()
      return next('/home')
    }
  }
  const login = window.sessionStorage.getItem('login')
  if (!login) {
    next()
    return next('/login')
  }
  next()
})
export default router
