<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {ModalSize} from "vue-bs-modal";
import AddEditPhoto from "@/views/media-upload/photo/components/AddEditPhoto.vue";
import uploadPhotoService from "@/services/uploadPhoto.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Carousel from 'primevue/carousel';
export default {
  props:{
    headerTitle: String,
    pageTitle: String,
    Carousel
  },
  components: {
    Layout,
    PageHeader,
    DataTable,
    Column,
  },
  
  data() {
    return {
      unitCode: 1,
      data: ref([]),
      pagingate:ref({}),
      modalShow: false,
      loadSuccess:false,
      titleFormGroup: this.$t('t-themmoidanhmuc'),
      conditions : {
        type: 'banner-login'
      },
    };
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
  setup() {
    const route = useRoute();
    const currentPage = ref(parseInt(route.query.page) || 1);
    return { currentPage };
  },
  created(){
    
  },
  mounted() {
    this.getData(this.currentPage,this.conditions);
  },
  beforeUpdate(){
    
  },
  updated(){
  },
  methods: {
    getData(page,conditions){
        uploadPhotoService.getList(page,conditions).then((response)=>{
        this.data = response.data.data.data;
        this.pagingate = response.data.data;
        this.currentPage = this.pagingate.current_page;
      })
    },
    addInfoModal(data) {
      this
          .$vbsModal
          .open({
            content: AddEditPhoto,
            size: ModalSize.MEDIUM,
            contentProps: {
              title: this.$t("themmoi") +' '+ this.$t("media.banner_login"),
              props_type_upload:this.conditions.type,
              item:data,
            },
            contentEmits: {
              onUpdate: ()=>this.getData(this.pagingate.current_page,this.conditions)
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });
    },
    async pauseItem(data){
        const newdata=data;
        newdata.status=!data.status;
        delete newdata.service_policy;
        uploadPhotoService.pause(newdata).then(()=>{
          this.getData(this.pagingate.current_page,this.conditions)
        })
    },
    async deleteItem(id){
        uploadPhotoService.destroy(id).then(()=>{
            this.getData(this.pagingate.current_page,this.conditions)
        })
    },
  }
};
</script>
<template>
  <Layout>
    <PageHeader title="Quản lý banner login" pageTitle="Dashboard" />
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
            <BCardTitle class="m-0">{{ $t('danhsach') }}</BCardTitle>
            <div class="flex-shrink-0">
              <button class="btn btn-sm btn-success" @click="addInfoModal">>
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
            }" :key="unitCode" 
            bodyStyle="text-align:center"
            style="vertical-align: middle"
            class="align-middle"
            >
            <template #header >

            </template>
            <Column :header="$t('stt')" style="width: 50px" class="align-middle">
              <template #body="{index}">
                {{ index+1 }}
              </template>
            </Column>

            <Column :header="$t('media.name_photo')" style="" class="align-middle">
              <template #body="{data}">
                {{ data.name }}
              </template>
            </Column>
            <Column :header="$t('media.photo')" style="" class="align-middle">
              <template #body="{data}">
                <div v-if="data.name_file" >
                  <img :src="this.imageLink(data.type_upload+'/'+data.name_file)" alt="Preview" style="max-width: 100%; max-height: 50px;">
                </div>
              </template>
            </Column>
            <Column :header="$t('media.link')" class="align-middle">
              <template #body="{data}">
                {{ data.link }}
              </template>
            </Column>
            <Column :header="$t('trangthai')"  class="align-middle">
              <template #body="{data}" >
                <div @click="pauseItem(data)">
                  <div v-if="data.status == 1"><span class="badge border border-success background-success text-success">{{$t('hoatdong')}}</span></div>
                  <div v-if="data.status == 0"><span class="badge border border-danger  text-danger">{{$t('tamdung')}}</span></div>
                </div>
              </template>
            </Column>
            <Column  bodyStyle="text-align:right" style="width: 30px;" class="align-middle">
              <template #body="{data}">
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item" @click="addInfoModal(data)" href="#">{{$t('capnhat')}}</a></li>
                    <li><a class="dropdown-item" @click="deleteItem(data.id)">{{$t('xoa')}}</a></li>
                  </ul>
                </div>
              </template>
            </Column>
          </DataTable>
          <BPagination v-model="currentPage" :total-rows="pagingate.last_page" :per-page="1"  />
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>