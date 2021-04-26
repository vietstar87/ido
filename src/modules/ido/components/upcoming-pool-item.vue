<template>
  <card-hover>
    <v-card-title>
      <app-avatar size="48" />
      <v-spacer />
      <pool-state text="in 6 days" />
    </v-card-title>
    <v-card-title class="pt-0">BSC Launch</v-card-title>
    <v-card-subtitle class="pb-0">Total Raise</v-card-subtitle>
    <v-card-title class="pt-0 primary--text">$440K</v-card-title>
    <v-divider class="mx-4"></v-divider>
    <v-card-text>
      <div class="d-flex justify-space-between">
        <div>
          <div class="caption">Min Allocation</div>
          <div class="text-h6">1234</div>
        </div>
        <div>
          <div class="caption">Max Allocation</div>
          <div class="text-h6">0.19 BNB</div>
        </div>
        <div>
          <div class="caption">Access</div>
          <div class="text-h6">Private</div>
        </div>
      </div>
    </v-card-text>
  </card-hover>
</template>

<script>
import CardHover from '../../../components/card-hover.vue'
import poolState from './pool-state.vue'
export default {
  components: { poolState, CardHover }
}
</script>

<style scoped lang="scss"></style>
