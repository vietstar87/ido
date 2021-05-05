import { computed } from 'mobx'
import moment from 'moment'
import { poolsStore } from '../stores/pools-store'
export class IdoPoolsViewModel {
  constructor() {
    poolsStore.fetchPools()
  }

  @computed get upcommingsPools() {
    return poolsStore.validPools.filter(p => moment(p.pool.startDate).isAfter(moment()))
  }
  @computed get featuredPools() {
    return poolsStore.validPools.filter(p => moment().isBetween(moment(p.pool.startDate), moment(p.pool.endDate)))
  }
  @computed get closedPools() {
    return poolsStore.validPools.filter(p => moment(p.pool.endDate).isBefore(moment()))
  }

  @computed get hasUpcommings() {
    return !!this.upcommingsPools.length
  }
  @computed get hasFeaturedPools() {
    return !!this.featuredPools.length
  }
  @computed get hasClosedPools() {
    return !!this.closedPools.length
  }
}
