
<script>
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
  },
  data() {
    return {
      data: {
        id:'',
        name: 'Mô tả công việc',
        content:'',
        type: 'job-description-'+this.$route.params.id,
      },
      dataFiles: ref([]),
      conditions : {
        type: '',
      },
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      id_post:null,
    };
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
              title: this.$t("capnhat"),
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
    <PageHeader title="Quản lý mô tả công việc" pageTitle="Dashboard" />
    <BContainer>
      <BRow>
        <BCol>
          <BCard>
            <BRow>
              <BCol cols="12" lg="8" md="12" sm="12">
                <div class="mb-3">
                  <div class="modal-header p-2 bg-success-subtle mb-2">
                    <h5 class="modal-title">{{ $t('mota') }}</h5>
                  </div>
                  <div v-if="data.content" class="content-about-company" >
                    <p v-html="data.content"></p>
                  </div>
                    <div class="py-2" v-else>
                    {{$t('dangcapnhat')}}
                  </div>
                </div>
              </BCol>
              <BCol cols="12" lg="4"  md="12"  sm="12">
                <div class="modal-header p-2 bg-success-subtle mb-2">
                  <h5 class="modal-title">{{ $t('file') }}</h5>
                </div>
                <TableFile :data="dataFiles" />
              </BCol>
            </BRow>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </Layout>
</template>