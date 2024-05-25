<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
export default {
  props:{
    headerTitle: String,
    pageTitle: String
  },
  components: {
    Layout,
    PageHeader,
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="headerTitle" :pageTitle="pageTitle || 'Dashboard'" />

    <slot></slot>
  </Layout>
</template>