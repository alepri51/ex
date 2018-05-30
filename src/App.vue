<template>
  <div id="app">
    <layout/>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
    layout: () => import('./components/layout.vue')
  }
}

</script>

<style>
</style>
