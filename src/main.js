import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/global.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.1.131:5000/'
//.request是一个请求拦截器，只要axios发起请求（请求到达服务器之前）
//就会先调用这个回调函数
axios.interceptors.request.use(config => {
  //console.log(config)
  //将token返回给服务器作为验证
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
