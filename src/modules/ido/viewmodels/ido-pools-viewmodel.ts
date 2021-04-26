import { computed } from 'mobx'
import { poolsStore } from '../stores/pools-store'
export class IdoPoolsViewModel {
  constructor() {
    poolsStore.fetchPools()
  }

  @computed get pools() {
    return poolsStore.pools
  }
}
