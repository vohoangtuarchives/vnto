<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import TableData from '../../../components/ui/tableData.vue'
import PostService from "@/services/post.service";
export default {
  components: {
    Layout,
    PageHeader,
    TableData,
  },
  data() {
    return {
      title : this.$route.query.title || 'Default Title',
      columShow:['photo','show_on_news'],
      service: PostService, 
      arrayLink:[
        {
          name: 'add',
          route: 'posts.add',
        },
        {
          name: 'edit',
          route: 'posts.edit',
        },
        {
          name: 'view',
          route: 'posts.overview',
        },
      ]
    };
  },
  watch: {
    "$route.query.title": {
      handler(newTitle) {
        this.title = newTitle;
      },
      immediate: true,
    },
  },
};
</script>
<template>
  <Layout>
    <PageHeader :title="`${$t('quanly')} ${this.title}`" pageTitle="Dashboard" />
    <BCard>
      <TableData :services="this.service" :columShow="columShow" :arrayLink="arrayLink"/>
    </BCard>
  </Layout>
</template>