
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import uploadPhotoService from "@/services/uploadPhoto.service";
import InputSwitch from 'primevue/inputswitch';

export default {
  name: "AddEditPhoto",
  components: {
    InputSwitch,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    props_type_upload: {
      type: String,
      default: "",
    },
    item: {
      type: Object,
      default: function () {
        return {
          name: "",
          link: "",
          name_file: "",
          status: 1,
          type_upload: "banner-login",
          id: "",
          file: null,
        };
      },
    },
  },

  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      name: {
        required: helpers.withMessage(
          this.$t("media.errors.name_notEmpty"),
          required
        ),
      },
    };
  },

  mounted() {

  },
  data() {
    return {
      id: this.item.id,
      name: this.item.name,
      link: this.item.link,
      name_file: this.item.name_file,
      type_upload: this.item.type_upload ?? this.props_type_upload,
      status:  Boolean(this.item.status) || false,
      previewUrl: this.item.name_file?this.imageLink('banner-login/'+this.item.name_file):'',
      errors_msg: [],
      success_msg: "",
      isLoading: false,
    };
  },

  methods: {
    close() {
      this.$vbsModal.close();
    },
    async validateForm() {
      const result = await this.v$.$validate();
      let errors_msg = [];
      if (!result) {
        this.v$.$errors.forEach(function (error) {
          errors_msg.push(error.$message);
          return errors_msg;
        });
      }
      return errors_msg;
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
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
        this.file = base64Image;
      }
    },
   async updateOrCreate() {
      let _this = this;
      _this.errors_msg = [];
      if (!_this.isLoading) {
        _this.isLoading = true;
      }
      _this.errors_msg = await this.validateForm();
      if (_this.errors_msg.length > 0) {
        _this.isLoading = false;
        return;
      }
      
      if(this.file){
        _this.item.file = this.file;
      }
      _this.item.name = _this.name;
      _this.item.link = _this.link;
      _this.item.status = _this.status;
      _this.item.type_upload= _this.type_upload;

      uploadPhotoService.updateOrCreate(_this.item).then((rs) => {
        if (rs.data.status == false) {
          this.errors_msg.push(rs.data.data);
        } else {
          if (!this.id) {
            this.success_msg = this.$t("themoithanhcong");
          } else {
            this.success_msg = this.$t("capnhatthanhcong");
          }
          setTimeout(() => {
            this.$emit("onUpdate");
            this.close();
          }, 1500);
        }
        this.isLoading = false;
      });
      return false;
    },
  },
};
</script>

<template>
  <div>
    <div class="modal-header p-3 bg-info-subtle">
      <h5 class="modal-title">{{ this.title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
    </div>
    <form @submit.prevent="updateOrCreate" >
      <div class="modal-body">
        <p v-if="errors_msg.length" class="alert alert-danger">
          <b>{{$t('please-correct-error')}}:</b>
          <ul class="mb-0">
            <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
          </ul>
        </p>
        <p v-if="success_msg!=''" class="alert alert-success">
          {{success_msg}}
        </p>

        <div class="mb-3">
          <label class="form-label">{{ $t('media.name_photo') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('media.name_photo') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('media.link') }}</label>
          <input type="text" v-model="link" class="form-control" :placeholder=" $t('media.link') " >
        </div>
        <div class="mb-3 d-flex align-items-center">
          <InputSwitch v-model="status" class="me-2"/>
          {{ $t('trangthai') }}
        </div>
        <div class="p-3 border rounded">
            <div class="d-flex align-items-center">
              <button type="button" @click="openFileInput" class="border-0 rounded-pill text-white p-2 px-4 bg-success">
                <i class="ri-file-image-line"></i>
                {{ $t('chonanh') }}
              </button>
              <div v-if="this.file" class="mx-1 ">
                  {{this.file.name}}
              </div>
            </div>
            <input type="file" ref="fileInput" name="image" id="image"  accept="image/*" @change="handleFileChange" style="display: none">
            <div v-if="previewUrl" class="mt-2">
              <img :src="previewUrl" alt="Preview" style="max-width: 100%; max-height: 200px;">
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <BButton :loading="isLoading" type="submit" class="btn btn-success"> {{item.id?$t('capnhat'):$t('them')}}</BButton>
        <button type="button" class="btn btn-danger" @click="close"> <i class="ri-close-line"></i>{{ $t('dong') }} </button>
      </div>
    </form>
  </div>
</template>