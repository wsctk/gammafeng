import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/css/global.css'
import 'nprogress/nprogress.css'
import qs from 'qs'
import axios from 'axios'
Vue.prototype.$qs = qs

axios.defaults.withCredentials = true
var instance = axios.create({
  baseURL: 'https://admin-api.gamma.it-10.com/',
  header: {
    'content-type': 'application/x-www-form-urlencode, multipart/form-data;charset=utf-8'
  }
})
Vue.prototype.$http = instance

Vue.config.productionTip = false

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const sec = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}年${m}月${d}日${hh}时${mm}分${sec}秒`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
