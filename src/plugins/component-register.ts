import Vue from 'vue'

export const componentRegister = () => {
  Vue.component('company-footer', () => import('@/components/company-footer.vue'))
  Vue.component('card-hover', () => import('@/components/card-hover.vue'))
  Vue.component('app-avatar', () => import('@/components/images/app-avatar.vue'))
}
