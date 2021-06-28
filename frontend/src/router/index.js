import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { path: '/home' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register')
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: () => import('@/views/Navigation')
  },
  {
    path: '/create-meeting',
    name: 'LiveSettings',
    component: () => import('@/views/CreateMeeting')
  },
  {
    path: '/join-meeting',
    name: 'JoinMeeting',
    component: () => import('@/views/JoinMeeting')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'live-manage',
        name: 'LiveManage',
        component: () => import('@/views/LiveManage')
      },
      {
        path: 'livestream',
        name: 'Livestream',
        component: () => import('@/views/LiveStream')
      },
      {
        path: 'whiteboard',
        name: 'Whiteboard',
        component: () => import('@/views/WhiteBoard')
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
