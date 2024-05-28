<script>
import TableData from "../../../components/ui/tableData.vue";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { ref } from "vue";
import PolicyService from "@/services/policy.service";

export default {
  props: {
    headerTitle: String,
    pageTitle: String,
  },
  components: {
    Layout,
    PageHeader,
    TableData,
  },
  data() {
    return {
      data: ref([]),
      columShow: [
        "status",
      ],
      service: PolicyService,
      isLoading: false,
      nameRouterAdd: "settings.config_policy.add",
      nameRouterEdit: "settings.config_policy.edit",
    };
  },
};
</script>
<template>
  <Layout>
    <PageHeader
      :title="`${$t('quanly')} ${$t('dichvu.dichvuchinhsach')}`"
      pageTitle="Dashboard"
    />
    <BCard>
      <TableData
        typeMan="doitruong"
        :services="this.service"
        :columShow="columShow"
        :nameRouterAdd="this.nameRouterAdd"
        :nameRouterEdit="this.nameRouterEdit"
      />
    </BCard>
  </Layout>
</template>
