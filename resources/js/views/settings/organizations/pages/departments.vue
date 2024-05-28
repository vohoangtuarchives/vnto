<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import {ref,reactive} from "vue";

import {ModalSize} from "vue-bs-modal";
import Skeleton from 'primevue/skeleton';
import DepartmentService from "@/services/department.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AddEditDepartmentModal from "@/views/settings/organizations/components/AddEditDepartmentModal.vue";



export default {
  props:{
    headerTitle: String,
    pageTitle: String
  },
  components: {
    Layout,
    PageHeader,
    DataTable,
    Column,
    Skeleton
  },

  computed:{
    filterValue(){
        return this.filter;
    },
    perPageValue() {
      return parseInt(this.$route.query.perpage || 10)
    },
    pageValue(){
      return parseInt(this.$route.query.page || 1)
    },
    fistPageValue(){
      return (this.pageValue-1)*this.perPageValue;

    },
    sortValue(){
     
      return (this.$route.query.sort ||'')
    },
    keywordValue:{
      set(value){
          this.filter.keyword = value
      },
      get(){
        return (this.$route.query.keyword ||'')
      }
    }
  },
  data() {
    return {
      filter:{
        keyword:this.keywordValue
      },
      data: reactive(new Array(4)),
      totalRecords:ref(0),

      modalShow: false,
      loading:true,
      
      titleFormGroup: this.$t('t-themmoidanhmuc'),
      service: DepartmentService,
      perPageList:[10, 20, 50],
    };
  },

  mounted() {
    this.$store.commit('layout/SET_MENU','settings');
    this.getData();
  },
  methods: {
    onSearch(){
      this.getData({
        page: 1,
        keyword: this.filter.keyword,
      });
    },
    onPage(e){
      if(e.page+1!=this.pageValue ||  this.perPageValue != e.rows){
        this.currentPage = e.page+1;
        this.getData({page:this.currentPage,perpage:e.rows});
      } 
    },
    onSort(e) {
      this.getData({
        sort: e.sortField + ":" + (e.sortOrder === 1 ? 'asc' : 'desc'),
        page: 1,
        perpage: this.perPageValue,
        
      });
    },
    getData(data){
      const requestData = {
        page: this.pageValue,
        perpage: this.perPageValue,
        sort: this.sortValue,
        keyword:this.keywordValue,
        ...data
      };
      if(this.perPageList.indexOf(requestData.perpage) === -1){
          requestData.perpage = this.perPageList[0];
      }
    
   
      this.changeParams(this.$router,requestData);
    
      this.loading = true;
      this.service.getList(requestData).then((response)=>{
        this.totalRecords = response.data.data.total;
        this.data = response.data.data.data;

        this.currentPage = response.data.data.current_page;
        this.loading = false;
        console.error("get ok x",this.data);
      })
    },
    addModal(data) {
      this
          .$vbsModal
          .open({

            content: AddEditDepartmentModal,
            size: ModalSize.MEDIUM,
            contentProps: {
              title: this.$t("department.form.add-title"),
              item:data,
            },
            // pass event listeners to the EditProfileComponent.
            contentEmits: {
              onUpdate: ()=> this.getData(this.pagingate.current_page)
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });

    },
    async deleteBranch(id){
        this.service.destroy(id).then(()=>{
            this.getData(this.pagingate.current_page)
        })
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
    <PageHeader :title="$t(`department.main-title`)" pageTitle="Dashboard" />
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
            <BForm @submit="onSearch">
                      <div class="d-flex justify-content-center align-item-center">
                        <div class="wrap-search-form">
                        <BFormInput v-model="keywordValue"  :placeholder="$t('search')" />
                        <BButton type="submit"><i class="ri-search-line"></i></BButton>
                        </div>
                      </div>       
                    </BForm>
            <div class="flex-shrink-0">
              <button v-if="can('departments.create')" class="btn btn-sm btn-success" @click="addModal">
                <i
                    class="ri-add-fill me-1 align-bottom"
                    data-toggle="tooltip"
                    title=""
                    :data-bs-original-title="$t('themmoi')"
                    :aria-label="$t('themmoi')"></i>
                {{$t('themmoi')}}
              </button>
            </div>
          </BCardHeader>
          <DataTable :value="data" :totalRecords="totalRecords" lazy @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" :pt="{table: 'table',thead: 'table-light'}"   paginator :first="fistPageValue" :rows="perPageValue" :rowsPerPageOptions="perPageList" >
            <template #empty>{{$t('search_no_record')}} </template>
            <Column :header="$t('stt')" style="width: 50px">
              <template #body="{index,}" v-if="!loading">
              {{ stt(index,this.pageValue,this.perPageValue) }}
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>


            <Column :header="$t('department.form.name')" sortable field="name">
              <template #body="{data}" v-if="!loading" >
                {{ data.name }}
              </template>
            </Column>

            <Column :header="$t('department.form.code')" sortable field="code">
              <template #body="{data}" v-if="!loading" >
                {{ data.code }}
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('trangthai')" style="width: 120px" sortable field="status">
              <template #body="{data}" v-if="!loading">
                <div v-if="data.status == 1"><span class="badge border border-success  text-success">{{$t('khadung')}}</span></div>
                <div v-if="data.status == 0"><span class="badge border border-danger  text-danger">{{$t('khongkhadung')}}</span></div>
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>
            <Column :header="$t('ngaytao')" sortable field="create_at">
              <template #body="{data}" v-if="!loading">
                {{ dateFormat(data.created_at) }}
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column  style="width: 30px">
              <template #body="{data}" v-if="!loading">
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item"  @click="addModal(data)" href="#">{{  $t('capnhat')}} </a></li>
                    <li><a class="dropdown-item" @click="deleteBranch(data.id)">{{$t('xoa') }}</a></li>
                  </ul>
                </div>
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>
          </DataTable>
   
        </BCard>
      </BCol>
    </BRow>

  </Layout>
</template>