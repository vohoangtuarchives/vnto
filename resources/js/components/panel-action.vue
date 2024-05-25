<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>



<template>
  <BRow>
    <BCol cols="12">
      <div class="page-title-box d-sm-flex align-items-center justify-content-between">
        <div class="page-title-right">
          <slot></slot>
        </div>
      </div>
    </BCol>
  </BRow>
</template>
