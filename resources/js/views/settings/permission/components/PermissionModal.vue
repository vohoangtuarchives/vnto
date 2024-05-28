
<script>

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PermissionService from "@/services/permission.service";
import InputSwitch from "primevue/inputswitch";

export default {
  name: "PermissionModal",
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
          label: '',
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
          required:helpers.withMessage(this.$t('permission.errors.item.name.notEmpty'), required)
        },
        label: {
          required:helpers.withMessage(this.$t('permission.errors.item.label.notEmpty'), required)
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
      label: this.item.label,
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

    async updateOrCreatePermissionItem() {
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
      _this.item.label = _this.label;
      _this.item.status  = _this.status;

      PermissionService.updateOrCreateItem(_this.item).then((rs)=>{
        if(rs.data.success==false){
          var jsonObject = JSON.parse(rs.data.errors);
          Object.keys(jsonObject).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
              console.log(`${key}: ${jsonObject[key]}`);
              if (Array.isArray(jsonObject[key])) {
                jsonObject[key].forEach(item => {
                  this.errors_msg.push(this.$t("errors."+item,{a:this.$t(key)}));
                });
              }else{
                this.errors_msg.push(this.$t("errors."+jsonObject[key],{a:this.$t(key)}));
              }
            }
          });
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
    <form @submit.prevent="updateOrCreatePermissionItem" >
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
          <label class="form-label">{{ $t('permission.item.form.name') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('permission.item.form.name') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('permission.item.form.label') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="label" class="form-control" :placeholder=" $t('permission.item.form.label') " >
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