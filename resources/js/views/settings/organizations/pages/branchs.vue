<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {ModalSize} from "vue-bs-modal";
import AddBranchModal from "@/views/settings/organizations/components/AddEditBranchModal.vue";

import OrganizationService from "@/services/organization.service";



export default {
  props:{
    headerTitle: String,
    pageTitle: String
  },
  components: {
    Layout,
    PageHeader,
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.activeGroup = newId;
        if (newId == undefined) {
          this.activeGroup = null;
        }
      },
      immediate: true // Load data initially if id exists
    },
    'currentPage':{
      handler(newId, oldId) {
        if(newId!=oldId && oldId!=undefined){
          this.$router.replace({ query: {page:newId}})
          this.getData(newId);
        }
      },
      immediate: true // Load data initially if id exists
    }
  },

  data() {
    return {
      // currentPage : ref(this.$route.query.page),
      data: ref([]),
      pagingate:ref({}),
      modalShow: false,
      loadSuccess:false,
      titleFormGroup: this.$t('t-themmoidanhmuc')
    };
  },
  setup() {
    const route = useRoute();
    const currentPage = ref(parseInt(route.query.page) || 1);
    return { currentPage };
  },
  mounted() {
    this.getData(this.currentPage);
  },
  methods: {
    getData(page){
      OrganizationService.getBranchList(page).then((response)=>{
        this.data = response.data.data.data;
        this.pagingate = response.data.data;
        this.currentPage = this.pagingate.current_page;
      })
    },
    addBranchModal(data) {
      this
          .$vbsModal
          .open({

            content: AddBranchModal,
            size: ModalSize.MEDIUM,
            contentProps: {
              title: this.$t("branch.form.add-branch-title"),
              item:data,
            },
            // pass event listeners to the EditProfileComponent.
            contentEmits: {
              onUpdate: ()=>this.getData(this.pagingate.current_page)
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });

    },
    async deleteBranch(){

    },
    getStatusInfo(status) {
      const text = status ? this.$t('khadung') : this.$t('khongkhadung');
      const className = status ? 'badge border border-success  text-success' : 'badge border border-danger  text-danger';
      return { text, className };
    },
    chinhanh(isMain){
      const text = isMain ? this.$t('trusochinh') : this.$t('chinhanh');
      return text;
    }
  }
};
</script>
<template>
  <Layout>
    <PageHeader title="Quản lý chi nhánh" pageTitle="Dashboard" />
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
            <BCardTitle class="m-0">{{ $t('danhsach') }}</BCardTitle>
            <div class="flex-shrink-0">
              <button class="btn btn-sm btn-success" @click="addBranchModal">>
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
          <DataTable :value="data"  :pt="{
              table: 'table',
              thead: 'table-light'
            }" :key="unitCode">
            <template #header>

            </template>
            <Column :header="$t('stt')" style="width: 50px">
              <template #body="{data}">
                {{ data.pk }}
              </template>
            </Column>

            <Column :header="$t('tenchinhanh')" >
              <template #body="{data}">
                {{ data.name }}
              </template>
            </Column>

            <Column :header="$t('diachi')" >
              <template #body="{data}">
                {{ data.address }}
              </template>
            </Column>


            <Column :header="$t('phanloai')" >
              <template #body="{data}">
                {{ chinhanh(data.is_main) }}
              </template>
            </Column>

            <Column :header="$t('trangthai')" style="width: 120px">
              <template #body="{data}">
                <div v-if="data.status == 1"><span class="badge border border-success  text-success">{{$t('khadung')}}</span></div>
                <div v-if="data.status == 0"><span class="badge border border-danger  text-danger">{{$t('khongkhadung')}}</span></div>
              </template>
            </Column>
            <Column :header="$t('ngaytao')" >
              <template #body="{data}">
                {{ dateFormat(data.created_at) }}
              </template>
            </Column>

            <Column  style="width: 30px">
              <template #body="{data}">
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item"  @click="addBranchModal(data)" href="#">{{  $t('capnhat')}} </a></li>
                    <li><a class="dropdown-item" @click="deleteBranch(item)">{{$t('xoa') }}</a></li>
                  </ul>
                </div>
              </template>
            </Column>
          </DataTable>
          <BPagination  v-model="currentPage" :total-rows="pagingate.last_page" :per-page="1"  />
        </BCard>
      </BCol>
    </BRow>

  </Layout>
</template>