<template>
  <v-hover v-slot="{ hover }">
    <v-sheet rounded="xl" :class="{ 'primary--border': hover, 'virtual--border': !hover }" :v-bind="$attrs">
      <slot />
    </v-sheet>
  </v-hover>
</template>

<script>
export default {}
</script>

<style></style>
