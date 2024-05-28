<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Skeleton from 'primevue/skeleton';
import {ref,reactive} from "vue";
import {ModalSize} from "vue-bs-modal";
import JobPositionService from "@/services/jobposition.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AddEditJobPositionModal from "@/views/settings/organizations/components/AddEditJobPositionModal.vue";



export default {
  props:{
    headerTitle: String,
    pageTitle: String,   

  },
  components: {
    Layout,
    PageHeader,
    DataTable,
    Column,
    Skeleton
  },
  

  data() {
    return {
      //currentPage : ref(this.$route.query.page),
      filter:{
        keyword:this.keyword
      },
      data: reactive(new Array(4)),
      totalRecords:ref(0),
      pagingate:ref({}),
      modalShow: false,
      loading:true,
      titleFormGroup: this.$t('t-themmoidanhmuc'),
      service: JobPositionService,
      perPageList:[10, 20, 50],
      dataTableObject:null
    };
  },
  created(){
   
  },
  mounted() { 
    this.$store.commit('layout/SET_MENU','settings');
    this.getData();
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
        this.pagingate = response.data.data;
        this.loading = false;
      })
    },
    addModal(data) {
      this
          .$vbsModal
          .open({

            content: AddEditJobPositionModal,
            size: ModalSize.MEDIUM,
            contentProps: {
              title: data!=null ? this.$t("jobposition.form.update-title"):this.$t("jobposition.form.add-title"),
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
    async deleteItem(id){
        this.$root.showConfirm({
                title:this.$t('confirm.title.delete'),
                content:this.$t('confirm.confirm_delete'),
                accept:()=>{
                     this.service.Destroy(id).then((rs) => {                        
                        if(rs.data.success==true){
                            if(rs.data.data.status==false){
                                this.$root.alert(this.$t('errors.delete_role_before',{a:rs.data.data.message}));
                            }else{
                                this.getData(this.pagingate.current_page)
                                this.$root.showToast(this.$t('messege.delete_success'));
                            }
                        }else{
                            this.$root.showToast(this.$t('errors.delete_fail'),{type:"error"});
                        }
                        
                     })
                }
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
    <PageHeader :title="$t(`jobposition.main-title`)" pageTitle="Dashboard" />
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
            <BCardTitle class="m-0">

                    <BForm @submit="onSearch">
                      <div class="d-flex justify-content-center align-item-center">
                        <div class="wrap-search-form">
                        <BFormInput v-model="keywordValue"  :placeholder="$t('search')" />
                        <BButton type="submit"><i class="ri-search-line"></i></BButton>
                        </div>
                      </div>       
                    </BForm>
            </BCardTitle>
            <div class="flex-shrink-0">
              <button class="btn btn-sm btn-success" @click="addModal">
                <i
                    class="ri-add-fill me-1 align-bottom"
                    data-toggle="tooltip"
                    title=""
                    data-bs-original-title="Thêm mới"
                    aria-label="Thêm mới"></i>
               {{$t('themmoi')}}
              </button>
            </div>
          </BCardHeader>
          <!-- /* headerClass="has-resize" :resizableColumns="true"  -->
          <DataTable :value="data" :totalRecords="totalRecords" lazy @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" :pt="{table: 'table',thead: 'table-light'}"   paginator :first="fistPageValue" :rows="perPageValue" :rowsPerPageOptions="perPageList"  >
            <template #empty>{{$t('search_no_record')}} </template>
            <Column :header="$t('stt')" style="width: 50px">
              <template #body="{index,}" v-if="!loading">
              {{ stt(index,this.pageValue,this.perPageValue) }}
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('jobposition.form.name')" sortable field="name">
              <template #body="{data}" v-if="!loading">
                {{ data.name }}
                
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('jobposition.form.code')" sortable field="code" style="width: 150px">
              <template #body="{data}" v-if="!loading">
                {{ data.code }}
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('trangthai')" sortable field="status" style="width: 120px">
              <template #body="{data}" v-if="!loading">
                <div v-if="data.status == 1"><span class="badge border border-success  text-success">{{$t('khadung')}}</span></div>
                <div v-if="data.status == 0"><span class="badge border border-danger  text-danger">{{$t('khongkhadung')}}</span></div>
                
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>
            <Column :header="$t('ngaytao')" sortable field="created_at"  style="width: 150px">
              <template #body="{data}" v-if="!loading">
                {{ dateFormat(data.created_at) }}
                
              </template>
              <template v-else #body>
                  <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column  style="width: 30px">
              <template #body="{data}" v-if="!loading">
                <div class="list-tools">
                      <a class="edit" @click.prevent="addModal(data)" href="#"><i class="ri-edit-box-line"></i></a>
                      <a class="delete" @click.prevent="deleteItem(data.id)" href="#"><i class="ri-delete-bin-line"></i></a>
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