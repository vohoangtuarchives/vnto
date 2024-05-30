<script>
import TableData from "../../../components/ui/tableData.vue";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { ref } from "vue";
import PriceRuleService from "@/services/priceRule.service";
import Carousel from "primevue/carousel";

export default {
  props: {
    headerTitle: String,
    pageTitle: String,
    Carousel,
  },
  components: {
    Layout,
    PageHeader,
    TableData,
  },
  data() {
    return {
      unitCode: 1,
      data: ref([]),
      columShow: [
        "service_policy",
        "quydoisocho",
        "donvitinh",
        "donvikhach",
        "ghinhankpi",
        "status",
      ],
      service: PriceRuleService,
      statuses: ref([
        { name: this.$t("hoatdong"), value: 1, severity: "success" },
        { name: this.$t("tamdung"), value: 0, severity: "danger" },
      ]),
      kpies: ref([
        { name: this.$t("co"), value: 1, severity: "success" },
        { name: this.$t("khong"), value: 0, severity: "danger" },
      ]),
      isLoading: false,
      arrayLink:[
        {
          name: 'add',
          route: 'settings.price_rule.add',
        },
        {
          name: 'edit',
          route: 'settings.price_rule.edit',
        },
      ]
    };
  },
  setup() {
  },
  methods: {
  },
};
</script>
<template>
  <Layout>
    <PageHeader
      :title="`${$t('quanly')} ${$t('doituong.doituong')}`"
      pageTitle="Dashboard"
    />
    <BCard>
      <TableData
        :services="service"
        :columShow="columShow"
        :arrayLink="arrayLink"
      />
    </BCard>
  </Layout>
</template>
