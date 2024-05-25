<script>
import Layout from "@/layouts/main.vue";
import {
    mapGetters
} from 'vuex';
import PageHeader from "@/components/page-header";
import AddCustomerComponent from "./components/AddCustomerComponent";
import {
    ModalSize
} from "vue-bs-modal";
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
            this
                .$vbsModal
                .open({
                    content: AddCustomerComponent,
                    size: ModalSize.LARGE,
                    contentProps: {
                        data: {customerSource:this.optionsSource,location:this.getLocation,data:this.getData,customerFilter:this.customerSourceDataFilter},
                        title:this.$t('themmoikhachhang')
                    },
                    contentEmits: {
                        onUpdate: () => this.getCustomersData()
                    },
                    backgroundScrolling: true,
                    staticBackdrop: true
                });
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
                <BCardHeader header-tag="nav">
                    <BNav card-header="card-header" tabs="tabs" class="nav-tabs-custom border-bottom-0">
                        <BNavItem active="active">{{ $t('cuatoi')}}</BNavItem>
                        <BNavItem>{{ $t('tatca')}}</BNavItem>
                    </BNav>
                </BCardHeader>
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
                        <BRow>
                            <BCol md="7">
                                <div class="form-group mt-md-3">
                                    <div class="d-flex flex-wrap gap-2">
                                        <a href="" type="button" class="btn btn-soft-danger position-relative">Chưa liên hệ
                                            <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">28</span>
                                        </a>
                                        <a href="" type="button" class="btn btn-soft-warning position-relative">3 ngày chưa liên hệ
                                            <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-warning">0</span>
                                        </a>
                                        <a href="" type="button" class="btn btn-soft-secondary position-relative">30 ngày chưa liên hệ
                                            <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-secondary">0</span>
                                        </a>
                                        <a href="" type="button" class="btn btn-soft-dark position-relative">90 ngày chưa liên hệ
                                            <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-dark">0</span>
                                        </a>
                                    </div>
                                </div>
                            </BCol>
                            <BCol md="5">
                                <div class="form-group mt-md-3">
                                    <div class="d-flex flex-wrap gap-2">

                                        <a type="button" v-for="value in customerSourceDataFilter.type" v-bind:key="value.id" class="btn btn-outline-info position-relative">{{value.name}}
                                            <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-info">0</span>
                                        </a>
                                    </div>
                                </div>
                            </BCol>
                        </BRow>
                        <div class="form-group">
                            <ul class="nav nav-tabs tab-filter" style="border-top: 1px solid #f4f4f4">
                                <li>
                                    <a href="javascript:void(0)" class="font-weight-500">
                                        <i class="fas fa-sliders-h mr-1"></i>
                                        Phân nhóm
                                    </a>
                                </li>

                                <li>
                                    <a href="/admin/customer?role=owner&amp;sub_group=" class="active">
                                        <i class="" aria-hidden="true"></i>
                                        Tất cả
                                    </a>
                                    <input type="hidden" name="sub_group" value=""></li>
                                <li v-for="(value,key) in this.getData.customer_group" v-bind:key="key">
                                    <a href="" class="">
                                        {{value}}
                                    </a>
                                </li>

                            </ul>
                            <ul class="nav nav-tabs tab-filter">
                                <li>
                                    <a href="javascript:void(0)" class="font-weight-500">
                                        <i class="fas fa-sliders-h mr-1"></i>
                                        Phân hạng
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;medal=" class="active">
                                        <i class="" aria-hidden="true"></i>
                                        Tất cả
                                    </a>
                                    <input type="hidden" name="medal" value=""></li>

                                <li v-for="(value,key) in this.getData.customer_medal" v-bind:key="key">
                                    <a href="/admin/customer?role=owner&amp;sub_group=personal" class="">
                                        {{value}}
                                    </a>
                                </li>

                            </ul>
                            <ul class="nav nav-tabs tab-filter">
                                <li>
                                    <a href="javascript:void(0)" class="font-weight-500">
                                        <i class="fas fa-sliders-h mr-1"></i>
                                        Loại khách hàng
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;type_id=" class="active">
                                        <i class="" aria-hidden="true"></i>
                                        Tất cả
                                    </a>
                                    <input type="hidden" name="type_id" value=""></li>
                                <li v-for="value in customerSourceDataFilter.type" v-bind:key="value.id">
                                    <a href="/admin/customer?role=owner&amp;type_id=1" class="">
                                        {{value.name}}
                                    </a>
                                </li>

                            </ul>
                            <ul class="nav nav-tabs tab-filter">
                                <li>
                                    <a href="javascript:void(0)" class="font-weight-500">
                                        <i class="fas fa-sliders-h mr-1"></i>
                                        Doanh thu
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;revenue_range=" class="active">
                                        <i class="" aria-hidden="true"></i>
                                        Tất cả
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;revenue_range=0_50000000" class="">
                                        Dưới 50 triệu
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;revenue_range=50000000_200000000" class="">
                                        Từ 50 - 200 triệu
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;revenue_range=200000000_500000000" class="">
                                        Từ 200 - 500 triệu
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;revenue_range=500000000" class="">
                                        Trên 500 triệu
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" onclick="toggleRange(this)">Tùy chỉnh</a>
                                </li>
                                <li class="range-total js_range_total d-none">
                                    <div class="d-flex gap-2">
                                        <input type="text" class="form-control form-control-sm rounded-pill border-dashed" onkeyup="number_format(this)" placeholder="Từ" name="revenue_min" value="">
                                        <input type="text" class="form-control form-control-sm rounded-pill border-dashed" onkeyup="number_format(this)" placeholder="Đến" name="revenue_max" value=""></div>
                                </li>
                            </ul>
                            <ul class="nav nav-tabs tab-filter">
                                <li>
                                    <a href="javascript:void(0)" class="font-weight-500">
                                        <i class="fas fa-sliders-h mr-1"></i>
                                        Liên hệ gần nhất
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;contacted_at=" class="active">
                                        <i class="" aria-hidden="true"></i>
                                        Tất cả
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;contacted_at=11/03/2024 - 11/03/2024" class="">
                                        Hôm nay
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;contacted_at=10/03/2024 - 10/03/2024" class="">
                                        Hôm qua
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;contacted_at=08/03/2024 - 11/03/2024" class="">
                                        Trong vòng 3 ngày
                                    </a>
                                </li>
                                <li>
                                    <a href="/admin/customer?role=owner&amp;contacted_at=04/03/2024 - 11/03/2024" class="">
                                        Trong vòng 7 ngày
                                    </a>
                                </li>
                                <li>
                                    <input type="text" name="contacted_at" value="Tùy chọn" class="form-control date_range_filter_option" autocomplete="off" readonly="" style="color: #3c4b64; background: #fff;border: none;outline: none;cursor: pointer;width: 180px;font-size: 13px;height: 29px"></li>
                            </ul>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group m-0 reset-input">
                                    <label>Thông tin liên hệ</label>
                                    <input type="text" name="contact_info" value="" class="form-control" placeholder="Nhập Tên, Email hoặc SDT">
                                    <span class="fas fa-times reset" aria-hidden="true" onclick="resetInput(this)"></span>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group m-0 reset-input">
                                    <label>Mã khách</label>
                                    <input type="text" name="code" value="" class="form-control" placeholder="Nhập mã">
                                    <span class="fas fa-times reset" aria-hidden="true" onclick="resetInput(this)"></span>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group m-0 reset-input">
                                    <label>Ngày tạo</label>
                                    <Datepicker v-model="date" range="range" :enable-time-picker="false" />
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group m-0">
                                    <label>Sale phụ trách</label>
                                    <Select2  :settings="{ settingOption: value, settingOption: value }" @change="myChangeEvent($event)" @select="mySelectEvent($event)" />
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group m-0">
                                    <label>{{ $t('nguon') }}}</label>
                                    <Select2 :options="optionsSource" :settings="{ settingOption: value, settingOption: value }" @change="myChangeEvent($event)" @select="mySelectEvent($event)" />
                                </div>
                            </div>
                            <div class="col-md-1">
                                <div class="form-group m-0 d-grid">
                                    <label>Tìm kiếm</label>
                                    <input type="hidden" name="role" id="role" value="owner">
                                    <button type="submit" class="btn btn-md btn-primary btn-block">
                                        <i class="ri-search-line"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </BRow>
                </BCardBody>
            </BCard>
            <BCard>
                <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
                    <BCardTitle class="m-0">{{ $t('danhsachkhachhang') }}</BCardTitle>
                    <div class="flex-shrink-0">
                        <button class="btn btn-sm btn-success" @click="addCustomerModal()">
                            <i class="ri-add-fill me-1 align-bottom" data-toggle="tooltip" title="" data-bs-original-title="Thêm mới" aria-label="Thêm mới"></i>
                            Thêm mới
                        </button>
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
