
<script>

import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import JobPositionService from "@/services/jobposition.service";
import DepartmentService from "@/services/department.service";
import PermissionService from "@/services/permission.service";
import InputSwitch from "primevue/inputswitch";
import MultiSelect from 'primevue/multiselect';


 
export default {
  name: "AddEditjobpositionModal",
  components: {
    InputSwitch,
    MultiSelect,


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
          required:helpers.withMessage(this.$t('jobposition.errors.name_notEmpty'), required)
        },
        code: {
          required:helpers.withMessage(this.$t('jobposition.errors.code_notEmpty'), required)
        },
       
    }

  },


  async mounted() {
    this.fetchData()
    
      
      
  },
  data() {

    return {
      departmentList:[],
      id: this.item.id,
      name: this.item.name,
      code: this.item.code,
      status: this.item.status!=undefined?Boolean(this.item.status):true,
      errors_msg:[],
      success_msg:'',
      isLoading:false,
      selectedDepartments:ref([]),
      departments:ref([]),
      roles:ref([]),
      selectedRole:ref([]),
    };
  },


  methods: {

    async fetchData() {
  try {
    const [departmentResponse, rolesResponse] = await Promise.all([
      DepartmentService.getPivotDepartmentJobPosition(),
      PermissionService.getGroups({ status: 1, all: 1, permission: 0, job: 1 })
    ]);

    // Process department data
    const departmentData = departmentResponse.data.data;
    if (departmentData.length > 0) {
      departmentData.forEach(key => {
        this.departments.push({ name: key.name, code: key.id });
        if (this.item.id && key.job_position.length > 0) {
          key.job_position.forEach(key_job => {
            if (key_job.id == this.item.id) {
              this.selectedDepartments.push({ name: key.name, code: key.id });
            }
          });
        }
      });
    }

    // Process roles data
    const rolesData = rolesResponse.data.data;
    if (rolesData.length > 0) {
      rolesData.forEach(key => {
        this.roles.push({ name: key.name, code: key.id });
        if (this.item.id && key.jobpositions.length > 0) {
          key.jobpositions.forEach(key_job => {
            if (key_job.id == this.item.id) {
              this.selectedRole.push({ name: key.name, code: key.id });
            }
          });
        }
      });
    }

  } catch (error) {
    console.error(error);
  }
},
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

    async updateOrCreatejobposition() {
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

      
      _this.item.departments = _this.selectedDepartments;
      _this.item.name = _this.name;
      _this.item.code = _this.code;
      _this.item.status  = _this.status;
      _this.item.roles  = _this.selectedRole;
      JobPositionService.updateOrCreate(_this.item).then((rs)=>{
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
    <form @submit.prevent="updateOrCreatejobposition" >
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
          <label class="form-label">{{ $t('jobposition.form.name') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('jobposition.form.name') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('jobposition.form.code') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="code" class="form-control" :placeholder=" $t('jobposition.form.code') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('jobposition.form.department') }} (<span class="text-danger">*</span>)</label>
          <div class="form-control border-0 p-0">
            <MultiSelect v-model="selectedDepartments" :options="departments" filter optionLabel="name" :placeholder="this.$t('jobposition.form.selectdepartment')"
            :maxSelectedLabels="3" class="w-100" />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">{{ $t('jobposition.form.roles') }} (<span class="text-danger">*</span>)</label>
          <div class="form-control border-0 p-0">
            <MultiSelect v-model="selectedRole" :options="roles" optionLabel="name" :placeholder="$t('permission.group.select')" class="w-100" />
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