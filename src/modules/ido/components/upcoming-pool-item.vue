<template>
  <router-link :to="`/pool/${model.pool.id}`">
    <card-hover>
      <v-card-title>
        <app-avatar size="48" />
        <v-spacer />
        <pool-state :state="model.poolState" />
      </v-card-title>
      <v-card-title class="pt-0">{{ model.pool.name }}</v-card-title>
      <v-card-subtitle class="pb-0">Total Raise</v-card-subtitle>
      <v-card-title class="pt-0 primary--text">{{ model.pool.totalRaise | round }}</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <div class="d-flex justify-space-between">
          <div>
            <div class="caption">Min Allocation</div>
            <div class="text-h6">{{ model.pool.minAllocation | round }}</div>
          </div>
          <div>
            <div class="caption">Max Allocation</div>
            <div class="text-h6">{{ model.pool.maxAllocation | round }}</div>
          </div>
          <div>
            <div class="caption">Access</div>
            <div class="text-h6">{{ model.pool.accessType }}</div>
          </div>
        </div>
      </v-card-text>
    </card-hover>
  </router-link>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import CardHover from '../../../components/card-hover.vue'
import { PoolStore } from '../stores/pool-store'
import poolState from './pool-state.vue'

@Observer
@Component({ components: { poolState, CardHover } })
export default class FeaturedPoolItem extends Vue {
  @Prop({ required: true, default: null }) model!: PoolStore

  mounted() {
    this.model.loadDataIfNeed()
  }
}
</script>

<style scoped lang="scss"></style>
