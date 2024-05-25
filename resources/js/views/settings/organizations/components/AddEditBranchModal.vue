
<script>

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import OrganizationService from "@/services/organization.service";
import InputSwitch from "primevue/inputswitch";

export default {
  name: "AddEditBranchModal",
  components: {
    InputSwitch
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      default: function () {
        return {
          name:'',
          address: '',
          is_main: 0,
          status: 1,
          id:'',
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
          required:helpers.withMessage(this.$t('branch.errors.name_notEmpty'), required)
        },
        address: {
          required:helpers.withMessage(this.$t('branch.errors.address_notEmpty'), required)
        },
    }

  },

  mounted() {
    console.log(
        this.is_main
    )
  },
  data() {
    return {
      id: this.item.id,
      name: this.item.name,
      address: this.item.address,
      is_main: Boolean(this.item.is_main),
      status: Boolean(this.item.status),

      errors_msg:[],
      success_msg:'',
      isLoading:false,
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

    async updateOrCreateBranch() {
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


      _this.item.name = _this.name;
      _this.item.address = _this.address;
      _this.item.status  = _this.status;
      _this.item.is_main = _this.is_main || false;

      OrganizationService.updateOrCreateBranch(_this.item).then((rs)=>{

        console.log(rs);
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
          }, (1500));
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
    <form @submit.prevent="updateOrCreateBranch" >
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
          <label class="form-label">{{ $t('branch.branch-title') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('branch.branch-title') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('diachi') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="address" class="form-control" :placeholder=" $t('diachi') " >
        </div>
        <div class="mb-3">
          <div class="d-flex align-items-center">
            <InputSwitch v-model="is_main" class="me-2"/>
            {{ $t("branch.is_main") }}
          </div>
        </div>

        <div class="mb-3">
          <div class="d-flex align-items-center">
            <InputSwitch v-model="status" class="me-2"/>
            {{ $t('hoatdong') }}
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