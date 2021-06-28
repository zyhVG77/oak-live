import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import LoadScript from 'vue-plugin-load-script';
import VueMaterial from 'vue-material'
import Chat from 'vue-beautiful-chat'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueAxios, axios)
Vue.use(LoadScript)
Vue.use(VueMaterial)
Vue.use(Chat)

/*
  Add a request interceptor so that
  every request will be sent with token
*/
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    // eslint-disable-next-line dot-notation
    config.headers.common['Authentication'] = token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
})

router.beforeEach((to, from, next) => {
  // If the token is in the LocalStorage
  if (store.getters['user/isLoggedIn']) {
    // Check whether the user info has been fetched
    const currentUser = store.getters['user/currentUser']
    if (!currentUser) {
      store.dispatch('user/getUserInfo')
        .then(user => {
          console.log(user)
          next({...to, replace: true})
        })
        .catch(err => console.log(err))
    } else {
      next()
    }
  } else if (to.fullPath === '/login' || to.fullPath === '/register') {
    next()
  } else {
    // next('/login')
    next('/login')
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
