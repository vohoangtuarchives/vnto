<template>
  <li class="d-flex col-md-3 mb-3" >
    <div class="setting-item-icon">
      <vue-feather :type=item.icon stroke="red"></vue-feather>
    </div>
    <div class="media-body">
      <h6 class="mt-0 mb-1"><a :href='item.url'>{{ item.title }}</a></h6>
      {{ item.desc }}
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: Object
  }
}
</script>