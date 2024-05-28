
<script>

import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PriceRuleService from "@/services/priceRule.service";
import {ref} from "vue";
import {mapGetters} from "vuex";
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';

export default {
  name: "addPriceRuleModel",
  components: {
    Dropdown,
    InputSwitch,
  },
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
          id:'',
          name:'',
          type_service: null,
          unit_price: null,
          num_seats: '',
          age_group: null,
          record_kpi: 0,
          status: 1,
          user : ref(null),
        }
      }
    },
    dataServices:{
      type: Array,
    },
    dataAgeGroups:{
      type: Array,
    },
    dataUnitPrices:{
      type: Array,
    }
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
      idPost : ref(this.$route.params.id),
      id: this.item.id,
      name: this.item.name,
      type_service: this.item.type_service,
      type_service_id:this.item.type_service,
      unit_price: this.item.unit_price,
      unit_price_id: this.item.unit_price,
      num_seats: this.item.num_seats,
      age_group: this.item.age_group,
      age_group_id: this.item.age_group,
      record_kpi: Boolean(this.item.record_kpi) || false,
      user_id: this.item.user_id,
      status: Boolean(this.item.status) || false,
      errors_msg:[],
      success_msg:'',
      isLoading:false,
      arrayService: this.dataServices,
      ageGroups:this.dataAgeGroups,
      unitPrices:this.dataUnitPrices,
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
      
      _this.item.name = this.name;
      _this.item.type_service = _this.type_service_id ? _this.type_service_id : null,
      _this.item.unit_price = this.unit_price_id ? this.unit_price_id : null,
      _this.item.num_seats = this.num_seats,
      _this.item.age_group = this.age_group_id ? this.age_group_id : null,
      _this.item.record_kpi = this.record_kpi,
      _this.item.status  = this.status;
      delete _this.item.service_policy;
     
      PriceRuleService.updateOrCreate(_this.item).then((rs)=>{

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
    <form @submit.prevent="updateOrCreatePriceRule" >
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
          <label class="form-label">{{ $t('doituong.loaihinhdichvu') }} (<span class="text-danger">*</span>)</label>
         <input type="hidden" name="type_service" :value="type_service_id">
          <Dropdown v-model="type_service_id" editable :options="arrayService" filter optionLabel="name" optionValue="id" :placeholder=" $t('chon') " class="w-full w-100 md:w-14rem p-0" >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
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
          <label class="form-label">{{ $t('doituong.doituong') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="name" class="form-control" :placeholder=" $t('ten') " >
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('doituong.donvitinh') }} (<span class="text-danger">*</span>)</label>
          <Dropdown v-model="unit_price_id" editable :options="unitPrices" filter optionLabel="name" optionValue="code" :placeholder=" $t('chon') " class="w-full w-100 md:w-14rem" >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Dropdown>
        </div>
        <div class="row">
          <div class="col-6 mb-3">
            <label class="form-label">{{ $t('doituong.quydoisocho') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="num_seats" class="form-control" :placeholder=" $t('doituong.quydoisocho') " >
          </div>
          <div class="col-6 mb-3">
            <label class="form-label">{{ $t('doituong.nhomdotuoi') }} (<span class="text-danger">*</span>)</label>
            <Dropdown v-model="age_group_id" editable :options="ageGroups" filter optionLabel="name" optionValue="code" :placeholder=" $t('chon') " class="w-full w-100 md:w-14rem" >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>
        <div class="row">
          <div class="col-6 mb-3">
            <div class="d-flex align-items-center">
              <InputSwitch v-model="record_kpi" class="me-2"/>
              {{ $t('doituong.ghinhankpi') }}
            </div>
          </div>
          <div class="col-6 mb-3">
            <div class="d-flex align-items-center">
              <InputSwitch v-model="status" class="me-2"/>
              {{ $t('trangthai') }}
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
<style >
.p-dropdown-items-wrapper > ul{
  padding-left: 0;
}
</style>