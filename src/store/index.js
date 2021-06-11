import Vue from 'vue'
import Vuex from 'vuex'

import live from './module/live'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    live
  }
})

export default store
