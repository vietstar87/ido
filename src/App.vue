<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app bottom :temporary="false">
      <v-list nav dense>
        <v-list-item>
          <v-btn block depressed large rounded color="primary" outlined :to="`/swap`">B-Swap</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block depressed large rounded color="primary" outlined :to="`/pools`">B-Launch</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block depressed large rounded color="primary" outlined>B-Farm</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block depressed large rounded color="primary" outlined>Connect Walet</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat>
      <v-container class="px-6">
        <div class="d-flex align-center">
          <router-link :to="`/pools`">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              :src="require(`./assets/logo-with-name.${providers.themeType}.svg`)"
              transition="scale-transition"
              width="130"
            />
          </router-link>

          <v-spacer></v-spacer>
          <div class="d-none d-sm-flex align-center">
            <v-btn
              depressed
              rounded
              color="primary"
              large
              outlined
              :href="`https://swap.bsclaunch.org/`"
              target="_blank"
              >B-Swap</v-btn
            >
            <v-btn depressed rounded color="primary" large outlined :to="`/pools`" class="ml-4">B-Launch</v-btn>
            <v-btn depressed rounded color="primary" large outlined class="ml-4" @click="farm">B-Farm</v-btn>
            <v-btn
              v-if="!wallet.connected"
              depressed
              rounded
              color="primary"
              large
              outlined
              class="ml-4"
              @click="providers.wallet.connect()"
              >Connect Walet</v-btn
            >
            <v-btn v-else depressed rounded color="primary" large outlined class="ml-4">
              {{ wallet.shortAccount }}
            </v-btn>
            <v-btn icon small class="ml-4" @click="changeTheme">
              <v-icon>{{ this.$vuetify.theme.dark ? 'brightness_2' : 'brightness_low' }}</v-icon>
            </v-btn>
          </div>
          <v-app-bar-nav-icon class="d-flex d-sm-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </div>
      </v-container>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <snack-bar />
    <alert />
    <global-loading />
  </v-app>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Provide, Vue } from 'vue-property-decorator'
import { AppProvider, appProvider } from './app-providers'
import { walletStore } from './stores/wallet-store'

@Observer
@Component({
  components: {
    'snack-bar': () => import('@/components/snack-bar/snack-bar.vue'),
    alert: () => import('@/components/alert/alert.vue'),
    'global-loading': () => import('@/components/global-loading/global-loading.vue')
  }
})
export default class App extends Vue {
  @Provide() providers: AppProvider = appProvider

  wallet = this.providers.wallet

  mounted() {
    this.providers.router = this.$router
    walletStore.start()
  }

  drawer = false

  changeTheme() {
    this.providers.toggleLightMode(this.$vuetify)
  }

  farm() {
    // snackController.success('Comming soon');
  }
}
</script>
<style lang="scss">
.theme--light {
  .v-app-bar.v-toolbar.v-sheet {
    background-color: #fff !important;
  }
  .v-btn {
    text-transform: none !important;
    &__content {
      color: black !important;
    }
    &--active:before {
      opacity: 1 !important;
    }
    &--outlined {
      background-color: white;
    }
  }
}
.theme--dark {
  .v-tabs-items {
    background-color: transparent !important;
  }
  .v-app-bar.v-toolbar.v-sheet {
    background-color: #363636 !important;
  }
  .v-btn:not(.v-btn--outlined).primary {
    color: black !important;
  }
  .v-btn {
    text-transform: none !important;
    &--active {
      opacity: 1 !important;
      background-color: var(--v-primary-base);
      .v-btn__content {
        color: black !important;
      }
    }
    &--outlined {
      border: thin solid #686868;
      color: white !important;
    }
  }
  .v-application--wrap {
    background: #363636 !important;
  }
}
.no-padding-text-field .v-input__slot {
  padding: 0px !important;
}
.v-toolbar__content {
  border-bottom: 1px solid var(--v-primary-base) !important;
  padding: 0 !important;
}
.virtual--border {
  border: 1px solid transparent !important;
}
.primary--border {
  border: 1px solid var(--v-primary-base) !important;
}
.container {
  max-width: 1100px !important;
}
.line-height-1 {
  line-height: 1 !important;
}
.v-application {
  a {
    text-decoration: none;
    color: inherit !important;
  }
}
.v-dialog {
  border-radius: 24px !important;
}
</style>
