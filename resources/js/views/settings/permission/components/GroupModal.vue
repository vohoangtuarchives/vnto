
<script>

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PermissionService from "@/services/permission.service";
import InputSwitch from "primevue/inputswitch";
// import MultiSelect from 'primevue/multiselect';
import { ref } from 'vue';

export default {
  name: "GroupModal",
  components: {
    InputSwitch,
    // MultiSelect
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
          required:helpers.withMessage(this.$t('permission.errors.group.name.notEmpty'), required)
        },
        label: {
          required:helpers.withMessage(this.$t('permission.errors.group.label.notEmpty'), required)
        },
    }

  },
  computed: {

  },
 async mounted() {
    await this.getPermissions();
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
      permissions:[],
      selected:ref([]),
      selectedPermissions:ref([])
    };
  },


  methods: {
    async  getPermissions(){
      await PermissionService.getItems({all:true}).then((res) => {
          let data = res.data.data;
            if(data.length > 0 ){
              data.forEach(key => {
                this.permissions.push({name:key.name,code:key.id});
                this.selectedPermissions.push({'id':key.id,'value':false})
                this.selected[key.id] = false;
                if(this.item.id && key.roles.length > 0){
                  key.roles.forEach(key_role => {
                    
                    if(key_role.id===this.item.id){
                      let permission = this.selectedPermissions.find(p => p.id === key.id);
                      this.selected[key.id] = true;
                      if (permission) {
                        
                        permission.value = true;
                      } else {
                        this.selectedPermissions.push({ id: key.id, value: true });
                      }
                    }
                    
                  })
                  
                }
              });
            }
            
      }, (error) => {
          console.log(error);
      });
   
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

    async updateOrCreatePermissionGroup() {

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
 
     
    
      for (const id in this.selected) {
        let val = this.selected[id];
        let permission = this.selectedPermissions.find(p => p.id === id);
        permission.value = val;
      }
   



    
      
      _this.item.name = _this.name;
      _this.item.label = _this.label;
      _this.item.status  = _this.status;
      _this.item.permissions  = (_this.selectedPermissions);
      

     
      PermissionService.updateOrCreateGroup(_this.item).then((rs)=>{

        
        if(rs.data.success==false){
          if(rs.data.success==false){
          var jsonObject = JSON.parse(rs.data.errors);
          Object.keys(jsonObject).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(jsonObject, key)) {
          
              if (Array.isArray(jsonObject[key])) {
                jsonObject[key].forEach(item => {
                  this.errors_msg.push(this.$t("errors."+item,{a:this.$t(key)}));
                });
              }else{
                this.errors_msg.push(this.$t("errors."+jsonObject[key],{a:this.$t(key)}));
              }
            }
          });
        }
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
    <form @submit.prevent="updateOrCreatePermissionGroup" >
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
          <label class="form-label">{{ $t('permission.group.form.name') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('permission.group.form.name') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('permission.group.form.label') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="label" class="form-control" :placeholder=" $t('permission.group.form.label') " >
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold text-danger">{{ $t('permission.group.form.list_permission') }}</label>
          <div class="card ">
           
           <div class="card-body ">
        
          <simplebar  style="max-height: 300px;overflow-x: hidden !important;" data-simplebar="data-simplebar" >
         

          <div class="form-control border-0 p-0">
            <div class="row">
              
            <div class="col-6 col-md-4" v-for="(item,key) in permissions" v-bind:key="key">
              <div class="form-check form-switch mb-3" dir="ltr">
                  <input type="checkbox" class="form-check-input" v-model="selected[item.code]" :id="'customSwitchsizesm-'+key" checked="">
                  <label class="form-check-label" :for="'customSwitchsizesm-'+key">{{ item.name }} </label>
              </div>
              
            </div>
          </div>
        </div>
             </simplebar>
          
          </div>
       
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