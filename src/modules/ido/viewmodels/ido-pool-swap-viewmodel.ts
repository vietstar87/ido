import { loadingController } from '@/components/global-loading/global-loading-controller'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import FixedSwapContract, { FixedSwapContractPurchase } from '@/libs/models/FixedSwapContract'
import { FixedPoolModel } from '@/models/fixed-pool-model'
import { apiService } from '@/services/api-service'
import { walletStore } from '@/stores/wallet-store'
import { sumBy } from 'lodash'
import { computed, observable, when } from 'mobx'
import { asyncAction } from 'mobx-utils'

export class IdoPoolSwapViewModel {
  @observable remainToken = ''

  @observable swapContract?: FixedSwapContract = undefined
  @observable purchases: FixedSwapContractPurchase[] = []
  @observable maximumBnb = 0
  @observable tradeValue = 1

  @observable canAccessPool = false
  @observable pool?: FixedPoolModel = undefined

  constructor() {
    if ((window.ethereum as any)?.isConnected()) {
      walletStore.connect()
    }
  }

  @asyncAction *loadPool(tokenName: string) {
    loadingController.increaseRequest()
    try {
      yield when(() => !!walletStore.account)
      const pool: FixedPoolModel = (yield apiService.fixedPool.find({ tokenName }, { _limit: 1 }))[0]
      this.pool = pool
      const contractAddress = pool.address
      const tokenAddress = pool.tokenAddress
      // const tokenAddress = '0x91474ed5bfc1082f364c2cd679a1a6023c9a27ab'
      // const contractAddress = '0x5a7bac1662e126b6dda4991ab54cb0dd4a34e1e4'
      this.swapContract = walletStore.app.getFixedSwapContract({
        tokenAddress,
        contractAddress
      })
      this.maximumBnb = yield this.swapContract.individualMaximumAmount()
      this.tradeValue = yield this.swapContract.tradeValue()
      this.getContractContrains()
      this.canAccessPool = true
    } catch (err) {
      snackController.error('You do not have permission to access this pool')
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @asyncAction *getContractContrains() {
    loadingController.increaseRequest()
    try {
      this.remainToken = yield this.swapContract!.tokensAvailable()
      const purchaseIds: string[] = yield this.swapContract!.getAddressPurchaseIds({ address: walletStore.account })
      this.purchases = yield Promise.all(
        purchaseIds.map(purchase_id => this.swapContract!.getPurchase({ purchase_id }))
      )
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @asyncAction *swap(tokenAmountText: string) {
    try {
      loadingController.increaseRequest()
      if (!this.canAccessPool) throw new Error(`You do not have permission to access this pool`)
      const open = yield this.swapContract!.isOpen()
      if (!open) throw new Error('This pool is not opened')
      const tokenAmount = Number.parseInt(tokenAmountText)
      if (!tokenAmount) throw new Error('BNB is not valid')
      if (tokenAmount > this.maxRemainPurchaseTokens)
        throw new Error(`BNB must not exceed ${this.maxRemainPurchaseBnb}`)
      const white = yield this.swapContract?.isWhitelisted({ address: walletStore.account })
      if (!white) throw new Error('You are not in whitelist')

      const res = yield this.swapContract!.swap({
        tokenAmount
      })
      if (res?.status) {
        snackController.success('Swap successed')
        this.getContractContrains()
      }
    } finally {
      loadingController.decreaseRequest()
    }
  }

  async calculateBnbCost(tokenAmount = 0) {
    try {
      if (isNaN(tokenAmount)) return 0
      return await this.swapContract!.getETHCostFromTokens({ tokenAmount })
    } catch (error) {
      return 0
    }
  }

  calculateAmountToken(bnbCost = 0) {
    try {
      if (isNaN(bnbCost)) return 0
      return bnbCost / this.tradeValue
    } catch (error) {
      return 0
    }
  }

  @computed get bnbBalance() {
    return walletStore.bnbBalance
  }

  @computed get purchasedBnb() {
    return sumBy(this.purchases, p => +p.ethAmount)
  }

  @computed get maxRemainPurchaseBnb() {
    const possibleMax = this.maximumBnb - this.purchasedBnb
    if (possibleMax > this.bnbBalance) {
      return this.bnbBalance
    } else {
      return possibleMax
    }
  }

  @computed get maxRemainPurchaseTokens() {
    return this.maxRemainPurchaseBnb / this.tradeValue ?? 0
  }
}
