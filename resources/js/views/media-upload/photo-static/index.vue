
<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { useVuelidate } from "@vuelidate/core";
//import { required, helpers } from "@vuelidate/validators";
import uploadPhotoService from "@/services/uploadPhoto.service";
export default {
  name: "AddEditPhotoStatic",
  components: {
    Layout,
    PageHeader,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      data: {
        id:'',
        name:'Logo Login',
        type_upload: 'logo-login',
        status:true,
        link:'',
        name_file:'',
      },
      type_upload: 'logo-login',
      file: null,
      previewUrl: null,
      errors_msg: [],
      success_msg: "",
      isLoading: false,
    };
  },
  mounted() {
    this.getData(this.type_upload);
  },
  methods: {
    async getData(type_upload) {
      try {
        const response = await uploadPhotoService.getItem(type_upload);
        if(response.data.data){
          this.data = response.data.data;
        this.previewUrl= this.imageLink(this.type_upload+'/'+response.data.data.name_file);
        this.data.status=Boolean(response.data.data.status);
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
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
      this.file = event.target.files[0];
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      }
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = async () => {
        const base64Image = await reader.result.split(",")[1];
        this.data.file = base64Image;
      }
    },
    async updateOrCreate() {
      try {
        this.errors_msg = [];
        if (!this.isLoading) {
          this.isLoading = true;
        }
        this.errors_msg = await this.validateForm();
        if (this.errors_msg.length > 0) {
          this.isLoading = false;
          return;
        }
        const rs = await uploadPhotoService.updateOrCreate(this.data);
        if (rs.data.status == false) {
          this.errors_msg.push(rs.data.data);
        } else {
          if (!this.id) {
            this.success_msg = this.$t("themoithanhcong");
          } else {
            this.success_msg = this.$t("capnhatthanhcong");
          }
          setTimeout(() => {
            this.success_msg='';
            this.$emit("onUpdate");
          }, 1500);
        }
      } catch (error) {
        console.error('Error while updating or creating:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<template>
  <Layout>
    <PageHeader title="Quản lý logo login" pageTitle="Dashboard" />
    <BRow>
      <div class="card">
      <div class="py-2">
        <form @submit.prevent="updateOrCreate">
          <div class="modal-body">
            <p v-show="errors_msg.length" class="alert alert-danger">
              <b>{{$t('please-correct-error')}}:</b>
              <ul class="mb-0">
                <li v-for="(error, key) in errors_msg" :key="key">{{ error }}</li>
              </ul>
            </p>
            <p v-show="success_msg !== ''" class="alert alert-success">
              {{ success_msg }}
            </p>
            <div class="p-3 border rounded">
              <div class="d-flex align-items-center">
                <button type="button" @click="openFileInput" class="border-0 rounded-pill text-white p-2 px-4 bg-success">
                  <i class="ri-file-image-line"></i>
                  {{ $t('chonanh') }}
                </button>
              </div>
              <input type="file" ref="fileInput" name="image" id="image" accept="image/*" @change="handleFileChange" style="display: none">
              <div v-show="previewUrl" class="mt-2">
                <img :src="previewUrl" alt="Preview" style="max-width: 100%; max-height: 200px;">
              </div>
            </div>
          <div class="modal-footer mt-3">
            <router-link :to="`/`" class="mx-2 btn btn-outline-primary"><i class="ri-reply-line"></i> {{$t('thoat')}} </router-link>
             <BButton :loading="isLoading" type="submit" class="btn btn-success m-2"> {{data.id?$t('capnhat'):$t('them')}}</BButton>
          </div>
          </div>
        </form>
      </div>
      </div>
    </BRow>
  </Layout>
</template>