import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import qs from 'qs'
import Vuecookies from 'vue-cookies'
import axios from 'axios'
Vue.prototype.$cookies = Vuecookies
Vue.prototype.$qs = qs
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
axios.defaults.withCredentials = true
var instance = axios.create({
  baseURL: 'http://192.168.18.15:8181/',
  header: {
    'content-type': 'application/x-www-form-urlencode;charset=utf-8'
  }
})
Vue.prototype.$http = instance

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + 1 + '').padStart(2, '0')
  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const sec = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}-${mm}-${sec}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
