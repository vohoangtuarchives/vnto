<template>
  <Layout>
      <BContainer>
        <BRow>
          <BCol>
            <BCard>
              <BCardBody>
                <BForm @submit="onSubmit" @reset="onReset">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label" for="name">Tên công ty (<span class="text-danger">*</span>)</label>
                        <input class="form-control" type="text" name="name" id="name" placeholder="Nhập tên" v-model="information.company_name">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label" for="company_address">Trụ sở chính</label>
                        <input class="form-control" type="text" name="company_address" id="company_address" placeholder="Nhập địa chỉ"  v-model="information.company_address">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label" for="company_brand_name">Tên thương hiệu</label>
                        <input class="form-control" type="text" name="company_brand_name" id="company_brand_name" v-model="information.company_brand_name"  placeholder="Nhập tên thương hiệu">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label" for="company_slogan">Slogan</label>
                        <input class="form-control" type="text" name="company_slogan" id="company_slogan" v-model="information.company_slogan" placeholder="Nhập company slogan">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="form-control-label" for="company_license">GP lữ hành</label>
                        <input class="form-control" type="text" name="company_license" id="company_license" v-model="information.company_license" placeholder="Nhập giấy phép">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label" for="company_signatory">Người đại diện</label>
                        <input class="form-control" type="text" name="company_signatory" id="company_signatory" v-model="information.company_signatory" placeholder="Nhập người đại diện">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label" for="signing_authority">Vai trò người đại diện</label>
                        <input class="form-control" type="text" name="signing_authority" id="signing_authority" v-model="information.signing_authority" placeholder="Nhập vai trò">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label" for="company_email">Email</label>
                        <input class="form-control" type="text" name="company_email" id="company_email" v-model="information.company_email" placeholder="Nhập email công ty">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label" for="company_phone">Phone</label>
                        <input class="form-control" type="text" name="company_phone" id="company_phone" v-model="information.company_phone" placeholder="Nhập phone">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label" for="company_website">Website</label>
                        <input class="form-control" type="text" name="company_website" id="company_website" v-model="information.company_website" placeholder="Nhập website">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="form-control-label" for="company_tax_code">Mã số thuế</label>
                        <input class="form-control" type="text" name="company_tax_code" id="company_tax_code" v-model="information.company_tax_code" placeholder="Nhập mã số thuế">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <template v-if="information.company_logo_lg_path">
                        <img :src="imageLink(information.company_logo_lg_path)" class="img-thumbnail" alt="" style="height: 110px">
                      </template>
                      <div class="form-group">
                        <div class="d-flex">
                          <label class="form-control-label" for="logo_lg_path">Logo sidebar (250x45)</label>
                        </div>
                        <input class="form-control" type="file" name="logo_lg_path" v-on:change="onChangeLogoLgPath" id="logo_lg_path" accept="image/*">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <template v-if="information.company_logo_sm_path">
                        <img :src="imageLink(information.company_logo_sm_path)" class="img-thumbnail" alt="" style="height: 110px">
                      </template>
                      <div class="form-group">
                        <label class="form-control-label" for="logo_sm_path">Logo sidebar thu nhỏ (150x150)</label>
                        <input class="form-control" type="file" name="logo_sm_path" id="logo_sm_path" accept="image/*" v-on:change="onChangeLogoSmPath">
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="hstack gap-2 justify-content-end mt-3">
                          <a class="btn btn-soft-secondary" href="https://crm.vietnamtouristvn.vn/admin/setting">Thoát</a>
                          <BButton :loading="isLoading" id="js_btn_submit" type="submit" class="btn btn-success"> {{$t('luu')}}</BButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </BForm>
              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
        <Toast></Toast>
      </BContainer>
  </Layout>
</template>
<script>
import api from "@/services/api";
import Layout from "@/layouts/main.vue";

import {required, helpers, email} from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core';
import {useToast} from "primevue/usetoast";

const API_ORGANIZATION_INFORMATION  = "setting/organization/information";

export default {
  components: {
    Layout
  },
  setup () {
    return {
      v$: useVuelidate(),
      toast: useToast()
    }
  },
  data() {
    return {

      formData: null,
      information: {},
      isLoading: false
    }
  },
  mounted() {
    
    this.formData = new FormData();
    api.get(API_ORGANIZATION_INFORMATION).then((response)=>{
      let _that = this;
      if(response.data.success && response.data.content.length > 0){
          response.data.content.forEach(function (item){
            _that.information[item["key"]] = item["value"];
          });

          console.log(_that.information);
      }
      })
  },
  validations(){
    return {
      information: {
        company_name: {
          required: helpers.withMessage(this.$t('settings.organization.require_company_name'), required)
        },
        company_address: {
          required: helpers.withMessage(this.$t('settings.organization.require_company_address'), required)
        },
        company_email: {
          email: helpers.withMessage(this.$t('settings.organization.incorrect_email_format'), email),
          required: helpers.withMessage(this.$t('settings.organization.require_email'), required)
        },
      }
    }
  },
  methods: {
    showToast(msg, options){
      this.toast.add({severity: options.type,  detail: msg, life: 1000});
    },
    onChangeLogoSmPath(event) {
      let _this = this;
      this.information.logo_lg_path = window.URL.createObjectURL(event.target.files[0]);
      _this.formData.append('company_logo_sm_path', event.target.files[0]);
    },
    onChangeLogoLgPath(event) {
      let _this = this;
      this.information.logo_lg_path = window.URL.createObjectURL(event.target.files[0]);
      _this.formData.append('company_logo_lg_path', event.target.files[0]);
    },
    updateInformation(data) {
      if(!this.isLoading) {
        this.isLoading = true;
      }
      let _this = this;
      Object.keys(data).forEach(function(key) {
        _this.formData.append(key, data[key]);
      });

      return api.post(
          ("/setting/organization/information"),
          _this.formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then(function (response){
        _this.isLoading = false;
        if(response.data.success){
          _this.showToast(_this.$t("settings.organization.update-success"), {type: 'success'});
        }
      }).catch(function (data){
        _this.isLoading = false;
        _this.showToast(data.response.status + ":" + data.response.data.message ,{type: 'error'});
      })
    },
    async onSubmit(event) {
      event.preventDefault();
      try {
        const isFormCorrect = await this.v$.$validate();
        if (!isFormCorrect){
          throw this.v$.$errors;
        }
        return this.updateInformation(this.information);
      }catch (e) {
        console.log(e);
        e.forEach(function(error){
          this.showToast(error.$message, {type: 'error'});
        });
      }
    },
    onReset(event) {
      event.preventDefault();
      this.information = {};
    }
  }
}
</script>