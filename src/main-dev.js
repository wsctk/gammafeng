import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import qs from 'qs'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import JsonExcel from 'vue-json-excel'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.component('downloadExcel', JsonExcel)
Vue.use(VueQuillEditor)
Vue.prototype.$qs = qs

axios.defaults.withCredentials = true
var instance = axios.create({
  // baseURL: 'https://admin-api.gamma.it-10.com/',
  // baseURL: 'http://192.168.18.5:8181/',
  baseURL: 'http://192.168.18.8:8181/',
  // baseURL: 'http://admin-api-gmf.it-10.com/',
  timeout: 10000,
  header: {
    'content-type': 'application/x-www-form-urlencode, multipart/form-data;charset=utf-8'
  }
})
Vue.prototype.$http = instance

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const sec = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}年${m}月${d}日${hh}:${mm}:${sec}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
