import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/LiveStream')
  },
  {
    path: '/whiteboard',
    name: 'Whiteboard',
    component: () => import('@/views/WhiteBoard')
  },
  {
    path: '/live-settings',
    name: 'LiveSettings',
    component: () => import('@/views/LiveSettings')
  },
  {
    path: '/live-state',
    name: 'LiveState',
    component: () => import('@/views/LiveState')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
