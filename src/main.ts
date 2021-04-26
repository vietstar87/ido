import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { componentRegister } from './plugins/component-register'
import { directiveRegister } from './plugins/directive-register'
import { pluginsRegister } from './plugins/plugins-register'
import { vueFilterRegister } from './plugins/vue-filter-register'
import vuescroll from 'vuescroll'

Vue.config.productionTip = false
Vue.use(vuescroll, {
  ops: {
    bar: {
      background: '#FFC10766'
    }
  }
})

// app configs
pluginsRegister()
componentRegister()
directiveRegister()
vueFilterRegister()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
