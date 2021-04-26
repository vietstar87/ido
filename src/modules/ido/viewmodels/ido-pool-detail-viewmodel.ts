import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { formatDuration } from '../business/swap-contract.business'
import { PoolStore } from '../stores/pool-store'
import { poolsStore } from '../stores/pools-store'

export class IdoPoolDetailViewModel {
  @observable tokenName = '';

  @asyncAction *loadPool(tokenName: string) {
    this.tokenName = tokenName
    yield poolsStore.getPool(tokenName)
    this.poolStore?.loadData()
  }

  @computed get poolStore() {
    if (!this.tokenName) return null
    return poolsStore.pools.find(p => p.pool.tokenName === this.tokenName)
  }

  @computed get pool() {
    return this.poolStore?.pool
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
}
