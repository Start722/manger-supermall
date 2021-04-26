<template>
  <div>
    <topnav></topnav>
    <card></card>
  </div>
</template>

<script>

import topnav from './rightschild/rightstopnav'
import card from './rightschild/rightscard'

export default {
  name:'rights',
  components:{
    topnav,
    card
  }
}
</script>

<style scoped>

</style>