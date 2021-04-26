<template>
  <div class="fill-height">
    <div class="intro-background">
      <v-container class="d-flex flex-column py-8 px-6" :class="{ 'align-center py-16': $vuetify.breakpoint.smAndUp }">
        <div
          :class="{
            'text-h2 text-center font-weight-black': $vuetify.breakpoint.smAndUp,
            'text-h5 font-weight-bold': $vuetify.breakpoint.xs
          }"
        >
          <span class="primary--text">BSClaunch<br /></span>
          <div class="mt-4 font-weight-medium">The incubator for future unicorns</div>
        </div>
        <!-- <div class="py-6" :class="{ 'text-center': $vuetify.breakpoint.smAndUp }">
          IDO -<br />
          Good token start-ups do not have a chance to access IDO.<br />
          Many poor quality IDO projects listed on IDO do not make an attractive or unfair profit margin<br />
          Many IDO projects are difficult to join whitelist, whitelist of some IDO projects acquired by wallet addresses
          with large balances or by a community group acquiring IDO tokens, leading to not many investors accessing get
          IDO
        </div> -->
        <div class="d-flex justify-start flex-wrap mt-6">
          <v-btn depressed rounded large color="primary" class="mr-6 mb-6" :block="$vuetify.breakpoint.xs"
            >View all Pools</v-btn
          >
          <v-btn depressed rounded large color="primary" outlined :block="$vuetify.breakpoint.xs"
            >Subscribe to upcoming pools</v-btn
          >
        </div>
      </v-container>
    </div>
    <div class="primary lighten-1">
      <v-container class="pa-6 pb-16">
        <v-row>
          <v-col cols="12" class="text-h5 font-weight-bold">Upcoming Pools</v-col>
          <v-col cols="12" sm="6" md="4">
            <upcoming-pool-item />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <upcoming-pool-item />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <upcoming-pool-item />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <upcoming-pool-item />
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" rounded outlined>Get Notified</v-btn>
          </v-col>
          <v-col cols="12" class="text-h5 font-weight-bold">Featured Pools</v-col>
          <v-col cols="12" sm="6" md="4" v-for="model in vm.pools" :key="model.pool.id">
            <featured-pool-item :model="model" />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <company-footer />
  </div>
</template>

<script>
import FeaturedPoolItem from '../components/featured-pool-item.vue'
import UpcomingPoolItem from '../components/upcoming-pool-item.vue'
import { IdoPoolsViewModel } from '../viewmodels/ido-pools-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Vue, Provide } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    UpcomingPoolItem,
    FeaturedPoolItem
  }
})
export default class IdoPools extends Vue {
  @Provide() vm = new IdoPoolsViewModel()
}
</script>

<style scoped lang="scss">
.intro-background {
  background: url('../../../assets/images/background.svg') repeat-y;
  background-size: 100% 100%;
}
</style>
