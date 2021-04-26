import { FixedPoolModel } from '@/models/fixed-pool-model'
import { apiService } from '@/services/api-service'
import { first, mapKeys } from 'lodash'
import { computed, observable } from 'mobx'
import { asyncAction } from 'mobx-utils'
import { reactionWithPrev } from '@/helpers/mobx.helper'
import { PoolStore } from './pool-store'

export class PoolsStore {
  @observable pools: PoolStore[] = []

  constructor() {
    reactionWithPrev(() => this.pools, this._handlePoolsChanged)
  }

  //#region ACTIONS
  @asyncAction *fetchPools() {
    const pools: FixedPoolModel[] = yield apiService.fixedPool.find()
    this.pools = pools.map(p => {
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
        this.pools.push(poolStore)
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
    return mapKeys(this.pools, p => p.pool.id)
  }
  //#endregion
}

export const poolsStore = new PoolsStore()
