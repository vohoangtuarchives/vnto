
<script>

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import OrganizationService from "@/services/organization.service";
import Dropdown from "primevue/dropdown";
import {ref} from "vue";
import {mapGetters} from "vuex";
import InputSwitch from "primevue/inputswitch";

export default {
  name: "AddUnitModal",
  components: {
    Dropdown,
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
          id:'',
          name:'',
          unit_code: '',
          user_id: '',
          status: false,
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
        required:helpers.withMessage(this.$t('organization-unit.errors.name_notEmpty'), required)
      },
      unit_code: {
        required:helpers.withMessage(this.$t('organization-unit.errors.name_notEmpty'), required)
      },
      user_id: {
        required:helpers.withMessage(this.$t('organization-unit.errors.name_notEmpty'), required)
      },
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

    // UserService.getList().then(function (response) {
    //   if(response.data.success){
    //     that.userList = response.data.data
    //   }
    // });
  },
  computed: {
    ...mapGetters('user', ['getList', 'getUser'])
  },
  data() {
    return {
      id: this.item.id,
      name: this.item.name,
      unit_code: this.item.unit_code,
      user_id: this.item.user_id,
      status: Boolean(this.item.status) || false,
      organization_level: this.item.organization_level,
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

    async updateOrCreate() {
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
      _this.item.unit_code = this.unit_code;
      _this.item.organization_level = this.organization_level;
      _this.item.status  = this.status;
      _this.item.user_id = this.user_id.id || null;

      OrganizationService.updateOrCreateUnit(_this.item).then((rs)=>{

        if(rs.data.status==false){
          this.errors_msg.push(rs.data.data);
        }else{
          if(!this.id){
            this.success_msg = this.$t('themmoithanhcong');
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

      _this.item.lead_user = this.user_id.name;

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
    <form @submit.prevent="updateOrCreate" >
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

        <div class="row">
          <div class="col-lg-6 col-12 mb-3">
            <label class="form-label">{{ $t('organization-unit.name') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="name" class="form-control" :placeholder=" $t('organization-unit.name') " >
          </div>
          <div class="col-lg-6 col-12 mb-3">
            <label class="form-label">{{ $t('organization-unit.parent') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="name" class="form-control" :placeholder=" $t('organization-unit.name') " >
          </div>
          <div class="col-lg-6 col-12 mb-3">
            <label class="form-label">{{ $t('organization-unit.organization_level') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="organization_level" class="form-control" :placeholder=" $t('organization-unit.organization_level') " >
          </div>
          <div class="col-lg-6 col-12 mb-3">
            <label class="form-label">{{ $t('organization-unit.unit_code') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="unit_code" class="form-control" :placeholder=" $t('organization-unit.unit_code') " >
          </div>

          <div class="col-lg-6 col-12 mb-3">
            <label class="form-label">{{ $t('organization-unit.head_of_department') }} (<span class="text-danger">*</span>)</label>

            <Dropdown v-model="user_id" :options="userList" filter optionLabel="name" :placeholder="$t('organization-unit.head_of_department')" class="w-100">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    ------
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Dropdown>

          </div>

          <div class="col-lg-6 col-12 mb-3">
            <div class="d-flex align-items-center">
              <InputSwitch v-model="status" class="me-2"/>
              {{ $t('hoatdong') }}
            </div>

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