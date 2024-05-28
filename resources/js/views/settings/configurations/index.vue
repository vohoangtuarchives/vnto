<template>
  <Layout>
    <BContainer>
      <BRow>
        <BCol>
          <BCard>
            <BCardBody>
              <BForm @submit="onSubmit" @reset="onReset">
                <TabView>
                  <TabPanel v-for="(configuration,key) in configurations" :key="key" :header="$t(key + '.title')">
                    <div class="row">
                      <div class="col-md-12 col-lg-6" v-for="(config,pre) in configuration" :key="pre">
                        <template v-if="config.type === 'text'">
                          <div class="form-group">
                            <label class="form-control-label" :for="config.key">{{ $t(config.title) }} <span v-if="config.validation">(<span class="text-danger">*</span>)</span></label>
                            <input class="form-control" type="text" :name="config.key" id="name" :placeholder="'Nhập ' + $t(config.title)" v-model="information[config.key]">
                          </div>
                        </template>

                        <template v-if="config.type === 'file.image'">
                          <label class="form-control-label" :for="config.key">{{ $t(config.title) }}</label>
                          <div class="form-group">
                            <img :src="imageLink(information[config.key])" class="img-thumbnail mb-2" alt="" style="height: 110px">
                            <input class="form-control" type="file" :name="config.key" :id="config.ke" accept="image/*" v-on:change="onChangeFileImage(config.key, $event)">
                          </div>
                        </template>

                      </div>
                      </div>
                  </TabPanel>
                </TabView>
                <div class="row">
                  <div class="col-md-12">
                    <div class="hstack gap-2 justify-content-end mt-3">
                      <a class="btn btn-soft-secondary" href="https://crm.vietnamtouristvn.vn/admin/setting">Thoát</a>
                      <BButton :loading="isLoading" id="js_btn_submit" type="submit" class="btn btn-success"> {{$t('luu')}}</BButton>
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
import {ref} from "vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import configurationService from "@/services/configuration.service";

const API_ORGANIZATION_INFORMATION  = "setting/organization/information";

export default {
  components: {
    Layout,
    TabView,
    TabPanel
  },
  setup () {
    return {
      v$: useVuelidate(),
      toast: useToast()
    }
  },
  data() {
    return {
     configurations: ref([]),

      formData: null,
      information: {},
      isLoading: false
    }
  },
  mounted() {
    configurationService.getDefaultConfigurations().then((response)=>{
          if(response.data.success){
            this.configurations =  response.data.data;
          }
    });
    this.formData = new FormData();
    api.get(API_ORGANIZATION_INFORMATION).then((response)=>{
      let _that = this;
      if(response.data.success && response.data.content.length > 0){
        response.data.content.forEach(function (item){
          _that.information[item["key"]] = item["value"];
        });
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
      this.$root.showToast(msg, options);
    },
    onChangeFileImage(key, event) {
      let _this = this;
      this.information[key] = window.URL.createObjectURL(event.target.files[0]);
      _this.formData.append(key, event.target.files[0]);
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
      let _that = this;
      try {
        const isFormCorrect = await this.v$.$validate();
        if (!isFormCorrect){
          throw this.v$.$errors;
        }
        return this.updateInformation(this.information);
      }catch (e) {
        console.log(e);
        e.forEach(function(error){
          _that.$root.showToast(error.$message, {type: 'error'});
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