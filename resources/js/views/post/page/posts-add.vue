<script>
import TableFile from '../../../components/ui/tableFile.vue'
import UploadFile from '../../../components/ui/uploadFile.vue'
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import {ref} from "vue";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import Editor from "@/components/ui/editor";
import PostService from "@/services/post.service";
import InputSwitch from 'primevue/inputswitch';
import uploadPhotoService from "@/services/uploadPhoto.service";
export default {
  components: {
    Layout,
    PageHeader,
    Editor,
    InputSwitch,
    UploadFile, 
    TableFile , 
  },
  data() {
    return {
      title : this.$route.query.title || 'Default Title',
      typePost : ref(this.$route.params.type),
      idItem : ref(this.$route.params.id),
      data: {
        id:'',
        name:'',
        content:'',
        type: '',
        status:false,
        show_on_news:false,
        id_user:'',
        file:'',
      },
      file: null,
      previewUrl: null,
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      uploadedFiles: [],
      conditions : {},
      dataFiles:ref([]),
      imageExtensions :['jpg', 'jpeg', 'png', 'gif'],
      fileExtensions :['jpg', 'jpeg', 'png', 'gif'],
      dataLoaded: false,
      user : ref(null),
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
  mounted() {
    this.getData(this.idItem);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    async getData(id) {
      try {
        const response = await PostService.getItem(id);
        if(response.data.data){
          this.data = response.data.data;
          this.data.content = response.data.data.content;
          this.previewUrl= this.imageLink(this.typePost+'/'+response.data.data.photo);
          this.data.status=Boolean(response.data.data.status);
          this.getDataFiles(this.typePost);
        }
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      }
       this.dataLoaded=true;
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
        console.error(this.$t('xayraloi'), error);
      }
    },
    async deleteItem(id){
      if(confirm(this.$t('bancochacmuonxoafile'))) {
        PostService.destroyFile(id).then(()=>{
          this.getDataFiles(this.typePost)
        })
      }
    },
    async validateForm() {
      const result = await this.v$.$validate();
      if (!result) {
        return this.v$.$errors.map(error => error.$message);
      }
      return [];
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      this.data.file = event.target.files[0];
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      }
      const reader = new FileReader();
      reader.readAsDataURL(this.data.file);
      reader.onload = async () => {
        const base64Image = await reader.result.split(",")[1];
        this.data.file = base64Image;
      }
    },    
    handleFileUploaded(files) {
      this.uploadedFiles = files; // Lưu danh sách tệp tin đã tải lên từ component con
    }, 
    async createOrUpdatePost() {
      try {
        let _this = this;
        _this.errors_msg = [];
        if(!_this.isLoading) {
          _this.isLoading = true;
        }
        _this.errors_msg = await this.validateForm();
        if (_this.errors_msg.length > 0) {
          _this.isLoading = false;
          return;
        }
        _this.data.name = this.data.name;
        _this.data.content = this.data.content;
        _this.data.type = this.typePost;
        _this.data.status = this.data.status;
        _this.data.show_on_news = this.data.show_on_news;
        _this.data.file = this.data.file;
        _this.data.id_user = this.user.user.user.id;
        // xu lí files
        const fileDataArray = [];
        // Convert files to base64
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
        const rs = await PostService.updateOrCreate(_this.data);
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
            const response = await uploadPhotoService.uploadMultiPost(payload);
            if (response.data.success == false) {
              this.errors_msg.push(this.$t("themfilekhongthanhcong"));
              setTimeout(() => {
                  this.errors_msg=[];
              }, 1500);
            }
          }else{
            if (!this.id) {
              this.success_msg = this.$t("themoithanhcong");
            } else {
              this.success_msg = this.$t("capnhatthanhcong");
            }
            setTimeout(() => {
                this.success_msg='';
            }, 1500);
          }

          setTimeout(() => {
            this.success_msg='';
            this.$router.push('/posts/man/'+this.typePost);
          }, 1500);
        }
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      } finally {
        this.isLoading = false;
      }
    },
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="`${ this.idItem?$t('capnhat'):$t('themmoi')} ${this.title}`" pageTitle="Dashboard" />
    <form @submit.prevent="createOrUpdatePost" >
      <BRow>
        <BCol cols="12" lg="8" md="12" sm="12">
          <BCard >
            <p v-if="errors_msg.length" class="alert alert-danger">
            <b>{{$t('please-correct-lollowing-errors')}}:</b>
            <ul class="mb-0">
              <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
            </ul>
          </p>
          <p v-if="success_msg!=''" class="alert alert-success">
            {{success_msg}}
          </p>
            <div class="mb-3">
              <label class="form-label" for="project-title-input">{{$t('post.name')}}</label>
              <input type="text" v-model="data.name" class="form-control" id="project-title-input" :placeholder="$t('post.enter-name')" />
            </div>
            <div class="mb-3">
              <label class="form-label">{{$t('post.content')}}</label>
              <Editor v-if="dataLoaded" v-model="data.content" height="800" class="me-2" />
            </div>
          </BCard>
        </BCol>
        <BCol cols="12" lg="4" md="12" sm="12">
          <BCard >
            <div class=" mb-3">
              <div class="d-flex align-items-center">
                <InputSwitch v-model="data.status" class="me-2"/>
                <label class="mb-0">{{ $t('trangthai') }}: {{data.status==1?$t('hoatdong'):$t('tamdung')}}</label> 
              </div>
            </div>
            <div class=" mb-3">
              <div class="d-flex align-items-center">
                <InputSwitch v-model="data.show_on_news" class="me-2"/>
                <label class="mb-0">{{$t('post-news')}}</label>
              </div>
            </div>
            <div class=" mb-3">
              <div class="d-flex align-items-center">
                <label class="form-label my-0 mr-2" for="project-title-input">{{$t('anhdaidien')}}</label>
                <div class="d-flex align-items-center">
                  <button type="button" @click="openFileInput" class="border-0 rounded-pill text-white p-2 px-4 bg-success">
                    <i class="ri-file-image-line"></i>
                    {{ $t('chonanh') }}
                  </button>
                </div>
              </div>
              <input type="file" ref="fileInput" name="image" id="image" accept="image/*" @change="handleFileChange" style="display: none">
              <div v-show="previewUrl" class="mt-2">
                <img v-if="data.photo" :src="previewUrl" alt="Preview" style="max-width: 100%; max-height: 200px;">
              </div>
            </div>
            <h5 class="card-title  mb-2 py-3">{{$t('tepdinhkem')}}</h5>
            <UploadFile @fileUploaded="handleFileUploaded"/>
            <div v-if="dataFiles.length" class="file_uploaded">
              <BCardHeader class="align-items-center d-flex border-bottom-dashed">
                  <BCardTitle class="mb-0 flex-grow-1">{{$t('file_uploaded')}}</BCardTitle>
              </BCardHeader>
              <TableFile :dataFiles="dataFiles" :typePost="this.typePost" :funcDel="deleteItem"/>
            </div>
          </BCard>
        </BCol>
      </BRow>
      <div class=" mb-4">
        <router-link :to="{ name: 'posts.man', params: { type: this.typePost }, query: { title: this.title } }" class="mx-2 btn btn-outline-primary">
          <i class="ri-reply-line"></i> {{$t('thoat')}}
        </router-link>
        <BButton :loading="isLoading" type="submit" class="btn btn-success"><i class="ri-upload-cloud-line"></i> {{this.data.id?$t('capnhat'):$t('them')}}</BButton>
      </div>
    </form>
  </Layout>
</template>