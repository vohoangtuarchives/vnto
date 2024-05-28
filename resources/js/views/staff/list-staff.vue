<script>
import Layout from "@/layouts/main.vue";
import {
    mapGetters
} from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import PageHeader from "@/components/page-header";
import UserService from "@/services/user.service";

//import SettingService from "@/services/setting.service";
import {
    ref
} from "vue";
import {
    useRoute
} from 'vue-router';



export default {
   
    methods: {
       
       
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
        getUserGender(gender){
            let result = '';
            try{
                result = this.getGender(gender);
            }catch($e){
                result = '';
            }
            return result;
        },
        async getUsers(){
            this.addLoading(this.$refs.table_list);
            
            const response = await UserService.getList();
            
             if(response.data.success){
                
                if(response.data.data.length){
                    this.customers = response.data.data;
                    
                    
                }
             }

             this.removeLoading(this.$refs.table_list);
            
        }
    },
    computed: {
        ...mapGetters('data', ['getLocation', 'getData'])
    },
    async mounted() {
        
  
        this.getUsers();

                
        const initFilters = () => {
            this.filters.value = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                representative: { value: null, matchMode: FilterMatchMode.IN },
                date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
                verified: { value: null, matchMode: FilterMatchMode.EQUALS }
            };
        };

        initFilters();





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
            titleFormGroup: this.$t('t-themmoidanhmuc'),

            
            selectedCustomers: ref(),
            customers: ref(),
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                representative: { value: null, matchMode: FilterMatchMode.IN },
                status: { value: null, matchMode: FilterMatchMode.EQUALS },
                verified: { value: null, matchMode: FilterMatchMode.EQUALS }
            },
            representatives: [
                { name: 'Amy Elsner', image: 'amyelsner.png' },
                { name: 'Anna Fali', image: 'annafali.png' },
                { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
                { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
                { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
                { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
                { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
                { name: 'Onyama Limba', image: 'onyamalimba.png' },
                { name: 'Stephen Shaw', image: 'stephenshaw.png' },
                { name: 'XuXue Feng', image: 'xuxuefeng.png' }
            ],
            statuses: ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'],
            loading: true,





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
        PageHeader,
        DataTable,
        Column,

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
                    <div class="table-card" ref="table_list">
                        <DataTable v-model:filters="filters" v-model:selection="selectedCustomers" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="menu"
            :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']">
            <template #header>
                <div class="flex justify-content-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No customers found. </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="name" :header="$t('manhanvien')" sortable style="min-width: 5rem">
                <template #body="{ data }">
                    {{ data.code }}
                </template>
                
            </Column>
            <Column :header="$t('hovaten')" sortable sortField="country.name" filterField="country.name" style="min-width: 14rem">
                <template #body="{ data }">
                   
                        <span>{{ data.name }}</span>
                   
                </template>
            </Column>
            <Column field="name" :header="$t('gioitinh')" sortable >
                <template #body="{ data }">
                    {{ checkVariable("info.main.gender",data)?getUserGender(data.info.main.gender):'' }}
                </template>
                
            </Column>
            <Column field="name" :header="$t('ngaysinh')" sortable >
                <template #body="{ data }">
                    {{ data.birthday }}
                </template>
                
            </Column>
            <Column field="name" :header="$t('dienthoai')" sortable >
                <template #body="{ data }">
                    {{ data.phone }}
                </template>
                
            </Column>
            <Column field="name" header="Email" sortable >
                <template #body="{ data }">
                    {{ data.email }}
                </template>
                
            </Column>
            <Column field="name" :header="$t('vitricongviec')" sortable >
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                
            </Column>
            <Column field="name" :header="$t('donvicongtac')" sortable >
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                
            </Column>
            <Column field="name" :header="$t('ngaythuviec')" sortable >
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                
            </Column>
            <Column  style="width: 30px">
              <template #body="{data}" >
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li>
                        <router-link :to="{'name':'information.add.job.description' ,params:{id:data.id} }" class="dropdown-item">
                            <i class="ri-file-edit-fill align-bottom me-1 text-secondary "></i>{{$t('capnhat-mota-congviec')}}
                        </router-link>
                    </li>
                    <!-- <li><a class="dropdown-item btn" @click="deleteItem(data.id)"><i class="ri-delete-bin-line me-1 text-danger "></i>{{$t('xoa')}}</a></li> -->
                  </ul>
                </div>
              </template>
            </Column>
        </DataTable>


<Style>
    style="min-width: 14rem"
</Style>


                    </div>
                </BCardBody>
            </BCard>
        </BCol>
    </BRow>
</Layout>
</template>
