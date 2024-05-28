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
      columShow:['photo','show_on_news','status'],
      service: PostService,
      nameRouterAdd: 'posts.add',
      nameRouterEdit: 'posts.edit',
      nameRouterView: "posts.overview",
    };
  },
};
</script>
<template>
  <Layout>
    <PageHeader :title="`${$t('quanly')} ${this.title}`" pageTitle="Dashboard" />
    <BCard>
      <TableData :services="this.service" :columShow="columShow" :nameRouterAdd="this.nameRouterAdd" :nameRouterEdit="this.nameRouterEdit" :nameRouterView="this.nameRouterView"/>
    </BCard>
  </Layout>
</template>