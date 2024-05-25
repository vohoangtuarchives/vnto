<template>
<div id="app">
<!-- <LoaderBar /> -->
 <router-view></router-view>
  <Toast></Toast>
</div>
</template>

<script>


import {useToast} from "primevue/usetoast";

export default {

  name: 'App',

  components: {
    // LoaderBar
  },
  setup(){
    return {
      toast: useToast()
    }
  },
  methods: {
    showToast(msg, options){
      this.toast.add({severity: options.type,  detail: msg, life: 3000});
    },
  }
}

</script>
<style>
#nprogress .bar{height: 5px !important;}
</style>
