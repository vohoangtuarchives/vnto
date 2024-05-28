
<script>
import { useVuelidate } from "@vuelidate/core";
import staticPostService from "@/services/staticPost.service";
import uploadPhotoService from "@/services/uploadPhoto.service";
import Editor from "@/components/ui/editor";
import UploadFile from '../../../components/ui/uploadFile.vue'
import { mapGetters } from "vuex";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import TableFile from '@/views/company/components/tableFile.vue';
import {ref} from "vue";
export default {
  name: "editAboutCompanyModel",
  components: {
    Editor,
    TabView,
    TabPanel,
    UploadFile,
    TableFile,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    item: {
      type: Object, 
      default: function () {
        return {
          id: "",
          name: "",
          content: null,
          type: null,
          id_user: null,
        };
      },
    },
    array_files:{
      type: Array,
      default: function () {
        return [
                {
                    id: "",
                    name: "",
                    size_file: "",
                }
            ];
      },
    },
  },
  data() {
    return {
      id: this.item.id,
      name: this.item.name,
      content: this.item.content,
      type: this.item.type,
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      user: ref(null),
      uploadedFiles: [],
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  
  watch: {},
  mounted () {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  computed: {
    ...mapGetters("user", ["getList", "getUser"]),
  },
 
  methods: {
    close() {
      this.$vbsModal.close();
    },
    handleDestroyedFile() {
      // emit xoá file trong list file đã lưu
      this.$emit("closeModal");
      this.close();
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

        _this.item.name = this.name;
        _this.item.content = this.content;
        _this.item.type = this.type;
        _this.item.id_user = this.user.user.user.id;

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
        
        const rs = await staticPostService.updateOrCreate(_this.item);
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
              setTimeout(() => {
                  this.errors_msg=[];
              }, 1500);
            }
          }else{
            this.success_msg = this.$t("capnhatthanhcong");
            setTimeout(() => {
              this.success_msg = '';
              this.$emit("onUpdate");
              this.close();
            }, 1500);
          }

          this.success_msg = this.$t("capnhatthanhcong");
          setTimeout(() => {
            this.success_msg='';
            this.$emit("onUpdate");
            this.close();
          }, 1500);
        }
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
  <div>
    <div class="modal-header p-3 bg-success-subtle">
      <h5 class="modal-title">{{ this.title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
    </div>
    <form @submit.prevent="updateOrCreateStaticPost" >
      <TabView>
        <TabPanel :header="$t('noidung')">
          <p v-if="errors_msg.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul class="mb-0">
              <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
            </ul>
          </p>
          <p v-if="success_msg!=''" class="alert alert-success">
            {{success_msg}}
          </p>
          <div class="">
            <Editor v-model="content" class="me-2" />
          </div>
        </TabPanel>
        <TabPanel :header="$t('file')">
          <TableFile v-if="array_files.length>0" :data="array_files" :funcDel="true" @destroyed="handleDestroyedFile"/>
          <UploadFile @fileUploaded="handleFileUploaded"/>
        </TabPanel>
      </TabView>
      <div class="modal-footer">
        <BButton :loading="isLoading" type="submit" class="btn btn-success"> {{$t('capnhat')}}</BButton>
        <button type="button" class="btn btn-danger" @click="close"> <i class="ri-close-line"></i>{{ $t('dong') }} </button>
      </div>
    </form>
  </div>
</template>