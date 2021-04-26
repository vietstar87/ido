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
  if (round(duration.asMonths())) text = `${makeNumber(duration.asMonths())} months`
  else if (round(duration.asWeeks())) text = `${makeNumber(duration.asWeeks())} weeks`
  else if (round(duration.asDays())) text = `${makeNumber(duration.asDays())} days`
  else if (round(duration.asHours())) text = `${makeNumber(duration.asHours())} hourse`
  else if (round(duration.asMinutes())) text = `${makeNumber(duration.asMinutes())} minutes`
  else text = `${duration.asSeconds()} seconds`
  return text
}

const getPoolState = async (store: PoolStore): Promise<PoolState> => {
  const { pool, contract, progress } = store
  const { startDate, endDate } = pool

  const started = moment(startDate).isBefore(moment()) // || (!!contract && (await contract.hasStarted()))
  const startDuration = duration(moment().diff(moment(startDate)))
  const ended = moment(endDate).isBefore(moment()) // || (!!contract && (await contract.isFinalized()))
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
