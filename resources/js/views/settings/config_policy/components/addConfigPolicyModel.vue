
<script>

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PolicyService from "@/services/policy.service";
import {ref} from "vue";
import {mapGetters} from "vuex";

export default {
  name: "AddEditPolicyModal",
  props: {
    title: {
      type: String,
      default: ""
    },
    isTermContract: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: function () {
        return {
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
        }
      }
    },
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      name: {
        required:helpers.withMessage(this.$t('policy.errors.name_notEmpty'), required)
      }
    }
  },
  watch:{
    user_id(newId){
      console.log(newId);
    }
  },
  mounted: function () {
    this.userList = this.getList;
    if(this.user_id !== undefined && this.user_id !== null){
      this.user_id = this.getUser(this.item.user_id);
    }
  },
  computed: {
    ...mapGetters('user', ['getList', 'getUser'])
  },
  data() {
    return {
      id: this.item.id,
      name: this.item.name,
      des: this.item.des,
      ser_include:this.item.ser_include,
      ser_no_nclude:this.item.ser_no_nclude,
      cancellation_policy:this.item.cancellation_policy,
      surcharge_policy:this.item.surcharge_policy,
      children_policy:this.item.children_policy,
      special_policy:this.item.special_policy,
      terms_of_contract:this.item.terms_of_contract,
      user_id: this.item.user_id,
      status: Boolean(this.item.status) || false,
      errors_msg:[],
      success_msg:'',
      isLoading:false,
      userList: ref([])
    };
  },
  methods: {
    close() {
      this
          .$vbsModal
          .close();
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

    async updateOrCreatePolicy() {
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
      _this.item.name = this.name;
      _this.item.des = this.des;
      _this.item.des = this.des;
      _this.item.ser_include = this.ser_include,
      _this.item.ser_no_nclude = this.ser_no_nclude,
      _this.item.cancellation_policy = this.cancellation_policy,
      _this.item.surcharge_policy = this.surcharge_policy,
      _this.item.children_policy = this.children_policy,
      _this.item.special_policy = this.special_policy,
      _this.item.terms_of_contract = this.terms_of_contract,

      PolicyService.updateOrCreate(_this.item).then((rs)=>{

        if(rs.data.status==false){
          this.errors_msg.push(rs.data.data);
        }else{
          if(!this.id){
            this.success_msg = this.$t('themoithanhcong');
          }else{
            this.success_msg = this.$t('capnhatthanhcong');
          }
          setTimeout(() => {
            this.$emit("onUpdate");
            this.close();
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
  <div>
    <div class="modal-header p-3 bg-success-subtle">
      <h5 class="modal-title">{{ this.title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
    </div>
    <form @submit.prevent="updateOrCreatePolicy" >
      <div class="modal-body">
        <p v-if="errors_msg.length" class="alert alert-danger">
          <b>Please correct the following error(s):</b>
          <ul class="mb-0">
            <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
          </ul>
        </p>
        <p v-if="success_msg!=''" class="alert alert-success">
          {{success_msg}}
        </p>
        <div class="mb-3">
          <label class="form-label">{{ $t('ten') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('ten') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('mota') }} (<span class="text-danger">*</span>)</label>
          <b-form-textarea
                  class="form-control"
                  v-model="des" 
                  :placeholder=" $t('mota') "
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
        </div>
      </div>
      <div class="modal-footer">
        <BButton :loading="isLoading" type="submit" class="btn btn-success"> {{item.id?$t('capnhat'):$t('them')}}</BButton>
        <button type="button" class="btn btn-danger" @click="close"> <i class="ri-close-line"></i>{{ $t('dong') }} </button>
      </div>
    </form>
  </div>
</template>