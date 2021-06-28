/* eslint-disable dot-notation */
import axios from 'axios'
import UserApi from '../../api/user'

const state = () => ({
  status: '',
  token: localStorage.getItem('token') || '',
  user: null
})

const mutations = {
  authRequest(state) {
    state.status = 'auth_loading'
  },
  authSuccess(state, token) {
    state.status = 'auth_success'
    state.token = token
  },
  authFail(state) {
    state.status = 'auth_fail'
  },
  authError(state) {
    state.status = 'auth_error'
  },
  setUser(state, user) {
    state.user = user
  },
  logout(state) {
    state.status = ''
    state.user = null
    state.token = ''
  }
}

const actions = {
  login({commit}, user) {
    return new Promise((resolve, reject) => {
      commit('authRequest');
      UserApi.login(user,
        t => {
          localStorage.setItem('token', t)
          axios.defaults.headers.common['Authentication'] = t
          commit('authSuccess', t)
          resolve()
        },
        e => {
          commit('authFail')
          localStorage.removeItem('token')
          reject(e)
        },
        e => {
          commit('authError')
          localStorage.removeItem('token')
          reject(e)
        })
    })
  },
  logout({commit}) {
    return new Promise((resolve, reject) => {
      commit('logout')
      try {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },
  getUserInfo({commit}) {
    return new Promise((resolve, reject) => {
      UserApi.getUserInfo(
        user => {
          commit('setUser', user)
          resolve(user)
        },
        errorMsg => reject(errorMsg)
      )
    })
  }
}

const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status,
  currentUser: state => state.user
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
