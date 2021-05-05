<template>
  <div>
    <div class="primary lighten-1 intro-background">
      <v-container class="py-8 px-6" :class="{ 'py-16': $vuetify.breakpoint.smAndUp }">
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex flex-column">
              <app-avatar size="48" />
              <div class="text-h5 font-weight-bold mt-6">{{ vm.poolName }}</div>
              <div class="caption">
                {{ vm.contractAddress }}
              </div>
              <div class="my-6 d-flex justify-start flex-wrap">
                <v-btn
                  depressed
                  rounded
                  color="primary"
                  class="mr-6 mb-6"
                  large
                  :block="$vuetify.breakpoint.xs"
                  :to="`/pool-join/${vm.poolId}`"
                  :disabled="!vm.allowSwap"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon>
                  Join Pool
                </v-btn>
                <v-btn
                  depressed
                  rounded
                  color="primary"
                  large
                  outlined
                  :block="$vuetify.breakpoint.xs"
                  :href="vm.addressBscUrl"
                  target="_blank"
                  >View bscscan</v-btn
                >
              </div>
              <div class="d-flex align-center">
                <pool-state class="mr-4" :state="vm.poolState" />
                <span class="caption">{{ vm.publishedText }}</span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-sheet rounded="xl" class="pa-6">
              <div class="d-flex justify-space-between caption">
                <div>Ratio per 1 BSC</div>
                <div>{{ vm.tradeValue }} {{ vm.tokenName }} = 1 BSC</div>
              </div>
              <!-- <div class="d-flex justify-space-between align-center">
                <div class="text-h5 font-weight-bold">1234567.88 UDO</div>
                <div class="success--text">123 ETH</div>
              </div> -->
              <div class="mt-3">Closes in</div>
              <div class="text-h5 font-weight-bold">{{ vm.closesText }}</div>
              <div class="mt-3 pb-0">Progress</div>
              <div><v-progress-linear height="12" rounded :value="vm.progress" /></div>
              <div class="d-flex justify-space-between caption">
                <div>{{ vm.progress }}%</div>
                <div class="success--text">{{ vm.purchasedTokens | round(0) }}/{{ vm.totaltokens | round(0) }}</div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container class="pa-6">
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab :key="1">
          Pool Details
        </v-tab>
        <v-tab :key="2">
          About Project
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item transition="false" reverse-transition="false" :key="1">
          <div>
            <div class="text-h5 font-weight-bold pt-8 pb-6">Pool Details</div>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="ma-4 font-weight-bold">Pool Information</div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Token Distribution</div>
                  <div>{{ vm.tokenDistribution | datetime }}</div>
                </div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Min. Allocation</div>
                  <div>{{ vm.minAllocation | round }}</div>
                </div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Max. Allocation</div>
                  <div>{{ vm.maxAllocation | round }}</div>
                </div>
                <v-divider class="primary" />
                <!-- <div class="d-flex justify-space-between align-center ma-4">
                  <div>Min Swap Level</div>
                  <div>Loading</div>
                </div>
                <v-divider class="primary" /> -->
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Access Type</div>
                  <div>{{ vm.accessType }}</div>
                </div>
                <v-divider class="primary" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="ma-4 font-weight-bold">Token Information</div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Name</div>
                  <div>{{ vm.tokenName }}</div>
                </div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Address</div>
                  <div class="caption">{{ vm.tokenAddress }}</div>
                </div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Total Supply</div>
                  <div>{{ vm.totalSupply }}</div>
                </div>
                <v-divider class="primary" />
                <div class="d-flex justify-space-between align-center ma-4">
                  <div>Holders</div>
                  <div>{{ vm.participants }}</div>
                </div>
                <v-divider class="primary" />
                <!-- <div class="d-flex justify-space-between align-center ma-4">
                  <div>Transfers</div>
                  <div>Loading</div>
                </div>
                <v-divider class="primary" /> -->
              </v-col>
            </v-row>
          </div>
        </v-tab-item>
        <v-tab-item transition="false" reverse-transition="false" :key="2">
          <div class="text-h5 font-weight-bold pt-8 pb-6">BSC Launch</div>
          <div class="pt-4">
            Website<br /><br />

            Whitepaper<br /><br />

            Twitter<br /><br />

            BLAUNCH is a technology ecosystem that addresses the governance, security and accessibility challenges of
            decentralized applications - enabling enterprises to manage crypto assets and capitalize on DeFi. Leveraging
            its proprietary, multi-sig key signing technology, Unido has successfully developed the Unido Enterprise
            Platform, which enables enterprises to invest in DeFi and securely manage their crypto banking operations
            from one platform. BLAUNCH's distributed signing technology, Unido Core, is a deep tech, patented solution
            which sits in the background of the app framework providing cold storage levels of security for business
            transactions whilst maintaining an easy to use, networked, app driven environment. It offers a solution that
            enables enterprises to have a key management system that secures the private keys, regarded as the identity
            and security credential, that are associated with financial value, which is what attackers are after. This
            also provides a multi-user governance structure that can map the complex structure of enterprise governance
            systems related to their custom asset management protocols. The Unido Core API enables 3rd parties to build
            new products on top of BLAUNCH's core technology. BLAUNCH Core provides authenticated access via a
            documented API making the Unido construct available for the developer community at large - enhancing the
            levels of governance and security for any distributed app involved in blockchain authentication.
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
    <company-footer class="mt-16" />
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Watch, Provide } from 'vue-property-decorator'
import { IdoPoolDetailViewModel } from '../viewmodels/ido-pool-detail-viewmodel'

@Observer
@Component({
  components: {
    'pool-state': () => import('../components/pool-state.vue')
  }
})
export default class IdoPoolDetail extends Vue {
  @Provide() vm = new IdoPoolDetailViewModel()

  tab = null

  @Watch('$route.params.poolid', { immediate: true }) onPoolIdChanged(val: string) {
    if (val) {
      this.vm.loadPool(val)
    }
  }
}
</script>

<style scoped lang="scss">
.intro-background {
  background: url('../../../assets/images/background.svg') repeat-y;
  background-size: 100% 100%;
}
.btn-get {
  background-color: white;
}
</style>
