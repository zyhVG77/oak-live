import Vue from 'vue'
import Vuex from 'vuex'

import live from './module/live'
import user from './module/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    live,
    user
  }
})

export default store
