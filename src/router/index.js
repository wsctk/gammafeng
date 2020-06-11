import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
// const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
import Home from '../components/Home.vue'
// const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
import Welcome from '../components/Welcome.vue'
// const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
import Normalcustomer from '../components/customer/Normalcustomer.vue'
import Flyer from '../components/customer/Flyer.vue'
import Farmer from '../components/customer/Farmer.vue'
import CheckList from '../components/customer/CheckList.vue'
import InfoList from '../components/InfoList/InfoList.vue'
import Dispatch from '../components/dispatch/Dispatch.vue'
import Shop from '../components/shop/Shop.vue'
import Order from '../components/shop/Order.vue'
import Retail from '../components/shop/Retail.vue'
import Img from '../components/shop/Img.vue'
import Coupon from '../components/shop/Coupon.vue'
import Category from '../components/shop/Category.vue'
import System from '../components/system/System.vue'
// const Users = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
// const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
// const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
// const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
// const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

// import List from '../components/goods/List.vue'
// const List = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
// const Add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add.vue')

// // import Order from '../components/order/Order.vue'
// const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order.vue')
// // import Report from '../components/report/Report.vue'
// const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/infoList', component: InfoList },
        { path: '/normalcustomer', component: Normalcustomer },
        { path: '/flyer', component: Flyer },
        { path: '/farmer', component: Farmer },
        { path: '/checkList', component: CheckList },
        { path: '/dispatch', component: Dispatch },
        { path: '/shop', component: Shop },
        { path: '/order', component: Order },
        { path: '/retail', component: Retail },
        { path: '/img', component: Img },
        { path: '/coupon', component: Coupon },
        { path: '/category', component: Category },
        { path: '/normalset', component: System }
      ]
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   // if (to.path === '/login') return next()
//   // const tokenStr = window.sessionStorage.getItem('token')
//   // if (!tokenStr) return next('/login')
//   next()
// })
export default router
