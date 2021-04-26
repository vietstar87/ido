import { computed } from 'mobx'
import moment from 'moment'
import { poolsStore } from '../stores/pools-store'
export class IdoPoolsViewModel {
  constructor() {
    poolsStore.fetchPools()
  }

  @computed get upcommingsPools() {
    return poolsStore.pools.filter(p => moment(p.pool.startDate).isAfter(moment()))
  }
  @computed get featuredPools() {
    return poolsStore.pools.filter(p => moment().isBetween(moment(p.pool.startDate), moment(p.pool.endDate)))
  }
  @computed get closedPools() {
    return poolsStore.pools.filter(p => moment(p.pool.endDate).isBefore(moment()))
  }
}
