<template>
  <router-link :to="`/pool/${model.pool.id}`">
    <card-hover>
      <v-card-title>
        <app-avatar size="48" />
        <v-spacer />
        <pool-state :state="model.poolState" />
      </v-card-title>
      <v-card-title class="py-0">{{ model.pool.name }}</v-card-title>
      <div class="mx-4 overline success--text line-height-1">{{ model.pool.tokenName }} / BNB</div>
      <v-card-subtitle class="pb-0">Ratio per 1 BNB</v-card-subtitle>
      <v-card-title class="pt-0 primary--text">{{ model.pool.ratio + ' ' + model.pool.tokenName }}</v-card-title>
      <v-card-subtitle class="pt-3 pb-0">Progress</v-card-subtitle>
      <div class="mx-4">
        <v-progress-linear height="12" rounded :value="model.progress" />
      </div>
      <div class="mx-4 d-flex justify-space-between caption">
        <div>
          {{ model.progress + ' %' }}
        </div>
        <div class="success--text">{{ model.purchasedTokens | round(0) }} / {{ model.totaltokens | round(0) }}</div>
      </div>
      <v-divider class="mx-4 mt-4"></v-divider>
      <v-card-text>
        <div class="d-flex justify-space-between">
          <div>
            <div class="caption">Participants</div>
            <div class="text-h6">{{ model.participants }}</div>
          </div>
          <div>
            <div class="caption">Max BNB</div>
            <div class="text-h6">{{ model.maxPurchaseBnb | round(5) }}</div>
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
