import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import Application from '@/libs/models'
import Web3 from 'web3'
import { Subscription, timer } from 'rxjs'
import { loadingController } from '@/components/global-loading/global-loading-controller'
export class WalletStore {
  ethereum: any = window.ethereum

  app = new Application({ mainnet: false })
  @observable web3: Web3 | null = null
  @observable account = this.ethereum?.selectedAddress
  @observable bnbBalance = 0

  private _bnbBalanceSubscription: Subscription | undefined

  constructor() {
    this.app.start()
    this.web3 = this.app.web3
    if (this.account) {
      this.connect()
    }
  }

  @asyncAction *connect() {
    loadingController.increaseRequest()
    const ok = yield this.app.login()
    if (ok) {
      this.web3 = this.app.web3
      this.account = yield this.app.getAddress()
      this.ethereum.removeListener('accountsChanged', this.ethereumConfigChanged)
      this.ethereum.removeListener('chainChanged', this.ethereumConfigChanged)
      this.ethereum.once('accountsChanged', this.ethereumConfigChanged)
      this.ethereum.once('chainChanged', this.ethereumConfigChanged)
      this._bnbBalanceSubscription?.unsubscribe()
      this._bnbBalanceSubscription = timer(0, 5000).subscribe(() => {
        this.getBnbBalance()
      })
    }
    loadingController.decreaseRequest()
  }

  ethereumConfigChanged = () => {
    window.location.reload()
  };

  @asyncAction *getBnbBalance() {
    const result = yield this.web3?.eth.getBalance(this.account)
    this.bnbBalance = +(this.web3?.utils.fromWei(result, 'ether') ?? 0)
  }

  //#region computed
  @computed get connected() {
    return !!this.account
  }

  @computed get hasEthereumPlugin() {
    return !!this.ethereum
  }

  @computed get shortAccount() {
    if (!this.account) return ''
    return this.account.substr(0, 3) + '...' + this.account.substr(this.account.length - 3)
  }
  //#endregion
}

export const walletStore = new WalletStore()
