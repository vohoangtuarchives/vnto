<template>
  <Layout>
    <PageHeader :title="$t('organization-unit.title')" page-title="Dashboard"></PageHeader>
    <BContainer fluid>
      <BCard>
        <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
          <BCardTitle class="m-0">{{ $t('danhsach') }}</BCardTitle>
          <div class="flex-shrink-0">
            <button class="btn btn-sm btn-success" @click="addSourceModal">
              <i
                  class="ri-add-fill me-1 align-bottom"
                  data-toggle="tooltip"
                  title=""
                  data-bs-original-title="Thêm mới"
                  aria-label="Thêm mới"></i>
              Thêm mới
            </button>
          </div>
        </BCardHeader>
        <BCardBody>
          <Datatable ajax="/organization/unit" v-model:options="datatable">
            <thead class="table-light">
            <tr>
              <th class="td-stt">{{$t("STT")}}</th>
              <th>{{$t("organization-unit.name")}}</th>
              <th>{{$t("organization-unit.unit_code")}}</th>
              <th>{{$t("organization-unit.status")}}</th>
              <th>{{$t("organization-unit.head_of_department")}}</th>
              <th class="td-action"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,key) in datatable.data" :key="key">
              <td>{{item.id}}</td>
              <td>{{item.name}}</td>
              <td>{{item.unit_code}}</td>
              <td>{{item.status}}</td>
              <td>{{item.user_id}}</td>
              <td>
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item"  href="#">{{  $t('capnhat')}} </a></li>
                    <li><a class="dropdown-item" href="#">{{$t('xoa') }}</a></li>
                  </ul>
                </div>
              </td>
            </tr>
            </tbody>
          </Datatable>
        </BCardBody>
      </BCard>
    </BContainer>
  </Layout>
</template>

<script>

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import Datatable from "@/components/ui/datatables/Datatable.vue";

export default {
  props: {
  },
  emits: {

  },
  data(){
    return {
      datatable: {
        per_page: 10,
      }
    }
  },
  setup(){

  },
  mounted() {
  },
  computed: {

  },
  components: {
    Datatable,
    Layout,
    PageHeader,
  }
}
</script>