<template>
  <div>
    <div class="primary lighten-1 root pb-16">
      <v-container class="d-flex justify-end py-12 px-6">
        <v-btn depressed rounded color="primary" large outlined class="ml-4" to="/pool/unido">Back to Pool</v-btn>
      </v-container>
      <div class="px-6">
        <v-card rounded="xl" class="pa-4 mx-auto" max-width="420" elevation="4">
          <div class="d-flex justify-space-between align-center">
            <div class="text-h5 font-weight-bold">Swap</div>
          </div>
          <v-sheet class="pa-4 pb-1 my-4" rounded="xl" outlined>
            <div class="d-flex justify-space-between align-center">
              <div class="text-subtitle-2">From</div>
              <div class="text-caption">Balance: {{ vm.bnbBalance | round }} BNB</div>
            </div>
            <v-text-field
              hide-details
              flat
              solo
              single-line
              placeholder="0.0"
              class="input no-padding-text-field"
              v-model="bnbCost"
              @input="userChangeBnbCost"
            >
              <div slot="append" class="d-flex align-center">
                <v-btn x-small outlined rounded @click="maxBnb">
                  Max
                </v-btn>
                <span class="primary--text ml-3">BNB</span>
              </div>
            </v-text-field>
          </v-sheet>
          <div class="d-flex justify-space-around">
            <v-icon>
              mdi-arrow-down
            </v-icon>
          </div>
          <v-sheet class="pa-4 pb-1 my-4" rounded="xl" outlined>
            <div class="d-flex justify-space-between align-center">
              <div class="text-subtitle-2">To</div>
              <div class="text-caption">Remaining: {{ vm.remainToken }} tokens</div>
            </div>
            <v-text-field
              hide-details
              flat
              solo
              single-line
              placeholder="0.0"
              class="input no-padding-text-field"
              v-model="amountToken"
              @input="userChangeAmountToken"
            >
            </v-text-field>
          </v-sheet>
          <v-btn block depressed rounded color="primary my-4" @click="swap">Swap</v-btn>
          <div v-if="error" class="error--text text-caption">{{ error }}</div>
        </v-card>
      </div>
    </div>

    <company-footer />
  </div>
</template>

<script lang="ts">
import { round } from 'lodash'
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide, Watch } from 'vue-property-decorator'
import { IdoPoolSwapViewModel } from '../viewmodels/ido-pool-swap-viewmodel'

@Observer
@Component({})
export default class IdoPoolDSwap extends Vue {
  @Provide() vm = new IdoPoolSwapViewModel()

  tab = null
  bnbCost = ''
  amountToken = ''
  error = ''

  @Watch('$route.params.poolid', { immediate: true }) onPoolIdChanged(val: string) {
    if (val) {
      this.vm.loadPool(val)
    }
  }

  async swap() {
    try {
      await this.vm.swap(this.amountToken)
      this.bnbCost = '0'
      this.amountToken = '0'
    } catch (error) {
      this.error = error.message
    }
  }

  maxBnb() {
    this.bnbCost = this.vm.maxRemainPurchaseBnb + ''
    this.userChangeBnbCost(this.bnbCost)
  }

  userChangeBnbCost($event) {
    const amountToken = this.vm.calculateAmountToken($event)
    this.amountToken = round(amountToken, 6) + ''
    this.error = ''
  }

  async userChangeAmountToken($event) {
    const bnbCost = await this.vm.calculateBnbCost($event)
    this.bnbCost = round(bnbCost, 6) + ''
    this.error = ''
  }
}
</script>

<style scoped lang="scss">
.root {
  height: 100%;
  width: 100%;
  background: url('../../../assets/images/background.svg') repeat;
}
.input {
  font-weight: 600;
}
</style>
