<template>
  <BRow class="mb-3">
    <BCol cols="12" lg="10" md="12">
      <BRow class="align-items-center">
        <BCol  lg="2" md="3">
          <slot name="header"></slot>
        </BCol>
        <BCol lg="8" md="10">
          <slot></slot>
        </BCol>
      </BRow>
    </BCol>
  </BRow>
</template>
<script>
export default{
}
</script>