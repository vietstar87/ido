<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12" class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require(`../assets/logo-with-name.${providers.themeType}.svg`)"
          transition="scale-transition"
          width="180"
        />
      </v-col>
      <v-col cols="12" sm="3" class="text-body-2">
        The incubator for future unicorns
      </v-col>
      <v-col cols="12" sm="4">
        <div class="d-flex justify-center">
          <div class="d-flex flex-column">
            <a class="text-subtitle-1 font-weight-medium">About Project</a>
            <a class="text-subtitle-1 font-weight-medium">Token Allocatoin</a>
            <a class="text-subtitle-1 font-weight-medium">Readmap</a>
          </div>
          <div class="d-flex flex-column ml-4">
            <a class="text-subtitle-1 font-weight-medium">Solution</a>
            <a class="text-subtitle-1 font-weight-medium">Readmap</a>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="5">
        <div>
          <p class="text-h5 font-weight-bold mb-2">Newsletter</p>
          <p class="text-body-2">Keep In touch with us!</p>
          <div class="d-flex align-end">
            <v-text-field hide-details placeholder="Your email address"></v-text-field>
            <v-btn depressed large rounded color="primary" class="ml-4">Subscribe</v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="7" class="text-caption font-weight-medium">Copyright 2021 @ BSClaunch</v-col>
      <v-col cols="12" sm="5">
        <div>
          <a href="https://medium.com/@bsclaunchofficial">
            <v-icon small>
              fab fa-medium-m
            </v-icon>
          </a>
          <a href="https://t.me/Bsclaunchchannel" class="ml-6">
            <v-icon small>
              fab fa-telegram-plane
            </v-icon>
          </a>
          <a href="https://t.me/Bsclaunchgroup" class="ml-6">
            <v-icon small>
              fab fa-telegram
            </v-icon>
          </a>
          <a href="https://twitter.com/Bsc_Launch?s=09" class="ml-6">
            <v-icon small>
              fab fa-twitter
            </v-icon>
          </a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Inject } from 'vue-property-decorator'
import { AppProvider } from '@/app-providers'

@Observer
@Component
export default class Footer extends Vue {
  @Inject() providers!: AppProvider
}
</script>

<style></style>
