
<script>
import HistoryUpdate from '../../../components/ui/HistoryUpdate.vue'
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import staticPostService from "@/services/staticPost.service";
import uploadPhotoService from "@/services/uploadPhoto.service";
import EditAboutCompany from"@/views/company/components/editAboutCompany.vue";
import {ModalSize} from "vue-bs-modal";
import {ref} from "vue";
import {useRoute} from "vue-router";
import TableFile from '@/views/company/components/tableFile.vue';

export default {
  name: "StaticCompany",
  components: {
    Layout,
    PageHeader,
    TableFile,
    HistoryUpdate, 
  },
  data() {
    return {
      title:this.$route.query.title || 'Default Title',
      data: {
        id:'',
        name: this.$route.query.title || 'Default Title',
        content:'',
        type: ref(this.$route.params.type),
      },
      dataFiles: ref([]),
      conditions : {
        type: '',
      },
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      user: ref(null),
      id_post:null,
    };
  },
  watch:{
    '$route.query.title':{
      handler(newTitle) {
        this.title = newTitle;
      },
      immediate: true
    },
    '$route.params.type':{
      handler(newType,OldType) {
        if (OldType!=undefined && newType != OldType) {
          this.data.type = newType;
          this.data.name = this.$route.query.title;
          this.id_post =null;
          this.getData(newType);
          this.getDataFiles(newType);
        }
      },
      immediate: true
    }
  },
  setup() {
    const route = useRoute();
    const currentPage = ref(parseInt(route.query.page) || 1);
    return { currentPage };
  },
  mounted() {
    this.getData(this.data.type);
    this.getDataFiles(this.data.type);
  },
  methods: {
    addEditAboutCompanyModal() {
      this
          .$vbsModal
          .open({
            content: EditAboutCompany,
            size: ModalSize.XLARGE,
            contentProps: {
              title: this.$t("capnhat") + ' ' + this.title,
              item: this.data,
              array_files:this.dataFiles,
            },
            contentEmits: {
              closeModal: () => {
                this.getDataFiles(this.data.type);
              },
              onUpdate: () => {
                this.id_post =null;
                this.getData(this.data.type);
                this.getDataFiles(this.data.type);
              }
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });
    },
    async getData(type) {
      try {
        const response = await staticPostService.getItem(type);
        if(response.data.data){
          this.data = response.data.data;
          this.id_post = response.data.data.id;
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    },
    async getDataFiles(type){
      this.conditions.type=type;
      try {
        const response = await uploadPhotoService.getAll(this.conditions);
        if(response.data.data){
          this.dataFiles = response.data.data;
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    },
  },
};
</script>
<template>
  <Layout>
    <PageHeader :title="`Quản lý ${this.$route.query.title}`" pageTitle="Dashboard" />
    <BContainer>
      <BRow>
        <BCol>
          <BCard>
            <div class="align-items-center d-flex px-0  pb-2 pt-0">
              <button class="btn btn-sm btn-success h-40 font-size-14" @click="addEditAboutCompanyModal">
                  <i class="ri-file-edit-line me-1 align-bottom"></i>
                  {{$t('capnhat')}} {{$t('noidung')}} - {{$t('file')}}
              </button>
            </div>
            <BRow>
              <BCol cols="12" lg="8" md="12" sm="12">
                <div class="mb-3">
                  <div class="modal-header p-2 bg-success-subtle mb-2">
                    <h5 class="modal-title">{{ $t('noidung') }}</h5>
                  </div>
                  <div v-if="data.content" class="content-about-company" >
                    <p v-html="data.content"></p>
                  </div>
                    <div class="" v-else>
                    {{$t('dangcapnhat')}}
                  </div>
                </div>
              </BCol>
              <BCol cols="4" lg="4"  md="12"  sm="12">
                <div class="modal-header p-2 bg-success-subtle mb-2">
                  <h5 class="modal-title">{{ $t('file') }}</h5>
                </div>
                <TableFile v-if="this.dataFiles.length>0" :data="this.dataFiles" />
              </BCol>
            </BRow>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
    <HistoryUpdate  v-if="this.id_post" :id_post="this.id_post"/>
  </Layout>
</template>