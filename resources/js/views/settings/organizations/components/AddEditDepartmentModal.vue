
<script>

import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import InputSwitch from "primevue/inputswitch";
import DepartmentService from "@/services/department.service";
import MultiSelect from 'primevue/multiselect';

export default {
  name: "AddEditDepartmentModal",
  components: {
    InputSwitch,
    MultiSelect
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
          code: '',
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
        required:helpers.withMessage(this.$t('department.errors.name_notEmpty'), required)
      },
      code: {
        required:helpers.withMessage(this.$t('department.errors.code_notEmpty'), required)
      },
    }

  },

  async mounted() {
    await DepartmentService.getPivotDepartmentJobPosition({department:1}).then((res) => {
          let data = res.data.data;
            if(data.length > 0 ){
              data.forEach(key => {
                this.jobpositions.push({name:key.name,code:key.id});
                if(this.item.id && key.departments.length > 0){
                  key.departments.forEach(key_job => {
                    
                    if(key_job.id==this.item.id){
                      this.selectedJobPositions.push({name:key.name,code:key.id});
                    }
                    
                  })
                  
                }
              });
            }
      }, (error) => {
          console.log(error);
      });
  },
  data() {
    return {
      jobpositions:ref([]),
      selectedJobPositions:ref([]),
      id: this.item.id,
      name: this.item.name,
      code: this.item.code,
      status: this.item.status!=undefined?Boolean(this.item.status):true,
      service: DepartmentService,
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

    async updateOrCreateDepartment() {
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
      _this.item.code = _this.code;
      _this.item.status  = _this.status;
      _this.item.jobpositions = _this.selectedJobPositions;
      _this.service.updateOrCreate(_this.item).then((rs)=>{

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
    <form @submit.prevent="updateOrCreateDepartment" >
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
          <label class="form-label">{{ $t('department.main-title') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('department.main-title') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('department.form.code') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="code" class="form-control" :placeholder=" $t('department.form.code') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('department.form.jobposition') }} (<span class="text-danger">*</span>)</label>
          <div class="form-control border-0 p-0">
            <MultiSelect v-model="selectedJobPositions" :options="jobpositions" filter optionLabel="name" :placeholder="this.$t('department.form.selectjobposition')"
            :maxSelectedLabels="3" class="w-100" />
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