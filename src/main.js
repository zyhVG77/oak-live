import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import LoadScript from 'vue-plugin-load-script';
import VueMaterial from 'vue-material'
import Chat from 'vue-beautiful-chat'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(LoadScript)
Vue.use(VueMaterial)
Vue.use(Chat)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
