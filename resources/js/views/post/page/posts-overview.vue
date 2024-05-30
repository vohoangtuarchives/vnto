<script>
import TableFile from '../../../components/ui/tableFile.vue'
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import {ref} from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PostService from "@/services/post.service";
import Tag from 'primevue/tag';
import {ModalSize} from "vue-bs-modal";
import historyUpdateModalVue from '../../../components/ui/historyUpdateModal.vue';
export default {
  components: {
    Layout,
    PageHeader,
    TableFile,
    Tag,
  },
  data() {
    return {
      title : this.$route.query.title || 'Default Title',
      typePost : ref(this.$route.params.type),
      idPost : ref(this.$route.params.id),
      data: {
        id:'',
        name:'',
        content:'',
        photo:'',
        type: '',
        id_user: '',
        status:false,
      },
      dataPhoto: {
        id:'',
        name:'',
        type_upload: '',
        file: null,
        previewUrl: null,
        status:false,
      },
      previewUrl: null,
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      conditions : {},
      dataFiles:ref([]),
    };
  },
  setup() {
    return { 
      v$: useVuelidate() }
  },
  validations () {
    return {
      data:{
        name: {
          required:helpers.withMessage(this.$t('post.errors.name_notEmpty'), required)
        }
      }
    }
  },
  created(){

  },
  mounted() {
    this.getData(this.idPost);
  },
  beforeUpdate(){
    
  },
  updated(){
  },
  methods: {
    async getData(id) {
      try {
        const response = await PostService.getItem(id);
        if(response.data.data){
          this.data = response.data.data;
          this.previewUrl= this.imageLink(this.typePost+'/'+response.data.data.photo);
          this.data.status=Boolean(response.data.data.status);
          this.getDataFiles(this.typePost);
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    },
    async getDataFiles(type){
      this.conditions.type=type;
      this.conditions.id_post=this.data.id;
      try {
        const response = await PostService.getAllFile(this.conditions);
        if(response.data.data){
          this.dataFiles = response.data.data;
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    },
    historyUpdateModal() {
      this
          .$vbsModal
          .open({
            content: historyUpdateModalVue,
            size: ModalSize.MEDIUM,
            contentProps: {
              title: this.$t("history-update"),
              id_post:this.idPost,
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });
    },
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="`${$t('quanly')} ${this.title}`" pageTitle="Dashboard" />
    <BRow>
      <BCol lg="12">
          <BCard no-body class="">
              <div class="bg-warning-subtle">
                  <BCardBody class="pb-0 px-4">
                      <BRow class="mb-3 align-items-center">
                          <BCol cols="12" lg="7" md="12" sm="12">
                              <BRow class="align-items-center g-3">
                                  <BCol md="auto" class="subtle-avt-name flex-mb  flex-wrap justify-content-between align-items-center">
                                      <div class="avatar-md">
                                          <div class="avatar-title bg-white rounded-circle">
                                              <img v-if="data.photo" :src="previewUrl" :alt="this.data.name" class="avatar-xs">
                                              <img v-else src="@/assets/images/noimage.png" alt="" class="avatar-xs">
                                          </div>
                                      </div>
                                  </BCol>
                                  <BCol md class="subtle-name  flex-mb">
                                      <div>
                                          <h4 class="fw-bold">{{this.data.name}}</h4>
                                          <div class="hstack gap-3 flex-wrap">
                                              <div>
                                                <i class="ri-user-add-line"></i>{{ this.data.user ? this.data.user.name :'' }}
                                              </div>
                                              <div class="vr"></div>
                                              <div>{{$t('ngaytao')}} : <span class="fw-medium">{{ dateFormat(data.created_at) }}</span></div>
                                              <div class="vr"></div>
                                              <div>{{$t('ngaycapnhat')}} : <span class="fw-medium">{{ dateFormat(data.updated_at) }}</span></div>
                                              <div class="vr"></div>
                                              <Tag v-if="data.status == 1" severity="success" :value="$t('hoatdong')"></Tag>
                                              <Tag v-if="data.status == 0" severity="danger" :value="$t('tamdung')"></Tag>
                                          </div>
                                      </div>
                                      <div class="dropdown d-block d-sm-none">
                                        <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                          <i class="ri-more-2-fill"></i>
                                        </a>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                          <li>
                                            <router-link :to="`/posts/edit/${this.typePost}/${data.id}`" class="btn btn-md btn-secondary btn btn-success">
                                              <i class="ri-file-edit-fill"></i> {{$t('capnhatthongtin')}}
                                            </router-link>
                                          </li>
                                          <li>
                                            <button class="dropdown-item mx-2 btn btn-success btn-md " @click="historyUpdateModal">
                                              <i class="ri-chat-history-line"></i>
                                              {{$t('history-update')}}
                                            </button>
                                          </li>
                                          <li>
                                            <router-link :to="`/posts/man/${this.typePost}`" class="dropdown-item mx-2 btn btn-outline-primary">
                                            <i class="ri-reply-line"></i> {{$t('thoat')}} 
                                          </router-link>
                                          </li>
                                        </ul>
                                      </div>
                                  </BCol>
                              </BRow>
                          </BCol>
                          <BCol cols="12" lg="5" md="12" sm="12" class="d-none d-sm-block">
                              <div class="hstack gap-1 flex-wrap justify-content-end">
                                <router-link :to="{ name: 'posts.man', params: { type: this.typePost }, query: { title: this.title } }" class="mx-2 btn btn-outline-primary">
                                  <i class="ri-reply-line"></i> {{$t('thoat')}} 
                                </router-link>
                                <router-link :to="{ name: 'posts.edit', params: { type: this.typePost,id: this.idPost}, query: { title: this.title } }" class="btn btn-md btn-secondary btn btn-success">
                                  <i class="ri-file-edit-fill"></i> {{$t('capnhatthongtin')}}
                                </router-link>
                                <button class="btn btn-success btn-md " @click="historyUpdateModal">
                                  <i class="pi pi-user-edit"></i>
                                  {{$t('history-update')}}
                                </button>
                              </div>
                          </BCol>
                      </BRow>
                  </BCardBody>
              </div>
          </BCard>
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="12" lg="8" md="12" sm="12">
        <BCard no-body>
          <BCardHeader class="align-items-center d-flex py-0">
            <BCardTitle class="mb-0 flex-grow-1 py-3">{{$t('post.content')}}</BCardTitle>
          </BCardHeader>
          <BCardBody>
            <div v-if="data.content" class="content-about-company" >
              <p v-html="data.content"></p>
            </div>
              <div class="" v-else>
              {{$t('dangcapnhat')}}
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol cols="12" lg="4"  md="12"  sm="12">
        <BCard no-body>
          <BCardHeader class="align-items-center d-flex border-bottom-dashed">
              <BCardTitle class="mb-0 flex-grow-1">{{$t('file_uploaded')}}</BCardTitle>
          </BCardHeader>
          <TableFile v-if="dataFiles" :dataFiles="dataFiles" :typePost="this.typePost" />
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>