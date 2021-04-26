import { FixedPoolModel } from '@/models/fixed-pool-model'
import { action, computed, IReactionDisposer, observable, reaction } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { FixedNumber } from '@ethersproject/bignumber'
import { getPoolState, PoolState } from '../business/swap-contract.business'
import FixedSwapContract from '@/libs/models/FixedSwapContract'
import { walletStore } from '@/stores/wallet-store'

export class PoolStore {
  @observable participants = 0
  @observable maxPurchaseBnb = FixedNumber.from(0)
  @observable purchasedTokens = FixedNumber.from(0)
  @observable totaltokens = FixedNumber.from(0)
  @observable poolState?: PoolState
  @observable pool: FixedPoolModel
  @observable chainId = walletStore.chainId

  contract?: FixedSwapContract
  private loaded = false

  private _diposers: IReactionDisposer[] = []

  constructor(pool: FixedPoolModel) {
    this.pool = pool
    const { address: contractAddress, tokenAddress } = pool
    this.totaltokens = FixedNumber.from(pool.totalSupply)
    this.maxPurchaseBnb = FixedNumber.from(pool.amount)
    try {
      this.contract = walletStore.app.getFixedSwapContract({
        tokenAddress,
        contractAddress
      })
    } catch (err) {
      //
    }
    this._diposers = [
      reaction(
        () => this.progress,
        () => this.updatePoolState()
      )
    ]
  }

  @action.bound loadDataIfNeed() {
    if (this.loaded) return
    this.loaded = true
    this.loadData()
  }

  @action.bound loadData() {
    const contract = this.contract
    if (contract) {
      contract.individualMaximumAmount().then(val => this.changeState({ maxPurchaseBnb: FixedNumber.from(val) }))
      contract.getBuyers().then(buyes => this.changeState({ participants: buyes.length }))
      contract.tokensAllocated().then(val => this.changeState({ purchasedTokens: FixedNumber.from(val) }))
      contract.tokensForSale().then(val => this.changeState({ totaltokens: FixedNumber.from(val) }))
    }
    this.updatePoolState()
  }

  @asyncAction *updatePoolState() {
    this.poolState = yield getPoolState(this)
  }

  @action.bound changeModel(model: FixedPoolModel) {
    this.pool = model
    this.loaded = false
  }

  @action changeState(changes: {
    pool?: FixedPoolModel
    maxPurchaseBnb?: FixedNumber
    participants?: number
    purchasedTokens?: FixedNumber
    totaltokens?: FixedNumber
    chainId?: number
  }) {
    if ('maxPurchaseBnb' in changes) this.maxPurchaseBnb = changes.maxPurchaseBnb!
    if ('participants' in changes) this.participants = changes.participants!
    if ('purchasedTokens' in changes) this.purchasedTokens = changes.purchasedTokens!
    if ('totaltokens' in changes) this.totaltokens = changes.totaltokens!
    if ('chainId' in changes) this.chainId = changes.chainId!
  }

  @computed get progress() {
    if (this.purchasedTokens.isZero() || this.totaltokens.isZero()) return 0
    const result = this.purchasedTokens.divUnsafe(this.totaltokens).mulUnsafe(FixedNumber.from(100))
    return result.toUnsafeFloat()
  }

  destroy() {
    this._diposers.forEach(d => d())
  }
}
