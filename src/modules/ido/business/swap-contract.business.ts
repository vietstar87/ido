import { round } from 'lodash'
import moment, { Duration, duration } from 'moment'
import { PoolStore } from '../stores/pool-store'

interface PoolState {
  filled: boolean
  started: boolean
  ended: boolean
  startDuration: Duration
  endDuration: Duration
}

const formatDuration = (duration: moment.Duration) => {
  let text = ''
  const makeNumber = n => Math.abs(round(n, 0))
  if (duration.asMonths()) text = `${makeNumber(duration.asMonths())} months`
  else if (duration.asWeeks()) text = `${makeNumber(duration.asWeeks())} weeks`
  else if (duration.asDays()) text = `${makeNumber(duration.asDays())} days`
  else if (duration.asHours()) text = `${makeNumber(duration.asHours())} hourse`
  else if (duration.asMinutes()) text = `${makeNumber(duration.asMinutes())} minutes`
  else text = `${duration.asSeconds()} seconds`
  return text
}

const getPoolState = async (store: PoolStore): Promise<PoolState> => {
  const { pool, contract, progress } = store
  const { startDate, endDate } = pool

  const started = moment(startDate).isBefore(moment()) || (await contract.hasStarted())
  const startDuration = duration(moment().diff(moment(startDate)))
  const ended = moment(endDate).isAfter(moment()) || (await contract.isFinalized())
  const endDuration = duration(moment(endDate).diff(moment()))
  const filled = progress > 99

  const result: PoolState = { started, startDuration, ended, endDuration, filled }

  return result
  // if (ended) {
  //   return { ...result, state: filled ? 'Filled' : 'Ended', warn: !filled }
  // } else if (started) {
  //   const text = `remain ${formatDuration(endDuration)}`
  //   return { ...result, state: filled ? 'Filled' : text }
  // } else {
  //   const text = `in ${formatDuration(startDuration)}`
  //   return { ...result, state: text }
  // }
}

export { formatDuration, getPoolState, PoolState }
