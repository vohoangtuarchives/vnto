
<script>

import { useVuelidate } from '@vuelidate/core'
import { required,helpers,numeric } from '@vuelidate/validators'
import OrganizationService from "@/services/organization.service";
import Dropdown from "primevue/dropdown";
import {ref} from "vue";
import {mapGetters} from "vuex";
import InputSwitch from "primevue/inputswitch";

import TreeSelect from 'primevue/treeselect';
const objectHasDefinedKey = (obj) => {
  return !(Object.keys(obj)[0] === 'undefined');
};
export default {
  name: "AddUnitModal",
  components: {
    Dropdown,
    InputSwitch,
    TreeSelect
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
          parent_id:null,
          key:'',
          short_name: '',
          mandates: '',
          address: '',
          number: 0,
          status: false,
        }
      }
    },
    listUnit:{
      type: Array,
    },
    listUnitTree:{
      type: Array,
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations () {
    return {
      parent_id: {
        objectHasDefinedKey:helpers.withMessage(this.$t('organization-unit.errors.parent_id_notEmpty'), (parent_id) => objectHasDefinedKey(parent_id)) 
      },
      name: {
        required:helpers.withMessage(this.$t('organization-unit.errors.name_notEmpty'), required)
      },
      unit_code: {
        required:helpers.withMessage(this.$t('organization-unit.errors.unit_code_notEmpty'), required)
      },
      number: {
        numeric: helpers.withMessage(this.$t('organization-unit.errors.number_numeric'), numeric)
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
      parent_id: {[this.item.parent_id]: true },
      key: this.item.key,
      short_name: this.item.short_name,
      mandates: this.item.mandates,
      address: this.item.address,
      number: this.item.number,
      errors_msg:[],
      success_msg:'',
      isLoading:false,
      userList: ref([]),
      keyNew:'',
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
    async get(){
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
    async getKey(parent_id){
      let key_item='';
      let parent_id_get='';
    //   // 1.kiem tra parent_id 
      let info_parent=null;
      try {
        const response = await OrganizationService.findUnit(Object.keys(parent_id)[0]);
        if(response.data.data){
          info_parent = response.data.data;
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
      // 2. lấy tổng số child của parent 
      let sum_child=0;
      await OrganizationService.countChidl(info_parent.id).then(
          (response)=> {
            sum_child=response.data.data;
          }
      );
      // 3.gán key cho item key_item = info_parent.key +num_child
      key_item =info_parent.key+'-'+sum_child;
      parent_id_get=info_parent.id;
      return {
          key_item: key_item,
          parent_id_get: parent_id_get
      };
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
      _this.item.status  = this.status;
      _this.item.user_id = this.user_id.id || null;
      _this.item.short_name = this.short_name,
      _this.item.mandates = this.mandates,
      _this.item.address = this.address,
      _this.item.number = this.number,
      
      this.getKey(this.parent_id).then((repon)=>{
        _this.item.key=repon.key_item;
        _this.item.parent_id=repon.parent_id_get;
        delete _this.item.user;
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
        })
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
          <b>{{ $t('please-correct-lollowing-errors') }}:</b>
          <ul class="mb-0">
            <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
          </ul>
        </p>
        <p v-if="success_msg!=''" class="alert alert-success">
          {{success_msg}}
        </p>
        <div class="row">
          <div class="col-lg-6 col-12">
            <div class="mb-3">
              <label class="form-label">{{ $t('organization-unit.parent') }} (<span class="text-danger">*</span>)</label>
              <TreeSelect v-model="parent_id" :options="this.listUnitTree" optionValue="id"  :placeholder="$t('organization-unit.organizational_level')" class="md:w-20rem w-100"  
              >
                <template #option-label="{ node, labelClassName }">
                  <label :class="labelClassName">
                    {{ node.name }}
                  </label>
                </template>
              </TreeSelect>
            </div>
            <div class="mb-3">
              <label class="form-label">{{ $t('organization-unit.name') }} (<span class="text-danger">*</span>)</label>
              <input type="text" v-model="name" class="form-control" :placeholder=" $t('organization-unit.name') " >
            </div>
            <div class="mb-3">
              <label class="form-label">{{ $t('organization-unit.tenviettat') }}</label>
              <input type="text" v-model="short_name" class="form-control" :placeholder=" $t('organization-unit.tenviettat') " >
            </div>
            <div class="mb-3">
              <label class="form-label">{{ $t('organization-unit.unit_code') }} (<span class="text-danger">*</span>)</label>
              <input type="text" v-model="unit_code" class="form-control" :placeholder=" $t('organization-unit.unit_code') " >
            </div>
            <div class="mb-3">
              <label class="form-label">{{ $t('diachi') }}</label>
              <input type="text" v-model="address" class="form-control" :placeholder=" $t('diachi') " >
            </div>
          </div>
          <div class="col-lg-6 col-12">
            <div class="mb-3">
              <label class="form-label">{{ $t('organization-unit.head_of_department') }} </label>
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
            <div class="mb-3">
              <label class="form-label">{{ $t('organization-unit.chucnangnhiemvu') }}</label>
              <b-form-textarea
                  class="form-control"
                  v-model="mandates" 
                  :placeholder=" $t('organization-unit.chucnangnhiemvu') "
                  rows="2"
                  max-rows="6"
                ></b-form-textarea>
            </div>
            <div class="mb-3">
              <div class="d-flex align-items-center flex-wrap">
                <label class="form-label w-100">{{ $t('hoatdong') }}</label>
                <InputSwitch v-model="status" class="me-2"/>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">{{ $t('stt') }}</label>
              <input type="text" v-model="number" class="form-control" :placeholder=" $t('stt') " >
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