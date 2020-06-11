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
import axios from 'axios'
Vue.prototype.$qs = qs
// axios.defaults.baseURL = 'http://192.168.18.15:8080/'
axios.interceptors.request.use(config => {
  NProgress.start()
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
var instance = axios.create({
  baseURL: 'http://192.168.18.15:8181/',
  // timeout: 1000 * 12, // 创建axios实例,设定超时时间是12s
  header: {
    'content-type': 'application/x-www-form-urlencode'
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
