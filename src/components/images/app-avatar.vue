<template>
  <v-avatar v-bind="$attrs" @click="$emit('click', $event)">
    <v-img :src="url" lazy-src="../../assets/icons/default-pool-icon.svg"></v-img>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator'
import _ from 'lodash'
import { fileHelpers } from '@/helpers/file-helper'
import { apiService } from '@/services/api-service'

@Component
export default class AppAvatar extends Vue {
  @Prop() avatar: any

  url: string | null = null

  @Watch('avatar', { immediate: true }) async onAvatarChanged(val: any) {
    try {
      if (val instanceof File) {
        this.url = URL.createObjectURL(val)
      } else if (typeof val === 'string') {
        if (val) {
          const model = await apiService.getFile(val)
          this.url = fileHelpers.getApiFileUrl(model)
        }
      } else if (val) {
        this.url = fileHelpers.getApiFileUrl(val)
      }
    } catch (error) {
      console.error('onAvatarChanged', error)
    }
    if (!this.url) {
      this.url = require('../../assets/icons/default-pool-icon.svg')
    }
  }
}
</script>

<style scoped></style>
