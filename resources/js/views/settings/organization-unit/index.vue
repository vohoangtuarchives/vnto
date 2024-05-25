<template>
  <Layout>
    <PageHeader :title="$t('organization-unit.title')" page-title="Dashboard"></PageHeader>
    <BContainer fluid>
      <BCard>
        <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
          <BCardTitle class="m-0">{{ $t('danhsach') }}</BCardTitle>
          <div class="flex-shrink-0">
            <button class="btn btn-sm btn-success" @click="addUnitModal">
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
            <DataTable :value="OrganizationUnit"  :pt="{
              table: 'table',
              thead: 'table-light'
            }" :key="unitCode">
              <template #header>

              </template>

             <Column header="STT" style="width: 50px">
               <template #body="{data}">
                 {{ data.pk }}
               </template>
             </Column>

              <Column :header="$t('organization-unit.name')" >
                <template #body="{data}">
                  {{ data.name }}
                </template>
              </Column>

              <Column :header="$t('organization-unit.unit_code')" >
                <template #body="{data}">
                  {{ data.unit_code }}
                </template>
              </Column>

              <Column :header="$t('organization-unit.head_of_department')" >
                <template #body="{data}">
                  {{ data.lead_user }}
                </template>
              </Column>

              <Column :header="$t('organization-unit.status')" style="width: 120px">
                <template #body="{data}">
                  <div v-if="data.status == 1"><span class="badge border border-success  text-success">{{$t('khadung')}}</span></div>
                  <div v-if="data.status == 0"><span class="badge border border-danger  text-danger">{{$t('khongkhadung')}}</span></div>
                </template>
              </Column>



              <Column style="width: 30px">
                <template #body="{data}">
                  <div class="dropdown">
                    <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="ri-more-2-fill"></i>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li><a class="dropdown-item"  @click="addUnitModal(data)" href="#">{{  $t('capnhat')}} </a></li>
                      <li><a class="dropdown-item" href="#">{{$t('xoa') }}</a></li>
                    </ul>
                  </div>
                </template>
              </Column>

            </DataTable>
      </BCard>
    </BContainer>
  </Layout>
</template>

<script>

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import {ModalSize} from "vue-bs-modal";
import AddUnitModal from "@/views/settings/organization-unit/components/AddUnitModal.vue";
import OrganizationService from "@/services/organization.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {ref} from "vue";

export default {
  props: {
  },
  emits: {

  },
  data(){
    return {
      OrganizationUnit: ref(),
      unitCode: 1,
    }
  },
  setup(){

  },
  mounted() {
    OrganizationService.getOrganizationUnit(
      {
        per_page: 10,
      }
    ).then(
        (response)=> {
          this.OrganizationUnit = response.data.data;
        }
    );
  },
  computed: {
  },
  components: {
    DataTable,
    Layout,
    PageHeader,
    Column,
  },
  methods: {

    getStatusInfo(status) {
      switch (status) {
        case 1:
          return `<span class="badge border border-success  text-success">`+this.$t('khadung')+`</span>`;
        case 0:
          return `<span class="badge border border-danger  text-danger">`+this.$t('khongkhadung')+`</span>`;
      }
    },
    changeUnitKey(){
      this.unitCode++;
    },
    addUnitModal(data) {
      this
          .$vbsModal
          .open({
            content: AddUnitModal,
            size: ModalSize.XLARGE,
            contentProps: {
              title: this.$t("organization-unit.form.add-title"),
              item:data,
            },
            // pass event listeners to the EditProfileComponent.
            contentEmits: {
              onUpdate: ()=> this.unitCode++
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });

    },
  }
}
</script>