import { getBscScanLink } from '@/helpers'
import { walletStore } from '@/stores/wallet-store'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { formatDuration } from '../business/swap-contract.business'
import { poolsStore } from '../stores/pools-store'

export class IdoPoolDetailViewModel {
  @observable poolid = '';

  @asyncAction *loadPool(poolid: string) {
    this.poolid = poolid
    yield poolsStore.getPool(poolid)
    this.poolStore?.loadData()
  }

  @computed get addressBscUrl() {
    if (!this.contractAddress) return ''
    return getBscScanLink(walletStore.chainId, this.contractAddress, 'address')
  }

  @computed get poolStore() {
    if (!this.poolid) return null
    return poolsStore.pools.find(p => p.pool.id === this.poolid)
  }

  @computed get pool() {
    return this.poolStore?.pool
  }
  @computed get poolId() {
    return this.poolStore?.pool.id
  }
  @computed get minAllocation() {
    return this.pool?.minAllocation ?? 'No minimum'
  }
  @computed get maxAllocation() {
    return this.pool?.maxAllocation ?? 'No maximum'
  }
  @computed get accessType() {
    return this.pool?.accessType
  }
  @computed get totalSupply() {
    return this.pool?.totalSupply
  }
  @computed get tokenDistribution() {
    return this.pool?.startDate
  }
  @computed get publishedText() {
    const poolState = this.poolStore?.poolState
    if (!poolState) return ''
    const { started, startDuration } = poolState
    return started ? `Publised ${formatDuration(startDuration)} ago` : ''
  }
  @computed get closesText() {
    const poolState = this.poolStore?.poolState
    if (!poolState) return ''
    const { ended, endDuration } = poolState
    return ended ? 'Ended' : `Ended in ${formatDuration(endDuration)}`
  }
  @computed get poolName() {
    return this.pool?.name || ''
  }
  @computed get tokenName() {
    return this.pool?.tokenName || ''
  }
  @computed get tokenAddress() {
    return this.pool?.tokenAddress || ''
  }
  @computed get contractAddress() {
    return this.pool?.address || ''
  }
  @computed get tradeValue() {
    return this.pool?.ratio || ''
  }
  @computed get poolState() {
    return this.poolStore?.poolState
  }
  @computed get purchasedTokens() {
    return this.poolStore?.purchasedTokens
  }
  @computed get totaltokens() {
    return this.poolStore?.totaltokens
  }
  @computed get progress() {
    return this.poolStore?.progress
  }
  @computed get participants() {
    return this.poolStore?.participants
  }

  @computed get allowSwap() {
    const { ended, started } = this.poolState || {}
    return started && !ended
  }
}
