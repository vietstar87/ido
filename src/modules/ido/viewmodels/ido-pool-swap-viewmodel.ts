import { loadingController } from '@/components/global-loading/global-loading-controller'
import { snackController } from '@/components/snack-bar/snack-bar-controller'
import { Zero } from '@/constants'
import { FixedSwapContractPurchase } from '@/libs/models/FixedSwapContract'
import { walletStore } from '@/stores/wallet-store'
import { FixedNumber } from '@ethersproject/bignumber'
import { sumBy } from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { PoolStore } from '../stores/pool-store'
import { poolsStore } from '../stores/pools-store'

export class IdoPoolSwapViewModel {
  @observable remainToken = Zero

  @observable purchases: FixedSwapContractPurchase[] = []
  @observable maximumBnb = Zero
  @observable tradeValue = FixedNumber.from(1)

  @observable poolStore?: PoolStore

  constructor() {
    //
  }

  @asyncAction *connectWallet() {
    yield walletStore.connect()
    this.getContractContrains()
  }

  @asyncAction *loadPool(poolId: string) {
    loadingController.increaseRequest()
    try {
      this.poolStore = yield poolsStore.getPool(poolId)
      const contract = this.poolStore!.contract
      if (contract) {
        this.maximumBnb = yield contract.individualMaximumAmount().then(val => FixedNumber.from(val))
        this.tradeValue = yield contract.tradeValue().then(val => FixedNumber.from(val))
        this.getContractContrains()
      }
    } catch (err) {
      snackController.error('You do not have permission to access this pool')
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @asyncAction *getContractContrains() {
    loadingController.increaseRequest()
    try {
      const contract = this.poolStore!.contract
      if (contract) {
        this.remainToken = yield contract.tokensAvailable().then(val => FixedNumber.from(val))
        if (!this.connected) return
        const purchaseIds: string[] = yield contract.getAddressPurchaseIds({ address: walletStore.account })
        this.purchases = yield Promise.all(purchaseIds.map(purchase_id => contract.getPurchase({ purchase_id })))
      }
    } finally {
      loadingController.decreaseRequest()
    }
  }

  @asyncAction *swap(tokenAmountText: string) {
    try {
      loadingController.increaseRequest()
      const contract = this.poolStore!.contract!
      const finished = yield contract.isFinalized()
      if (finished) throw new Error('This pool is finalized')
      const open = yield contract.isOpen()
      if (!open) throw new Error('This pool is not opened')
      const tokenAmount = Number.parseInt(tokenAmountText)
      if (!tokenAmount) throw new Error('BNB is not valid')
      if (tokenAmount > this.maxRemainPurchaseTokens.toUnsafeFloat())
        throw new Error(`BNB must not exceed ${this.maxRemainPurchaseBnb}`)
      const hasWhitelist = yield contract.hasWhitelisting()
      if (hasWhitelist) {
        const white = yield contract.isWhitelisted({ address: walletStore.account })
        if (!white) throw new Error('You are not in whitelist')
      }

      const res = yield contract.swap({
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
      const contract = this.poolStore?.contract
      if (!contract) return Zero
      if (isNaN(tokenAmount)) return Zero
      return await contract.getETHCostFromTokens({ tokenAmount }).then(val => FixedNumber.from(val))
    } catch (error) {
      return Zero
    }
  }

  calculateAmountToken(bnbCost = 0) {
    try {
      if (isNaN(bnbCost)) return Zero
      return FixedNumber.from(bnbCost).divUnsafe(this.tradeValue)
    } catch (error) {
      return Zero
    }
  }

  @computed get bnbBalance() {
    return walletStore.bnbBalance
  }

  @computed get purchasedBnb() {
    return this.purchases.reduce((pre, cur) => pre.addUnsafe(FixedNumber.from(cur.ethAmount)), FixedNumber.from('0'))
  }

  @computed get maxRemainPurchaseBnb() {
    const possibleMax = this.maximumBnb.subUnsafe(this.purchasedBnb)
    if (possibleMax.toUnsafeFloat() > this.bnbBalance.toUnsafeFloat()) {
      return this.bnbBalance
    } else {
      return possibleMax
    }
  }

  @computed get maxRemainPurchaseTokens() {
    return this.maxRemainPurchaseBnb.divUnsafe(this.tradeValue)
  }

  @computed get connected() {
    return walletStore.connected
  }

  @computed get poolId() {
    return this.poolStore?.pool?.id
  }
}
