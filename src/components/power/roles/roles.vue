<template>
  <div>
    <topnav></topnav>
    <card></card>
  </div>
</template>

<script>

import topnav from './roleschild/rolestopnav'
import card from './roleschild/rolescard'

export default {
  name:'roles',
  components:{
    topnav,
    card
  }
}
</script>

<style scoped>

</style>