
<script>
import Editor from '../../../components/ui/editor.vue'
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PolicyService from "@/services/policy.service";
import {ref} from "vue";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputSwitch from 'primevue/inputswitch';
export default {
  components: {
    Layout,
    PageHeader,
    TabView,
    TabPanel, 
    Editor,
    InputSwitch,
  },
  
  validations () {
    return {
      data:{
        name: {
          required:helpers.withMessage(this.$t('doituong.errors.name_notEmpty'), required)
        },
      }
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      idItem : ref(this.$route.params.id),
      data: {
        name:'',
        des: '',
        id:'',
        ser_include:'',
        ser_no_nclude:'',
        cancellation_policy:'',
        surcharge_policy:'',
        children_policy:'',
        special_policy:'',
        terms_of_contract:'',
        status: false,
      },
      service:PolicyService,
      errors_msg:[],
      success_msg:'',
      isLoading:false,
      dataLoaded: false,
    };
  },
  watch:{
    
  },
  computed: {
  },
  mounted() {
    this.getData(this.idItem);
  },
  methods: {
    async getData(id) {
      try {
        const response = await this.service.getItem(id);
        if(response.data.data){
          this.data = response.data.data;
          console.log(this.data);
        }
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      }
      this.dataLoaded=true;
    },
    async validateForm(){
      const result = await this.v$.$validate();
      let errors_msg = [];
      if (!result) {
        this.v$.$errors.forEach(function(error){
          errors_msg.push(error.$message);
          return errors_msg;
        });
      }
      return errors_msg;
    },

    async updateOrCreatePriceRule() {
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
      _this.data.des = this.data.des;
      _this.data.ser_include = this.data.ser_include;
      _this.data.ser_no_nclude = this.data.ser_no_nclude;
      _this.data.cancellation_policy = this.data.cancellation_policy;
      _this.data.surcharge_policy = this.data.surcharge_policy;
      _this.data.children_policy = this.data.children_policy;
      _this.data.special_policy = this.data.special_policy;
      _this.data.terms_of_contract = this.data.terms_of_contract;
     
      _this.data.status  = this.data.status;
      console.log(this.data);
     
      this.service.updateOrCreate(_this.data).then((rs)=>{
        if(rs.data.status==false){
          this.errors_msg.push(rs.data.data);
        }else{
          if(!this.data.id){
            this.success_msg = this.$t('themoithanhcong');
          }else{
            this.success_msg = this.$t('capnhatthanhcong');
          }
          setTimeout(() => {
            this.$emit("onUpdate");
            this.$router.push('/settings/config-policy/man');
          }, (800));
        }
        this.isLoading = false;
      });
      return false;
    },
  },
};
</script>
<template>
  <Layout>
    <PageHeader :title="`${ this.idItem?$t('capnhat'):$t('themmoi')} ${$t('dichvu.dichvuchinhsach')}`" pageTitle="Dashboard" />
    <form @submit.prevent="updateOrCreatePriceRule" >
      <p v-if="errors_msg.length" class="alert alert-danger">
        <b>{{$t('please-correct-lollowing-errors')}}:</b>
        <ul class="mb-0">
          <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
        </ul>
      </p>
      <p v-if="success_msg!=''" class="alert alert-success">
        {{success_msg}}
      </p>
      <TabView>
        <TabPanel :header="$t('thongtinchung')">
          <div class="mb-3">
            <label class="form-label">{{ $t('ten') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="data.name" class="form-control" :placeholder=" $t('ten') " >
          </div>
          <div class=" mb-3">
            <div class="d-flex align-items-center">
              <InputSwitch v-model="data.status" class="me-2"/>
              <label class="mb-0">{{ $t('trangthai') }}: {{data.status==1?$t('hoatdong'):$t('tamdung')}}</label> 
            </div>
          </div>
          <div class="">
            <label class="form-label">{{ $t('mota') }}</label>
            <Editor v-if="dataLoaded" height="400" v-model="data.des" class="me-2" />
          </div>
        </TabPanel>
        <TabPanel :header="$t('dichvu.capnhatchinhsach')">
          <BRow>
            <BCol cols="12" lg="6" md="12" sm="12">
              <div class="mb-3">
                <label class="form-label">{{ $t('dichvu.dichvubaogom') }} (<span class="text-danger">*</span>)</label>
                <Editor v-if="dataLoaded" height="400" v-model="data.ser_include" class="me-2" />
              </div>
            </BCol>
            <BCol cols="12" lg="6" md="12" sm="12">
              <div class="mb-3">
                <label class="form-label">{{ $t('dichvu.dichvukhongbaogom') }} (<span class="text-danger">*</span>)</label>
                <Editor v-if="dataLoaded" height="400" v-model="data.ser_no_nclude" class="me-2" />
              </div>
            </BCol>
            <BCol cols="12" lg="6" md="12" sm="12">
              <div class="mb-3">
                <label class="form-label">{{ $t('dichvu.chinhsachhoanhuy') }} (<span class="text-danger">*</span>)</label>
                <Editor v-if="dataLoaded" height="400" v-model="data.cancellation_policy" class="me-2" />
              </div>
            </BCol>
            <BCol cols="12" lg="6" md="12" sm="12">
              <div class="mb-3">
                <label class="form-label">{{ $t('dichvu.chinhsachphuthu') }} (<span class="text-danger">*</span>)</label>
                <Editor v-if="dataLoaded" height="400" v-model="data.surcharge_policy" class="me-2" />
              </div>
            </BCol>
            <BCol cols="12" lg="6" md="12" sm="12">
              <div class="mb-3">
                <label class="form-label">{{ $t('dichvu.chinhsachtreem') }} (<span class="text-danger">*</span>)</label>
                <Editor v-if="dataLoaded" height="400" v-model="data.children_policy" class="me-2" />
              </div>
            </BCol>
            <BCol cols="12" lg="6" md="12" sm="12">
              <div class="mb-3">
                <label class="form-label">{{ $t('dichvu.luuydacbiet') }} (<span class="text-danger">*</span>)</label>
                <Editor v-if="dataLoaded" height="400" v-model="data.special_policy" class="me-2" />
              </div>
            </BCol>
          </BRow>
        </TabPanel>
        <TabPanel :header="$t('dichvu.capnhatdieukhoanhopdong')">
          <div class="mb-3">
            <label class="form-label">{{ $t('dichvu.dieukhoanhopdong') }} (<span class="text-danger">*</span>)</label>
            <Editor v-if="dataLoaded" height="600" v-model="data.terms_of_contract" class="me-2" />
          </div>
        </TabPanel>
      </TabView>
      <div class=" my-4">
        <router-link :to="{ name: 'settings.config_policy.man' }" class="mx-2 btn btn-outline-primary">
          <i class="ri-reply-line"></i> {{$t('thoat')}}
        </router-link>
        <BButton :loading="isLoading" type="submit" class="btn btn-success"><i class="ri-upload-cloud-line"></i> {{data.id?$t('capnhat'):$t('them')}}</BButton>
      </div>
    </form>
  </Layout>
</template>
<style >
.p-dropdown-items-wrapper > ul{
  padding-left: 0;
}
</style>