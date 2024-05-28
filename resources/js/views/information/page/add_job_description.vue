
<script>
import HistoryUpdate from '../../../components/ui/HistoryUpdate.vue'
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import staticPostService from "@/services/staticPost.service";
import uploadPhotoService from "@/services/uploadPhoto.service";
import {ref} from "vue";
import {useRoute} from "vue-router";
import TableFile from '@/views/company/components/tableFile.vue';

import Editor from "@/components/ui/editor";
import UploadFile from '../../../components/ui/uploadFile.vue'
export default {
  name: "StaticCompany",
  components: {
    Layout,
    PageHeader,
    TableFile,
    
    Editor,
    UploadFile,
    HistoryUpdate ,
  },
  data() {
    return {
      data: {
        id:'',
        name: 'Mô tả công việc',
        content:'',
        type: 'job-description-' + this.$route.params.id,
        id_user:'',
      },
      dataFiles: ref([]),
      conditions : {
        type: '',
      },
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      user: ref(null),
      uploadedFiles: [],
      dataLoaded: false,
    };
  },
  setup() {
    const route = useRoute();
    const currentPage = ref(parseInt(route.query.page) || 1);
    return { currentPage };
  },
  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    this.getData(this.data.type);
    this.getDataFiles(this.data.type);
  },
  methods: {
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
      this.dataLoaded=true;
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
    handleDestroyed(){
      this.getDataFiles(this.data.type);
    },
    handleFileUploaded(files) {
      this.uploadedFiles = files; // Lưu danh sách tệp tin đã tải lên từ component con
    }, 
    async updateOrCreateStaticPost() {
      try {
        let _this = this;

        _this.errors_msg = [];
        if (!_this.isLoading) {
          _this.isLoading = true;
        }

        if (_this.errors_msg.length > 0) {
          _this.isLoading = false;
          return;
        }

        _this.data.name = this.data.name;
        _this.data.content = this.data.content;
        _this.data.type = this.data.type;
        _this.data.id_user = this.user.user.user.id;
        
        // xu lí files
        const fileDataArray = [];
        // Convert files to base64
        if (this.uploadedFiles.length>0) {
          for (const file of this.uploadedFiles) {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              await new Promise(resolve => {
                  reader.onload = () => {
                      fileDataArray.push({
                          name: file.name,
                          type: file.type,
                          size: file.size,
                          base64: reader.result.split(',')[1] // Extract base64 data
                      });
                      resolve();
                  };
              });
          }
        }
        
        const rs = await staticPostService.updateOrCreate(_this.data);
        if (rs.data.status == false) {
          this.errors_msg.push(rs.data.data);
        } else {
          if(fileDataArray.length>0){
            const postId = rs.data.data.id;
            const postType = rs.data.data.type;
            const payload = {
              fileDataArray,
              type_upload: postType,
              id_post: postId,
              id_user: this.user.user.user.id,
            };
            const response = await uploadPhotoService.updateFile(payload);
            if (response.data.success == false) {
              this.errors_msg.push(this.$t("themfilekhongthanhcong"));
            } else {
              this.success_msg = this.$t("capnhatthanhcong");
            }
          }else{
            this.success_msg = this.$t("capnhatthanhcong");
          }
        }
        setTimeout(() => {
          this.success_msg='';
          this.$router.push('/staff/list');
        }, 1500);
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<template>
  <Layout>
    <PageHeader title="Quản lý mô tả công việc" pageTitle="Dashboard" />
    <BContainer>
      <BCard >
        <p v-if="errors_msg.length" class="alert alert-danger">
          <b>Please correct the following error(s):</b>
          <ul class="mb-0">
            <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
          </ul>
        </p>
        <p v-if="success_msg!=''" class="alert alert-success">
          {{success_msg}}
        </p>
        <form @submit.prevent="updateOrCreateStaticPost" >
          <label class="form-label" for="project-title-input">{{ $t('mota-congviec') }}</label>
          <div class="" v-if="dataLoaded">
            <Editor v-model="data.content" class="me-2" />
          </div>
          <label class="form-label" for="project-title-input">{{ $t('tepdinhkem') }}</label>
          <TableFile v-if="dataFiles.length>0" :data="dataFiles" :funcDel="true" @destroyed="handleDestroyed"/>
          <UploadFile @fileUploaded="handleFileUploaded"/>
          <div class="modal-footer mt-3">
            <router-link :to="{'name':'staff.list'}" class="mx-2 btn btn-outline-primary">
              <i class="ri-reply-line"></i> {{$t('thoat')}} 
            </router-link>
            <BButton :loading="isLoading" type="submit" class="btn btn-success mr-2"> {{$t('capnhat')}}</BButton>
          </div>
        </form>
      </BCard>
    </BContainer>
    <HistoryUpdate v-if="this.data.id" :id_post="this.data.id"/>
  </Layout>
</template>