<script>
import Layout from "@/layouts/main.vue";
import {
    mapGetters
} from 'vuex';
import PageHeader from "@/components/page-header";
// import {
//     ModalSize
// } from "vue-bs-modal";
import CustomersService from "@/services/customers.service";
import SettingService from "@/services/setting.service";
import {
    ref
} from "vue";
import {
    useRoute
} from 'vue-router';
export default {
    watch: {

        // 'currentPage': {
        //     handler(newId, oldId) {
        //         if (newId != oldId && oldId != undefined) {
        //             this
        //                 .$router
        //                 .replace({
        //                     query: {
        //                         page: newId
        //                     }
        //                 })
        //             this.getData(newId);
        //         }
        //     },
        //     immediate: true // Load data initially if id exists
        // }
    },
    methods: {
       
        getCustomersData(page) {
            CustomersService
                .getCustomers(page)
                .then((response) => {
                    this.data = response.data.data.data;
                    this.pagingate = response.data.data;
                    this.currentPage = this.pagingate.current_page;
                })
        },
        addCustomerModal() {
           
        },
        getStatusInfo(status) {
            const text = status ?
                this.$t('khadung') :
                this.$t('khongkhadung');
            const className = status ?
                'badge border border-success  text-success' :
                'badge border border-danger  text-danger';
            return {
                text,
                className
            };
        },
        getAliasName(key){
            return this.getData.customer_alias[key];
        },
        getGroupName(key){
            return this.getData.customer_group[key];
        },
        getMedalName(key){
            return this.getData.customer_medal[key];
        },
        getSourceName(key){
            let foundItem = this.optionsSource.find(item => item.id === key);
            return foundItem ? foundItem.text : null;
        },
        getTypeName(key){
            let foundItem = this.customerSourceDataFilter.type.find(item => item.id === key);
            return foundItem ? foundItem.name : null;
        },
    },
    computed: {
        ...mapGetters('data', ['getLocation', 'getData'])
    },
    async mounted() {
        this.customerSourceDataFilter = await SettingService.getCustomerData();
        var self = this;
        this.customerSourceDataFilter.source.map(function(value) {
            self.optionsSource.push({id:value.id,text:value.name});
        });
        this.getCustomersData();
    },
    data() {
        return {
            // currentPage : ref(this.$route.query.page),
            date: ref(),
            optionsSource:[],
            customerSourceDataFilter: ref([]),
            data: ref([]),
            pagingate: ref({}),
            modalShow: false,
            loadSuccess: false,
            titleFormGroup: this.$t('t-themmoidanhmuc')
        };
    },
    setup() {
        const route = useRoute();
        const currentPage = ref(parseInt(route.query.page) || 1);

        return {
            currentPage
        };
    },
    components: {
        Layout,
        PageHeader
    }
};
</script>
<template>
<Layout>
    <PageHeader title="t-khachhang" pageTitle="Dashboard" />
    <BRow>
        <BCol cols="12">
            <BCard no-body="no-body">
            
                <BCardBody>
                    <BRow>
                        <BCol md="3">
                            <BCard class="bg-primary m-md-0" no-body="no-body">
                                <BCardBody>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="text-uppercase fw-bold text-white-50 text-truncate mb-2">Doanh thu dưới 50Tr</p>
                                            <h4 class="fw-bold ff-secondary text-white mb-0">22 khách</h4>
                                        </div>
                                    </div>
                                </BCardBody>
                            </BCard>
                        </BCol>
                        <BCol md="3">
                            <BCard class="bg-secondary m-md-0" no-body="no-body">
                                <BCardBody>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="text-uppercase fw-bold text-white-50 text-truncate mb-2">Doanh thu dưới 50Tr</p>
                                            <h4 class="fw-bold ff-secondary text-white mb-0">22 khách</h4>
                                        </div>
                                    </div>
                                </BCardBody>
                            </BCard>
                        </BCol>
                        <BCol md="3">
                            <BCard class="bg-success m-md-0" no-body="no-body">
                                <BCardBody>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="text-uppercase fw-bold text-white-50 text-truncate mb-2">Doanh thu dưới 50Tr</p>
                                            <h4 class="fw-bold ff-secondary text-white mb-0">22 khách</h4>
                                        </div>
                                    </div>
                                </BCardBody>
                            </BCard>
                        </BCol>
                        <BCol md="3">
                            <BCard class="bg-info m-md-0" no-body="no-body">
                                <BCardBody>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="text-uppercase fw-bold text-white-50 text-truncate mb-2">Doanh thu dưới 50Tr</p>
                                            <h4 class="fw-bold ff-secondary text-white mb-0">22 khách</h4>
                                        </div>
                                    </div>
                                </BCardBody>
                            </BCard>
                        </BCol>
                       
                    </BRow>
                </BCardBody>
            </BCard>
            <BCard>
                <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
                    <BCardTitle class="m-0">{{ $t('danhsachkhachhang') }}</BCardTitle>
                    <div class="flex-shrink-0">
                        <router-link :to="{name:'staff.create'}" class="btn btn-sm btn-success" >
                            <i class="ri-add-fill me-1 align-bottom" data-toggle="tooltip" title="" data-bs-original-title="Thêm mới" aria-label="Thêm mới"></i>
                            {{ $t('themmoi') }}
                        </router-link>
                    </div>
                </BCardHeader>
                <BCardBody>
                    <div class="table- table-card ">
                        <table class="table table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th>{{ $t('makhachhang') }}</th>
                                    <th>{{$t('hoten')}}</th>
                                    <th>{{$t('lienhe')}}</th>
                                    <th>{{$t('phannhom')}}</th>
                                    <th>{{$t('dienthoai')}}</th>
                                    <th>{{$t('phanhang')}}</th>
                                    <th>{{$t('loaikhach')}}</th>
                                    <th>{{$t('nguon')}}</th>
                                    <th>{{$t('nvphutrach')}}</th>
                                    <th>{{$t('tongdon')}}</th>
                                    <th>{{$t('doanhthu')}}</th>
                                    <th width="70px" class="middle text-end">{{$t('tacvu')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in data" v-bind:key="item.id">
                                    <td><span class="fw-medium">{{ item.code}}</span></td>
                                    <td class="fw-medium">({{ getAliasName(item.alias) }}) {{ item.name }}</td>
                                    <td>{{ dateFormat(item.created_at) }}</td>
                                    <td>{{ getGroupName(item.group_id) }}</td>
                                    <td>{{ item.phone }}</td>
                                    <td>{{ getMedalName(item.medal_id)}}</td>
                                    <td>{{ getTypeName(item.type_id) }}</td>
                                    <td>{{ getSourceName(item.source_id) }}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  
                                    
                                    
                                    <td class="middle text-end">
                                        <div class="dropdown">
                                            <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                <li>
                                                    <a class="dropdown-item" @click="addSourceModal(item)" href="#">{{$t('capnhat')}}</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#">{{$t('xoa')}}</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <BPagination v-model="currentPage" :total-rows="pagingate.last_page" :per-page="1" />
                    </div>
                </BCardBody>
            </BCard>
        </BCol>
    </BRow>
</Layout>
</template>
