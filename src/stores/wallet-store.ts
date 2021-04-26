import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import Application from '@/libs/models'
import Web3 from 'web3'
import { Subscription, timer } from 'rxjs'
import { loadingController } from '@/components/global-loading/global-loading-controller'
import { Zero } from '@/constants'
import { FixedNumber } from '@ethersproject/bignumber'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { ChainId } from '@pancakeswap-libs/sdk'
export class WalletStore {
  ethereum: any = window.ethereum

  app = new Application({ mainnet: false })
  @observable web3: Web3 | null = null
  @observable account = this.ethereum?.selectedAddress
  @observable bnbBalance = Zero
  @observable chainId = ChainId.MAINNET

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
    try {
      const ok = yield this.app.login()
      if (ok) {
        this.web3 = this.app.web3
        this.chainId = yield this.web3!.eth.getChainId()
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
      return ok
    } catch (error) {
      error.message && snackController.error(error.message)
      return false
    } finally {
      loadingController.decreaseRequest()
    }
  }

  ethereumConfigChanged = () => {
    window.location.reload()
  };

  @asyncAction *getBnbBalance() {
    const result = yield this.web3?.eth.getBalance(this.account)
    this.bnbBalance = FixedNumber.from(this.web3?.utils.fromWei(result, 'ether'))
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
