
<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import PriceRuleService from "@/services/priceRule.service";
import {ref} from "vue";
import {mapGetters} from "vuex";
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
export default {
  components: {
    Layout,
    PageHeader,
    Dropdown,
    InputSwitch,
  },
  props: {
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
      data:{
        name: {
          required:helpers.withMessage(this.$t('doituong.errors.name_notEmpty'), required)
        },
        type_service_id: {
          required:helpers.withMessage(this.$t('doituong.errors.type_service_notEmpty'), required)
        },
        unit_price_id: {
          required:helpers.withMessage(this.$t('doituong.errors.unit_price_notEmpty'), required)
        },
        age_group_id: {
          required:helpers.withMessage(this.$t('doituong.errors.age_group_notEmpty'), required)
        },
        num_seats: {
          required:helpers.withMessage(this.$t('doituong.errors.num_seats_notEmpty'), required)
        },
      }
    }
  },
  watch:{
    user_id(newId){
      console.log(newId);
    }
  },
  computed: {
    ...mapGetters('user', ['getList', 'getUser'])
  },
  data() {
    return {
      idItem : ref(this.$route.params.id),
      data: {
        id:'',
        name:'',
        type_service: '',
        type_service_id:'',
        unit_price: '',
        unit_price_id: '',
        num_seats: '',
        age_group: '',
        age_group_id: '',
        record_kpi:false,
        user_id: '',
        status: false,
      },
      service:PriceRuleService,
      errors_msg:[],
      success_msg:'',
      isLoading:false,
      arrayService:  ref([]),
      ageGroups: ref([
        { name: this.$t("nguoilon"), code: "nguoilon" },
        { name: this.$t("treem"), code: "treem" },
        { name: this.$t("embe"), code: "embe" },
        { name: this.$t("khac"), code: "khac" },
      ]),
      unitPrices: ref([
        { name: this.$t("khach"), code: "khach" },
        { name: this.$t("phong"), code: "phong" },
        { name: this.$t("goi"), code: "goi" },
        { name: this.$t("ve"), code: "ve" },
        { name: this.$t("xe"), code: "xe" },
        { name: this.$t("ghe"), code: "ghe" },
        { name: this.$t("dem"), code: "dem" },
        { name: this.$t("luot"), code: "luot" },
        { name: this.$t("bua"), code: "bua" },
      ]),
    };
  },
  mounted() {
    this.getData(this.idItem);
    this.getServices();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    async getData(id) {
      try {
        const response = await PriceRuleService.getItem(id);
        if(response.data.data){
          this.data = response.data.data;
          this.data.unit_price_id = response.data.data.unit_price;
          this.data.age_group_id = response.data.data.age_group;
          this.data.type_service_id = response.data.data.type_service;
        }
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      }
    },
    async getServices() {
      try {
        const response = await PriceRuleService.getServices();
        if(response.data.data){
          this.arrayService = response.data.data;
        }
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      }
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
      _this.data.type_service = this.data.type_service_id ? this.data.type_service_id : null,
      _this.data.unit_price = this.data.unit_price_id ? this.data.unit_price_id : null,
      _this.data.num_seats = this.data.num_seats,
      _this.data.age_group = this.data.age_group_id ? this.data.age_group_id : null,
      _this.data.record_kpi = this.data.record_kpi,
      _this.data.status  = this.data.status;
      delete _this.data.service_policy;
     
      PriceRuleService.updateOrCreate(_this.data).then((rs)=>{
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
            this.$router.push('/settings/price-rule/man');
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
    <PageHeader :title="`${ this.idItem?$t('capnhat'):$t('themmoi')} ${$t('doituong.doituong')}`" pageTitle="Dashboard" />
    <form @submit.prevent="updateOrCreatePriceRule" >
      <BCard >
      <div class="modal-body">
        <p v-if="errors_msg.length" class="alert alert-danger">
          <b>{{$t('please-correct-lollowing-errors')}}:</b>
          <ul class="mb-0">
            <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
          </ul>
        </p>
        <p v-if="success_msg!=''" class="alert alert-success">
          {{success_msg}}
        </p>
        <BRow>
          <BCol cols="12" lg="6" md="12" sm="12">
            <div class="mb-3">
          <label class="form-label">{{ $t('doituong.doituong') }} (<span class="text-danger">*</span>)</label>
          <input type="text" v-model="data.name" class="form-control" :placeholder=" $t('ten') " >
        </div>
          </BCol>
          <BCol cols="12" lg="6" md="12" sm="12">
            <div class="mb-3">
          <label class="form-label">{{ $t('doituong.loaihinhdichvu') }} (<span class="text-danger">*</span>)</label>
         <input type="hidden" name="type_service" :value="type_service_id">
          <Dropdown v-model="data.type_service_id" editable :options="arrayService" filter optionLabel="name" optionValue="id" :placeholder=" $t('chon') " class="w-full w-100 md:w-14rem p-0" >
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
          </BCol>
          <BCol cols="12" lg="6" md="12" sm="12">
            <div class="mb-3">
            <label class="form-label">{{ $t('doituong.quydoisocho') }} (<span class="text-danger">*</span>)</label>
            <input type="text" v-model="data.num_seats" class="form-control" :placeholder=" $t('doituong.quydoisocho') " >
          </div>
          </BCol>
          <BCol cols="12" lg="6" md="12" sm="12">
            <div class="mb-3">
          <label class="form-label">{{ $t('doituong.donvitinh') }} (<span class="text-danger">*</span>)</label>
          <Dropdown v-model="data.unit_price_id" editable :options="unitPrices" filter optionLabel="name" optionValue="code" :placeholder=" $t('chon') " class="w-full w-100 md:w-14rem" >
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
          </BCol>
          <BCol cols="12" lg="6" md="12" sm="12">
            <div class=" mb-3">
            <div class="d-flex align-items-center">
              <InputSwitch v-model="data.record_kpi" class="me-2"/>
              {{ $t('doituong.ghinhankpi') }}
            </div>
          </div>
          <div class=" mb-3">
            <div class="d-flex align-items-center">
              <InputSwitch v-model="data.status" class="me-2"/>
              {{ $t('trangthai') }}
            </div>
          </div>
          </BCol>
          <BCol cols="12" lg="6" md="12" sm="12">
            <div class="mb-3">
            <label class="form-label">{{ $t('doituong.nhomdotuoi') }} (<span class="text-danger">*</span>)</label>
            <Dropdown v-model="data.age_group_id" editable :options="ageGroups" filter optionLabel="name" optionValue="code" :placeholder=" $t('chon') " class="w-full w-100 md:w-14rem" >
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
          </BCol>
        </BRow>
      </div>
    </BCard >
    <div class=" mb-4">
      <router-link :to="{ name: 'settings.price_rule.man' }" class="mx-2 btn btn-outline-primary">
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