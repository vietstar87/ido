import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/pools' },
  {
    path: '/pools',
    name: 'IDOPools',
    component: () => import('../modules/ido/pages/ido-pools.vue')
  },
  {
    path: '/pool/:poolid',
    name: 'IDOPoolDetail',
    component: () => import('../modules/ido/pages/ido-pool-detail.vue')
  },
  {
    path: '/pool-join/:poolid',
    name: 'IDOPoolSwap',
    component: () => import('../modules/ido/pages/ido-pool-swap.vue')
  },
  {
    path: '/swap',
    name: 'PancakeSwap',
    component: () => import('../modules/pancake/pages/swap.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
