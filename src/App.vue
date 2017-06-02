<template>
<div>    
    <router-view></router-view>
</div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm=>{
      console.log(window.location.pathname);
      if(!window.location.pathname.substr(1)){
          vm.$router.replace({path:"/home"})
      }

    })
  }
}
</script>

<style>

</style>
