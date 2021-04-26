import { apiService } from '@/services/api-service'
import { action, observable, reaction } from 'mobx'
import VueRouter from 'vue-router'
import { localData } from './stores/local-data'
import { walletStore } from './stores/wallet-store'

export class AppProvider {
  router!: VueRouter
  api = apiService
  wallet = walletStore

  @observable lightmode = localData.lightmode

  constructor() {
    reaction(
      () => this.lightmode,
      mode => (localData.lightmode = mode)
    )
  }

  @action toggleLightMode($vuetify) {
    this.lightmode = !this.lightmode
    $vuetify.theme.dark = !this.lightmode
  }
}

export const appProvider = new AppProvider()
