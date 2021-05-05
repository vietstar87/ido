import { FixedPoolModel } from '@/models/fixed-pool-model'
import { apiService } from '@/services/api-service'
import { first, mapKeys } from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { reactionWithPrev } from '@/helpers/mobx.helper'
import { PoolStore } from './pool-store'
import { walletStore } from '@/stores/wallet-store'

export class PoolsStore {
  @observable allPools: PoolStore[] = []

  constructor() {
    reactionWithPrev(() => this.validPools, this._handlePoolsChanged)
  }

  //#region ACTIONS
  @asyncAction *fetchPools() {
    const pools: FixedPoolModel[] = yield apiService.fixedPool.find()
    this.allPools = pools.map(p => {
      const pool = this.poolsMap[p.id!]
      pool?.changeModel(p)
      return pool || new PoolStore(p)
    })
  }

  @asyncAction *getPool(poolId: string) {
    const pool = yield apiService.fixedPool.findOne(poolId)
    if (pool) {
      let poolStore = this.poolsMap[pool.id!]
      if (poolStore) {
        poolStore.changeModel(pool)
      } else {
        poolStore = new PoolStore(pool)
        this.validPools.push(poolStore)
      }
      return poolStore
    }
    return null
  }
  //#endregion

  //#region EFFECTS
  private _handlePoolsChanged(newPools: PoolStore[], oldPools?: PoolStore[]) {
    oldPools = oldPools || []
    const removedPeers = oldPools.filter(p => !newPools.find(x => x.pool.id === p.pool.id))
    removedPeers.forEach(p => p.destroy())
  }
  //#endregion

  //#region COMPUTEDS
  @computed get poolsMap(): { [id: string]: PoolStore } {
    return mapKeys(this.validPools, p => p.pool.id)
  }
  @computed get validPools() {
    return this.allPools.filter(p => p.pool.chainId === walletStore.chainId)
  }
  //#endregion
}

export const poolsStore = new PoolsStore()
