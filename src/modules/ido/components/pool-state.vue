<template>
  <div :class="`d-flex py-1 px-2 rounded-pill align-center ${backgroundClass}`">
    <div :class="`rounded-circle ${circleClass}`" style="width: 12px; height: 12px"></div>
    <span :class="`ml-2 text-caption font-weight-medium ${textClass}`">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { PoolState, formatDuration } from '../business/swap-contract.business'

@Observer
@Component({ components: {} })
export default class FeaturedPoolItem extends Vue {
  @Prop() state?: PoolState

  text = ''
  warn = false

  @Watch('state', { immediate: true }) onStateChanged(state: PoolState) {
    console.log(state)
    if (!state) return
    const { ended, started, filled, startDuration, endDuration } = state
    this.warn = true
    if (ended) {
      this.text = filled ? 'Filled' : 'Ended'
      // this.warn = !filled
    } else if (started) {
      this.text = filled ? 'Filled' : `in ${formatDuration(endDuration)}`
    } else {
      this.text = `in ${formatDuration(startDuration)}`
    }
  }

  get backgroundClass() {
    return this.warn ? 'primary lighten-1' : 'success lighten-1'
  }
  get circleClass() {
    return this.warn ? 'error' : 'success'
  }
  get textClass() {
    return this.warn ? 'error--success' : 'error--text'
  }
}
</script>

<style></style>
