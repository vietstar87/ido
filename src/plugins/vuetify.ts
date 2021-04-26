import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import settingsSvg from '../assets/icons/settings.svg'

Vue.use(Vuetify)

export default new Vuetify({
  iconfont: 'fa',
  icons: {
    iconfont: 'fa',
    values: {
      // settings: settingsSvg
    }
  },
  theme: {
    dark: true,
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: {
          base: '#FFC107',
          lighten1: '#FEF8E7'
        },
        success: {
          base: '#5FCD5B',
          lighten1: '#dff5de'
        },
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#F44336',
        info: '#2196F3',
        warning: '#FFC107'
      },
      dark: {
        primary: {
          base: '#FFC107',
          lighten1: '#121212'
        },
        success: {
          base: '#5FCD5B',
          lighten1: '#dff5de'
        }
      }
    }
  }
})
