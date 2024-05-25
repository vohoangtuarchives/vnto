<script>
import Layout from "@/layouts/main.vue";
import {
    mapGetters
} from 'vuex';
import PageHeader from "@/components/page-header";
import SelectBoxOptions from "@/components/ui/select-box-options"
import SelectAdministrative from "@/components/ui/select-administrative.vue"
import Calendar from 'primevue/calendar';
import CustomersService from "@/services/customers.service";
import {
    ref
} from "vue";

export default {
    
    methods: {

        getCustomersData(page) {
            CustomersService
                .getCustomers(page)
                .then((response) => {
                    this.data = response.data.data.data;
                    this.pagingate = response.data.data;

                })
        },
        addCustomerModal() {},
        
        changeNavLeft(idx) {
            this.activeNavLeft = idx;
            console.log(idx);
            let element = this.$refs['block_'+idx].$el;
          
            const y = element.getBoundingClientRect().top + window.scrollY - document.getElementById("page-topbar").offsetHeight;
            window.scroll({
                top: y,
                behavior: 'smooth'
            });
            return false;
        },
        getAliasName(key) {
            return this
                .getData
                .customer_alias[key];
        },
        getGroupName(key) {
            return this
                .getData
                .customer_group[key];
        },
        getMedalName(key) {
            return this
                .getData
                .customer_medal[key];
        },
        hasCity(x){
            return Object.keys(this.getCity(x)).length;
        }

    },
    watch: {
        selectedProvince: {
        handler() {
            this.fullAddress = this.fullAddressComputed;
        },
        immediate: true // Cập nhật ngay khi selectedProvince thay đổi
        },
        selectedDistrict: {
        handler() {
            this.fullAddress = this.fullAddressComputed;
        },
        immediate: true // Cập nhật ngay khi selectedDistrict thay đổi
        }
    },
    computed: {
        ...mapGetters('data', ['getLocation', 'getData','getCity','getCountry','getCountryById']),
        getDiachiHKTT(){
          
            let address=this.info.location.address!=undefined ? this.info.location.address : '';
            if(this.info.location.country){
                if(this.hasCity(this.info.location.country)){
                    let data;
                    if(this.info.location.city){
                        data = this.$store.getters['data/getCityById'](this.info.location.city);
                        
                    }
                    if(this.info.location.district){
                        data = this.$store.getters['data/getDistrictById'](this.info.location.district);
                       
                    }
                   
                    if(this.info.location.wards){
                         data = this.$store.getters['data/getWardsById'](this.info.location.wards);
                    }
                    try{
                        
                    address+=' ' +(data.path_with_type!=undefined?data.path_with_type:data.name_with_type);
                    }catch(e){
                        e
                    }
                    
                  

                    
                }
            }
            let country = this.$store.getters['data/getCountryById'](this.info.hktt_country);
            
            address+=country!=undefined ?" "+country:'';
            return address;
        }
        
    },
    async mounted() {

     
    function onScroll() {
        var scrollPos = window.scrollY;
        var links = document.querySelectorAll('.nav-menu-staff a');   
        links.forEach(function(link) {
            var offh = document.getElementById("page-topbar").offsetHeight+10;
            var target = document.querySelector(link.getAttribute('href'));
            if (target.offsetTop-offh <= scrollPos && (target.offsetTop-offh + target.offsetHeight) > scrollPos) {
            
                links.forEach(function(link) {
                    link.classList.remove('active');
                });
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        if(document.querySelectorAll('.nav-menu-staff a.active').length==0){
            document.querySelectorAll('.nav-menu-staff a')[0].classList.add('active');
        }
    }
    document.addEventListener('scroll', onScroll);
    

    },
    data() {
        return {

            navLeft: [
                this.$t('thongtincoban'), this.$t('thongtincoban'), this.$t('thongtincongviec'),this.$t('thongtintaikhoan')
            ],
            activeNavLeft: 0,
            date: ref(),
            optionsSource: [],
            customerSourceDataFilter: ref([]),

            pagingate: ref({}),
            modalShow: false,
            loadSuccess: false,
            email:null,
            info:{
                baohiem:{},
                main:{},
                contact:{},
                location:{},
                hotcontact:{},
                current_location:{},
                work:{}
            },
            data: {
                birthdate:null,
                avatar: null,
                tthonnhan: 'bb30f461-3bf5-40c0-847c-f71ac7cc3f5a',
                isAvaiable:false,
            }

        };
    },
    setup() {

        return {

        };
    },
    components: {
        Layout,
        PageHeader,
        SelectBoxOptions,
        Calendar,
        SelectAdministrative
    }
};
</script>
<template>
<Layout>
    <PageHeader title="t-khachhang" pageTitle="Dashboard" />

    <div class=" d-lg-flex gap-1 mx-n4 mt-n4 p-1">
        <div class="email-menu-sidebar">
            <div class="p-4 d-flex flex-column h-100">
            
                <simplebar class="mx-n4 px-4 email-menu-sidebar-scroll" data-simplebar="data-simplebar">

                    <div class="mail-list mt-3">
                        <BNav vertical="vertical" class="nav-menu-staff">
                            <BNavItem :href="'#block_'+index" v-for="(item,index) in navLeft" v-bind:key="index" @click.prevent="changeNavLeft(index)" :active="activeNavLeft==index">{{ item }}</BNavItem>
                        </BNav>
                    </div>

                </simplebar>

            </div>
        </div>
        <!-- end email-menu-sidebar -->

        <div class="w-100">
        <form prevent.submit="onSubmit">

            <BCol md="12">
                <BCard class="mb-1 w-100">
                    <div class="profile-user position-relative d-inline-block mx-auto ">
                        <div class="avatar-wrap">
                            <i class=" ri-user-line"></i>
                            <!-- <img src="assets/images/users/avatar-1.jpg" class="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile-image"> -->
                        </div>
                        <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                            <input id="profile-img-file-input" ref="avatar" type="file" class="profile-img-file-input">
                            <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                                <span class="avatar-title rounded-circle bg-light text-body">
                                    <i class="ri-camera-fill"></i>
                                </span>
                            </label>
                        </div>
                    </div>
                </BCard>
            </BCol>

            <BCol md="12">
              
                <BCard no-body class="mb-2" id="block_0" ref="block_0" headerClass="primary">
                    <template #header>
                        <h3 class="mb-0 text-uppercase fs-4 fw-semibold">{{ $t('thongtincoban') }}</h3>
                    </template>
                    <BCardBody>

                        <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('thongtinchung') }}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('manhanvien')" >
                                    <BFormInput v-model="data.code" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('hovaten')" >
                                    <BFormInput v-model="data.name"  />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('gioitinh')" >
                                    <BFormInput v-model="info.main.gender"  />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaysinh')" >
                                   
                                    <Calendar v-model="data.birthdate" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('noisinh')" >
                                    <BFormInput v-model="info.main.noisinh" />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('nguyenquan')" >
                                    <BFormInput v-model="info.main.nguyenquan"  />
                                </BFormGroup>

                            </BCol>

                            <BCol md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tinhtranghonnhan')" >
                                    <SelectBoxOptions type="tthonnhan" search="false" v-model="info.main.tthonnhan"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('mstcanhan')" >
                                    <BFormInput v-model="info.main.mstcanhan" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('thanhphangiadinh')" >
                                    <SelectBoxOptions type="tpgiadinh" search="false" v-model="info.main.tpgiadinh"   />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('thanhphanbanthan')" >
                                    <SelectBoxOptions type="tpbanthan" search="false" v-model="info.main.tpbanthan"   />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dantoc')" >
                                    <SelectBoxOptions type="dantoc" v-model="info.main.dantoc"   edit="false"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tongiao')" >
                                    <SelectBoxOptions type="tongiao" v-model="info.main.tongiao" search="false" edit="false"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quoctich')" >
                                    <SelectBoxOptions type="quoctich" v-model="info.main.quoctich"   edit="false"/>
                                </BFormGroup>

                            </BCol>

                        </BRow>
                        <h4 class="mb-3 text-uppercase fw-semibold fs-5 mt-3 mt-md-4">{{ $t('cmnd-cancuoc-hochieu')}}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('loaigiayto')" >
                                    <SelectBoxOptions type="loaigiayto" search="false" edit="false" v-model="info.main.loaigiayto" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('socmndcccd')" >
                                    <BFormInput v-model="info.main.cccd" />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaycapccccd')" >
                                    <Calendar v-model="info.main.ngaycapcccd" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('noicapccccd')" >
                                    <BFormInput v-model="info.main.noicapcccd" />
                                   
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngayhethanccccd')" >
                                    <Calendar v-model="info.ngayhethancccd" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>
                               

                            </BCol>

                            <BCol md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('sohochieu')" >
                                    <BFormInput v-model="info.main.sohochieu"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaycaphochieu')" >
                                    <Calendar v-model="info.main.ngaycaphochieu" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>
                                
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('noicaphochieu')" >
                                    <SelectAdministrative v-model="info.main.noicaphochieu" type="country"  />
                                </BFormGroup>
                                
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngayhethanchochieu')" >
                                    <Calendar v-model="info.main.ngayhethanchochieu" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>

                                
                            </BCol>

                        </BRow>
                        
                    </BCardBody>
                </BCard>
                

                <BCard no-body class="mb-2 mb-md-2 " id="block_1" ref="block_1" headerClass="primary">
                    <template #header>
                        <h3 class="mb-0 text-uppercase fs-4 fw-semibold">{{ $t('thongtinlienhe') }}</h3>
                    </template>
                    <BCardBody>

                        <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('phoneemailkhac') }}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dtdidong')" >
                                    <BFormInput v-model="data.dtdidong" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dtcongty')" >
                                    <BFormInput v-model="info.contact.dtcongty" />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dtnharieng')" >
                                    <BFormInput  v-model="info.contact.dtnharieng" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dtkhac')" >
                                    <BFormInput v-model="info.contact.dtkhac" />
                                </BFormGroup>


                                


                            </BCol>

                            <BCol md="6">

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('emailcongty')" >
                                    <BFormInput type="email" v-model="info.contact.emailcongty" />
                                </BFormGroup>


                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('emailcanhan')" >
                                    <BFormInput type="email" v-model="info.contact.emailcanhan" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" label="Facebook" >
                                    <BFormInput v-model="info.contact.facebook" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" label="Skype" >
                                    <BFormInput v-model="info.contact.skype" />
                                </BFormGroup>


                            </BCol>

                        </BRow>
                        <h4 class="mb-3 text-uppercase fw-semibold fs-5 mt-3 mt-md-4">{{ $t('hktt')}}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quocgia')" >
                                    <SelectAdministrative v-model="info.location.country" type="country"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tinhthanh')" >
                                    <SelectAdministrative v-if="hasCity(info.location.country)" v-model="info.location.city" :parent="info.location.country" type="city"  />
                                    <BFormInput v-if="!hasCity(info.location.country)"  />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quanhuyen')" >
                                    <SelectAdministrative v-if="hasCity(info.location.country)" v-model="info.location.district" :parent="info.location.city" type="district"  />
                                    <BFormInput v-if="!hasCity(info.hktt_country)"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('phuongxa')" >
                                    <SelectAdministrative v-if="hasCity(info.location.country)" v-model="info.location.wards" :parent="info.location.district" type="wards"  />
                                    <BFormInput v-if="!hasCity(info.location.country)"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('diachi')" >
                                  
                                    <BFormInput v-model="info.location.address"  />
                                </BFormGroup>
                               

                            </BCol>

                            <BCol md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('sosohokhau')" >
                                    <BFormInput v-model="info.location.sosohokhau"  />
                                </BFormGroup>
                                
                                  <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('masohogiadinh')" >
                                  
                                  <BFormInput v-model="info.location.masohogiadinh"  />
                              </BFormGroup>
                              <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('chuho')" >
                                  
                                  <BFormInput  />
                              </BFormGroup>
                              <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('diachihktt')" >
                                  
                                  <BFormInput disabled v-model="getDiachiHKTT"/>
                              </BFormGroup>
                                
                            </BCol>

                        </BRow>



                        <h4 class="mb-3 text-uppercase fw-semibold fs-5 mt-3 mt-md-4">{{ $t('choohiennay')}}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7 " :label="$t('gionghktt')" >
                                    <BFormCheckbox
                                    id="checkbox-1"
                                    v-model="info.current_location.same"
                                    name="checkbox-1"
                                    value="accepted"
                                    class="mt-2"
                                    
                                    >
                                    
                                    </BFormCheckbox>

                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quocgia')" >
                                    <SelectAdministrative :disabled="info.current_location.same" v-model="info.current_location.country" type="country"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tinhthanh')" >
                                    <SelectAdministrative :disabled="info.current_location.same" v-if="hasCity(info.current_location.country)" v-model="info.current_location.city" :parent="info.current_location.country" type="city"   />
                                    <BFormInput :disabled="info.current_location.same" v-if="!hasCity(info.current_location.country)"  />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quanhuyen')" >
                                    <SelectAdministrative :disabled="info.same" v-if="hasCity(info.current_location.country)" v-model="info.current_location.district" :parent="info.current_location.city" type="district"  />
                                    <BFormInput :disabled="info.current_location.same" v-model="info.current_location.district" v-if="!hasCity(info.current_location.country)"  />
                                </BFormGroup>
                               

                            </BCol>

                            <BCol md="6">
                               
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('phuongxa')" >
                                    <SelectAdministrative :disabled="info.same" v-if="hasCity(info.current_location.country)" v-model="info.current_location.wards" :parent="info.current_location.district" type="wards"  />
                                    <BFormInput :disabled="info.current_location.same" v-if="!hasCity(info.current_location.country)" v-model="info.current_location.wards" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4"  content-cols-sm content-cols-lg="7" :label="$t('diachi')" >
                                  
                                    <BFormInput :disabled="info.current_location.same" v-model="info.current_location.address"  />
                                </BFormGroup>
                              <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('diachicoht')" >
                                  
                                  <BFormInput disabled  />
                              </BFormGroup>
                                
                            </BCol>

                        </BRow>
                        







                        <h4 class="mb-3 text-uppercase fw-semibold fs-5 mt-3 mt-md-4">{{ $t('lienhekhancap')}}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                
                               
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('hovaten')" >
                                   
                                    <BFormInput v-model="info.hotcontact.name"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quanhe')" >
                                    
                                    <SelectBoxOptions type="quanhe" search="false" v-model="info.hotcontact.tthonnhan"  edit="true"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dtdidong')" >
                                    
                                    <BFormInput v-model="info.hotcontact.phone" />
                                </BFormGroup>
                            </BCol>

                            <BCol md="6">
                               
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('dtnr')" >
                                    
                                    <BFormInput v-model="info.hotcontact.dtnr"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('email')" >
                                    
                                    <BFormInput type="email" v-model="info.hotcontact.email"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('diachi')" >
                                    
                                    <BFormInput v-model="info.hotcontact.diachi"/>
                                </BFormGroup>
                            </BCol>

                        </BRow>
                        
                    </BCardBody>
                </BCard>
                

                <BCard no-body class="mb-2 mb-md-2" id="block_2" ref="block_2" headerClass="primary">
                    <template #header>
                        <h3 class="mb-0 text-uppercase fs-4 fw-semibold">{{ $t('thongtincongviec') }}</h3>
                    </template>
                    <BCardBody>

                        <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('thongtinnhanvien') }}</h4>
                        <BRow>
                            <BCol col="12" md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('vitricongviec')" >
                                    <SelectBoxOptions type="vitricongviec" search="false" edit="true" v-model="info.work.vitricongviec"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('chucdanh')" >
                                    <SelectBoxOptions type="chucdanh" search="false" edit="true" v-model="info.work.chucdanh"  />
                                </BFormGroup>

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('cap')" >
                                    <SelectBoxOptions type="cap" search="false" edit="true" v-model="info.work.cap"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('bac')" >
                                    <SelectBoxOptions type="bac" search="false" edit="true" v-model="info.work.bac"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('trangthailaodong')" >
                                    <SelectBoxOptions type="trangthailaodong" search="false" edit="true" v-model="info.work.trangthailaodong"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tinhchatlaodong')" >
                                    <SelectBoxOptions type="tinhchatlaodong" search="false" edit="true" v-model="info.work.tinhchatlaodong"  />
                                </BFormGroup>


                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('diadiemlaodong')" >
                                    <BFormInput v-model="info.work.address" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('sosoquanlylaodong')" >
                                    <BFormInput  v-model="info.work.soquanly"/>
                                </BFormGroup>


                                


                            </BCol>

                            <BCol md="6">

                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('loaihopdong')" >
                                    <SelectBoxOptions type="loaihopdong" search="false" edit="true" v-model="info.loaihopdong"  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('machamcong')" >
                                    <BFormInput  />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngayhocviec')" >
                                    <Calendar v-model="info.ngayhocviec" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaythuviec')" >
                                    <Calendar v-model="info.ngaythuviec" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaychinhthuc')" >
                                    <Calendar v-model="info.ngaychinhthuc" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaynghihuudukien')" >
                                    <Calendar v-model="info.ngaynghihuudukien" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quanlytructiep')" >
                                    <!-- <SelectBoxOptions type="loaihopdong" search="false" edit="true" v-model="data.quanlytructiep"  /> -->
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('quanlygiantiep')" >
                                    <!-- <SelectBoxOptions type="loaihopdong" search="false" edit="true" v-model="data.tinhchatlaodong"  /> -->
                                </BFormGroup>
                            </BCol>

                        </BRow>
                     

                        
                        
                    </BCardBody>

                    <BCardBody>

                    <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('thongtinnghiviec') }}</h4>
                    <BRow>
                        <BCol col="12" md="6">
                            
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('nguoiduyet')" >
                                <!-- <SelectBoxOptions type="chucdanh" search="false" edit="true" v-model="data.chucdanh"  /> -->
                            </BFormGroup>

                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ykiendonggop')" >
                                <BFormTextarea
                               
                                v-model="info.nghiviec_ykiendonggop"
                              
                                rows="3"
                                max-rows="6"
                            />
                            </BFormGroup>
                          

                        </BCol>

                        <BCol md="6">

                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('lydonghi')" >
                                <SelectBoxOptions type="lydonghi" search="false" edit="true" v-model="info.lydonghi"  />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaynghiviec')" >
                                <Calendar v-model="info.ngaynghiviec" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                            </BFormGroup>
                           
                        </BCol>

                    </BRow>

                    <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('thongtinluong') }}</h4>
                    <BRow>
                        <BCol col="12" md="6">
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('bacluong')" >
                                <BFormInput type="number" v-model="info.bacluong" />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('luongcoban')" >
                                <BFormInput  v-currency v-model="info.lungcoban" />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('luongdongbhxh')" >
                                <BFormInput  v-currency v-model="info.luongdongbhxh" />
                            </BFormGroup>
                     

                        </BCol>

                        <BCol md="6">

                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tongluong')" >
                                <BFormInput  v-currency disabled v-model="info.tongluong"/>
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tknganhang')" >
                                <BFormInput v-model="info.tknganhang" />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('nganhang')" >
                                <BFormInput v-model="info.nganhang"/>
                            </BFormGroup>
                        </BCol>

                    </BRow>



                    <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('thongtinbaohiem') }}</h4>
                    <BRow>
                        <BCol col="12" md="6">
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('ngaythamgiabh')" >
                                <Calendar v-model="info.baohiem.ngaythamgia" showIcon iconDisplay="input"  class="w-100 cursor-pointer"/>
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tiledongbh')" >
                                <BFormInput v-model="info.baohiem.tiledong" type="number"/>
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('sosobhxh')" >
                                <BFormInput v-model="info.baohiem.soso" />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('masobhxh')" >
                                <BFormInput v-model="info.baohiem.maso"/>
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('thamgiabhxh')" >
                                <SelectBoxOptions type="thamgiabhxh" search="false" edit="true" v-model="info.baohiem.thamgia"  />
                            </BFormGroup>

                        </BCol>

                        <BCol md="6">

                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('tinhcap')" >
                                <SelectAdministrative  v-model="info.baohiem.city" parent="1" type="city"  />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('sothebhyt')" >
                                <BFormInput v-model="info.baohiem.sothe"  />
                            </BFormGroup>
                            <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('noidkkcb')" >
                                <BFormInput v-model="info.baohiem.noidk"/>
                            </BFormGroup>
                        </BCol>

                    </BRow>


                    </BCardBody>
                </BCard>











                <BCard no-body class="mb-2 mb-md-2" id="block_3" ref="block_3" headerClass="primary">
                    <template #header>
                        <h3 class="mb-0 text-uppercase fs-4 fw-semibold">{{ $t('thongtintaikhoan') }}</h3>
                    </template>
                    <BCardBody>

                       
                        <BRow>
                            <BCol col="12" md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('chophepdangnhap')" >
                                    <BFormCheckbox
                                    id="checkbox-1"
                                   
                                    name="checkbox-1"
                                    value="accepted"
                                    class="mt-2"
                                    v-model="data.isAvaiable"
                                    
                                    >
                                    
                                    </BFormCheckbox>
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('emaildangnhap')" >
                                    <BFormInput type="email" :disabled="!data.isAvaiable" v-model="email"/>
                                </BFormGroup>

                               


                                


                            </BCol>

                            <BCol md="6">
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('matkhau')" >
                                    <BFormInput type="password" :disabled="!data.isAvaiable" v-model="data.password" />
                                </BFormGroup>
                                <BFormGroup class="mb-3" id="fieldset-horizontal" label-cols-sm="4" label-cols-lg="4" content-cols-sm content-cols-lg="7" :label="$t('nhaplaimatkhau')" >
                                    <BFormInput type="password" :disabled="!data.isAvaiable" v-model="data.repeatpassword" />
                                </BFormGroup>
                                
                            </BCol>

                        </BRow>
                     

                        
                        
                    </BCardBody>

                    <BCardBody v-if="data.isAvaiable">

                    <h4 class="mb-3 mb-md-4 text-uppercase fw-semibold fs-5">{{ $t('thongtinquyen') }}</h4>
                    <BRow>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>

                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                        <BCol md="3" col="6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="SwitchCheck1" checked>
                                <label class="form-check-label" for="SwitchCheck1">Switch Default</label>
                            </div>
                        </BCol>
                    </BRow>



                    </BCardBody>
                </BCard>
                
            </BCol>
        </form>
        </div>

    </div>

</Layout>
</template>

<style>
.select2-container--default .select2-results__option[aria-selected=true] {
    background-color: #ccc;
}

.select2-container .select2-selection--multiple .select2-selection__choice__remove {
    margin-right: 1px;
    padding: 0px 4px;
}

.select2-container .select2-selection--multiple .select2-selection__rendered {
    padding: 1px 7px
}
</style>
