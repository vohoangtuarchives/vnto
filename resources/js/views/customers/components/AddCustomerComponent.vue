<script>
import {
    useVuelidate
} from '@vuelidate/core'
import {
    required,
    helpers
} from '@vuelidate/validators'
import {
    useStore
} from 'vuex'
import {
    computed,
    ref,
    watch
} from 'vue'
import CustomersService from "@/services/customers.service";
export default {
    name: "AddCustomerComponent",
    data() {
        return {
            optionGroupSelected: null,
            optionGroupCustomers: [],
            optionNameSelected: null,
            optionNameCustomers: [],
            staffs: this.data.customerSource,
            status: true,
            errors_msg: [],
            success_msg: '',
            isLoading: false,
            dataLoaiKhach: []
        };
    },
    methods: {
        close() {
            this
                .$vbsModal
                .close();
        },
        async createMember() {
            this.success_msg='';
            if (!this.isLoading) {
                this.isLoading = true;
                this.errors_msg = [];
                const result = await this.v$.$validate()
                console.log(result);
                if (!result) {
                    let that = this;
                    this.v$.$errors.forEach(function (error) {
                        that.errors_msg.push(error.$message);
                    });
                    this.isLoading = false;
                    return
                }  
                this.isLoading = false;
                CustomersService.create(this.dataInsert).then((rs) => {
                  
                    if (rs.data.status == false) {
                        this.errors_msg.push(rs.data.data);
                    } else {
                        if (!this.id) {
                            this.success_msg = this.$t('themmoithanhcong');
                        } else {
                            this.success_msg = this.$t('capnhatthanhcong');
                        }
                        setTimeout(() => {
                            this.$emit("onUpdate");
                            this.close();
                        }, (1500));
                    }
                    this.isLoading = false;
                });
            }
            return false;
        },
        changeCountrySelectBox(x) {
            console.log(x);
        }
    },
    validations() {
        return {
            dataInsert: {
                name:{
                    required: helpers.withMessage(this.$t('notempty',{'name':this.$t('hoten')}), required)
                },
                phone:{
                    required: helpers.withMessage(this.$t('notempty',{'name':this.$t('dienthoai')}), required)
                },
                source_id:{
                    required: helpers.withMessage(this.$t('notempty_select',{'name':this.$t('nguon')}), required)
                },
                staff_id:{
                    required: helpers.withMessage(this.$t('notempty_select',{'name':this.$t('nvphutrach')}), required)
                }
                
            },
            // target: {
            //     required:helpers.withMessage(this.$t('notempty'), required)
            // }
        }
    },
    computed: {
    },
    setup() {
        const store = useStore();
        const optionsCountry = Object.entries(computed(() => store.getters['data/getCountry']).value).map(([id, data]) => {
            return {
                id,
                text: data.name
            }
        })
        const optionsProvince = ref([]);
        const optionsDistrict = ref([]);
        const dataInsert = ref({
            country: null,
            province: null,
            district: null,
            address: null,
            company_name:null,
            tax_code:null,
            brand_name:null,
            invoice_address:null,
            alias: null,
            name: null,
            phone:null,
            source_id:null,
            staff_id: null,
            medal_id: null,
            type_id: null,
            birthdate: null,
            status: true,
        });
        watch(() => dataInsert.value.country, (newVal) => {
            optionsDistrict.value = [];
            optionsProvince.value = Object.entries(store.getters['data/getCity'](newVal)).map(([id, data]) => {
                return {
                    id,
                    text: data.name_with_type
                };
            });
        });
        watch(() => dataInsert.value.province, (newVal) => {
            optionsDistrict.value = Object.entries(store.getters['data/getDistrict'](newVal)).map(([id, data]) => {
                return {
                    id,
                    text: data.name_with_type
                };
            });
        });
        
        return {
            v$: useVuelidate(),
            optionsCountry,
            optionsProvince,
            optionsDistrict,
            dataInsert
        }
    },
    mounted() {
        var keys = Object.keys(this.data.data.customer_group);
        keys.forEach(value => {
            this.optionGroupCustomers.push({
                value: value,
                text: this.data.data.customer_group[value]
            });
        });
        keys = Object.keys(this.data.data.customer_alias);
        keys.forEach(value => {
            this.optionNameCustomers.push({
                value: value,
                text: this.data.data.customer_alias[value]
            });
        });
        const self = this;
        this.data.customerFilter.type.map(function (item) {
            self.dataLoaiKhach.push({
                value: item.id,
                text: item.name
            });
        })
     
        if(Object.keys(this.data.customerSource).length){
            this.dataInsert.source_id = (this.data.customerSource[0].id);
        }
        if(Object.keys(this.data.data.customer_medal).length){
            this.dataInsert.medal_id = Object.keys(this.data.data.customer_medal)[0];
        }
        if(Object.keys(this.dataLoaiKhach).length){
            this.dataInsert.type_id = this.dataLoaiKhach[0].value;
        }
        this.dataInsert.alias = this.optionNameCustomers[0].value;
        this.dataInsert.group_id = this.optionGroupCustomers[0].value;



        console.log("this.data.data.customer_medal",this.data.data.customer_medal);
    },
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
        title:{
            type:String,
            default:""
        }
    }
};
</script>
<template>
<div>
    <div class="modal-header p-3 bg-info-subtle">
        <h5 class="modal-title">{{ this.title }}</h5>
        <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
    </div>
    <form @submit.prevent="createMember">
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
            <div class="form-group mb-2">
                <b-form-group :label="this.$t('nhomkhachhang')">
                    <b-form-radio-group id="checkbox-group-1" v-model="dataInsert.group_id" :options="optionGroupCustomers" ></b-form-radio-group>
                </b-form-group>
            </div>
            <div v-if="dataInsert.group_id=='enterprise' || dataInsert.group_id=='agency'" class="sub_group_option ">
                <div class="form-group js_form_select_company">
                    <label>Doanh nghiệp/Đối tác</label>
                    
                </div>
                <div v-if="dataInsert.group_id=='enterprise'" class="form-group js_form_add_company bg-light p-3 rounded-1">
                    <BRow>
                    
                        <BCol md="12">
                            <h6 class=" text-uppercase">{{ $t('thongtindoanhnghiep') }}</h6>
                            <BCol md="12">
                                <BFormGroup :label="this.$t('tencongty')"  class="mb-2">
                                    <BFormInput v-model="dataInsert.company_name" />
                                </BFormGroup>
                            </BCol>
                            
                        </BCol>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('masothue')"  class="mb-2">
                                <BFormInput v-model="dataInsert.tax_code" />
                            </BFormGroup>
                        </BCol>

                        <BCol md="6">
                            <BFormGroup :label="this.$t('tenthuonghieu')"  class="mb-2">
                                <BFormInput v-model="dataInsert.brand_name" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="12">
                            <BFormGroup :label="this.$t('diachihoadon')"  class="mb-2">
                                <BFormInput v-model="dataInsert.invoice_address" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="12">
                            <p class="m-0 text-end">
                                <button type="button" class="js_button_hide_company btn btn-sm btn-danger"><i class="las la-angle-left"></i> Quay lại</button>
                            </p>
                        </BCol>
                       
                        
                    </BRow>
                </div>
            </div>
            <hr class="border-bottom border-bottom-dashed my-2">
            <b-form-group :label="this.$t('thongtinlienhe')">
                <b-form-radio-group id="checkbox-group-1" v-model="dataInsert.alias" :options="optionNameCustomers"  ></b-form-radio-group>
            </b-form-group>
            <BRow class="my-2">
                <BCol md="12">
                    <BFormGroup :label="this.$t('hoten')" class="mb-2">
                        <BFormInput v-model="dataInsert.name"  />
                    </BFormGroup>
                </BCol>
                <BCol md="6">
                    <BFormGroup :label="this.$t('dienthoai')"  class="mb-2">
                        <BFormInput v-model="dataInsert.phone" />
                    </BFormGroup>
                </BCol>
                <BCol md="6">
                    <BFormGroup  label="Email" class="mb-2">
                        <BFormInput v-model="dataInsert.email" type="email" />
                    </BFormGroup>
                </BCol>
                <BCol md="6">
                    <BFormGroup :label="this.$t('nguon')" class="mb-2">
                        <Select2 :options="data.customerSource" v-model="dataInsert.source_id" />
                    </BFormGroup>
                </BCol>
                <BCol md="6">
                    <BFormGroup :label="this.$t('nvphutrach')" class="mb-2">
                        <Select2 :options="staffs" v-model="dataInsert.staff_id"  />
                    </BFormGroup>
                </BCol>
                
                <div class="collapsed" id="cus_exp">
                    <BRow>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('phanhang')" class="mb-2">
                                <BFormSelect v-model="dataInsert.medal_id" :options="this.data.data.customer_medal" class="mt-3" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('loaikhach')" class="mb-2">
                                <BFormSelect v-model="dataInsert.type_id" :options="this.dataLoaiKhach" class="mt-3" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('sinhnhat')" class="mb-2">
                                <Datepicker v-model="dataInsert.birthdate" format="dd/MM/yyyy" :enable-time-picker="false" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('quocgia')" class="mb-2">
                                <Select2 :options="optionsCountry" v-model="dataInsert.country" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('thanhpho')" class="mb-2">
                                <Select2 :options="optionsProvince" v-model="dataInsert.province" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="6">
                            <BFormGroup :label="this.$t('quanhuyen')" class="mb-2">
                                <Select2 :options="optionsDistrict" v-model="dataInsert.district" />
                            </BFormGroup>
                        </BCol>
                        <BCol md="12">
                            <BFormGroup :label="this.$t('diachi')" class="mb-2">
                                <BFormInput v-model="dataInsert.address" />
                            </BFormGroup>
                        </BCol>
                  
                    </BRow>
                </div>
            </BRow>
            <div class="mb-3">
                <div class="form-check form-switch" dir="ltr">
                    <input type="checkbox" class="form-check-input" id="customSwitchsizesm" v-model="dataInsert.status">
                    <label class="form-check-label" for="customSwitchsizesm">{{ $t('khadung') }}</label>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <BButton :loading="isLoading" type="submit" class="btn btn-success"> {{$t('them')}}</BButton>
            <button type="button" class="btn btn-danger" @click="close"> <i class="ri-close-line"></i>{{ $t('dong') }} </button>
        </div>
    </form>
</div>
</template>
