<template>
  <div id="app">
    <router-link to="/home">home页</router-link>
    <router-link to="/room">room页面</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      
    }
  }
}
</script>

<style>

</style>
