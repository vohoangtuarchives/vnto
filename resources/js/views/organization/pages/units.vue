<template>
  <div class="card flex justify-content-center">
    <Toast position="top-left" group="tl" />
    <Toast position="bottom-left" group="bl" />
    <Toast position="bottom-right" group="br" />

    <div class="flex flex-wrap gap-2">
      <Button label="Top Left" @click="showTopLeft" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showTopLeft(){
      console.log(this);
      this.$root.showToast("Haha", {type: "info"})
    }
  }
}
</script>
