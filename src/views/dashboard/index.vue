<template>
  <div class="" style="margin: 10px">
    <card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Card, Sale, Observe
  }
}
</script>

<style scoped>

</style>
