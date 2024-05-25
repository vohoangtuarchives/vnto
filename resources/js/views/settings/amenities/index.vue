<script>
    import Layout from "@/layouts/main.vue";
    import PageHeader from "@/components/page-header";
    import Skeleton from '@/components/skeleton'
    import SwitchToggle from '@/components/ui/switch-toggle'
    import {ModalSize} from "vue-bs-modal";
    import {ref} from "vue";
    import {required, helpers} from "@vuelidate/validators";
    import { useRoute } from 'vue-router'
    import SupplierAmenitiesFormModalComponent from "./components/SupplierAmenitiesFormModalComponent.vue";
    import AmenitiesService from "@/services/amenities.service";

    export default {
        watch: {
            '$route.params.id': {
                handler(newId, oldId) {
                    this.activeGroup = newId;
                    if (newId == undefined && newId!=oldId) {
                        this.activeGroup = null;
                        
                    }
                    if(newId!=oldId){
                        this.showSkeleton = true;
                        this.listItems = [];
                        this.getData();
                        
                    }
                    this.form.category = this.activeGroup
                   
                },
                immediate: true // Load data initially if id exists
            },
        },
        setup() {
            const route = useRoute();
            let currentPage = ref(route.query.page);
            return {
                form: ref({name: route.query.name,category:route.params.id}),
                listGroup: ref([]),
                listItems:ref([]),
                activeGroup: ref(null),
                showSkeleton:ref(true),
                currentPage,
                service:ref(),
            }
        },
        mounted() {
            this.getGroups();
            if(this.$route.params.id==null){
                this.getData();
            }
        },
        data() {
            
        },

        components: {
            Layout,
            PageHeader,
            Skeleton,
            SwitchToggle
        },
        validations: {
            name: {
                required: helpers.withMessage("Name is required", required)
            }
        },
        methods: {
            onSearch(){
                
                if(this.form.category!=''){
                   
                    this.$router.replace({name:'settings.amenities.details',params:{id:this.form.category},query:{name:this.form.name}});
                }else{
                    this.$router.replace({ name:'settings.amenities',query:{name:this.form.name}});
                }
                this.getData();
                return false;
            },
            pageChange(_,page){
                
                this.getData(page);
              
                this.$router.replace({ query: {page:page}})
                
            },
            getData(page) {
                this.showSkeleton = true;
                if(page==null){
                    page = this.$route.query.page;
                }
                AmenitiesService
                .getItems({category:this.$route.params.id,page:page?page:1,name:this.form.name})
                .then(response => {
                   
                    this.showSkeleton = false;
                    this.listItems = response.data.data;
                    this.currentPage = response.data.data.current_page;
                    this.service =  response.data.data.service;
                   
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            },
            
            getGroups() {
                AmenitiesService
                    .getList()
                    .then(response => {
                        this.listGroup = response.data.data;
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            },
          
            openSupplierAmenitiesItemModal(item=null) {
                console.log(item);
                this
                    .$vbsModal
                    .open({
                        // pass your component as the whole modal content you can also use the
                        // component's registered name
                        content: SupplierAmenitiesFormModalComponent,
                        size: ModalSize.MEDIUM,
                        // pass custom data as props to the EditProfileComponent.
                        contentProps: {
                            item:item,
                            category:this.convertObjectToOptions(this.listGroup)
                        },
                        // pass event listeners to the EditProfileComponent.
                        contentEmits: {
                            onUpdate: this.onSubmitProfileForm
                        },
                        backgroundScrolling: true, // default is false
                        staticBackdrop: true, // will disable backdrop click to close modal if true
                    });

            },
            handleChange(newValue) {
                // Xử lý giá trị mới từ child component
                console.log('New value from child:', newValue);
                // Cập nhật giá trị trong parent component nếu cần thiết
                
                }
          

        }
    };
</script>

<template>
    <Layout>
        <PageHeader title="t-quanlythuoctinh" pageTitle="Dashboard"/>
        <!-- Default Modals -->
       
        <BRow>
            <BCol cols="12">
                
                <BCard no-body="no-body">
                    <BCardHeader class="align-items-center d-flex custom-card-header">
                        <BCardTitle class="mb-0 flex-grow-1">
                            <div class="d-flex justify-content-between align-content-center">
                                <div class="col-12 col-md-auto">
                                    <ul class="nav  card-header-tabs border-bottom-0">

                                        <li :class="{ active: activeGroup==null }" class="nav-item">
                                            <router-link class="nav-link" :to="{name:'settings.amenities'}">Tất cả</router-link>
                                        </li>
                                        <li
                                            class="nav-item"
                                            v-for="item in listGroup"
                                            :class="{ active: activeGroup==item.id }"
                                            :key="item.id"
                                            :title="item.name">
                                            <router-link
                                                :to="{name:'settings.amenities.details',params:{id:item.id}}"
                                                class="nav-link "
                                                href="javascript:void(0)">{{ item.name }}</router-link>
                                        </li>

                                    </ul>
                                </div>
                               
                            </div>

                        </BCardTitle>

                    </BCardHeader>
                    <BCardBody>
                        <div class="tab-content">
                            <div class="tab-pane fade active show" id="main" role="tabpanel">
                                <div class="main">
                                    <form class="form-horizontal" method="GET" @submit.prevent="onSearch">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <div class="form-group m-0">
                                                        <label>{{ $t('tenthuoctinh') }}</label>
                                                        <div class="reset-input">
                                                            <input class="form-control"   type="text" name="name" v-model="form.name">
                                                                <span
                                                                    class="las la-times me-2 reset"
                                                                    aria-hidden="true"
                                                                    onclick="resetInput(this)"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group m-0 reset-input">
                                                            <label>{{ $t('nhomthuoctinh') }}</label>
                                                            <select name="category" class="form-control" v-model="form.category">
                                                                <option value="">-- Chọn --</option>
                                                                <option v-for="item in listGroup" :key="item.id" :value="item.id">{{ item.name }}</option>

                                                            </select>
                                                            <span
                                                                class="las la-times me-2 reset"
                                                                aria-hidden="true"
                                                                onclick="resetInput(this)"></span>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2">
                                                        <div class="form-group m-0 d-grid">
                                                            <label style="visibility: hidden">Tìm kiếm</label>
                                                            <button type="submit" class="btn btn-primary">
                                                                <i class="fas fa-search"></i>
                                                                Tìm kiếm</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </BCardBody>
                          

                        </BCard>

                        <BCard>
                            <BCardHeader class="border-0 align-items-center d-flex justify-content-between">
                                <BCardTitle>{{ $t('danhsachthuoctinh') }}</BCardTitle>
                                <div class="flex-shrink-0">
                                    <button class="btn btn-sm btn-success" @click="openSupplierAmenitiesItemModal()">
                                        <i
                                                class="ri-add-fill me-1 align-bottom"
                                            data-toggle="tooltip"
                                            title=""
                                            data-bs-original-title="Thêm mới"
                                            aria-label="Thêm mới"></i>
                                        Thêm mới
                                    </button>
                                </div>
                            </BCardHeader>
                            <BCardBody>
                                <div class="table-responsive table-card">
                                    <table class="table">
                                        <thead class="table-light">
                                            <tr>
                                                <th style="width: 5%">STT</th>
                                                <th width="40%">{{$t('tenthuoctinh')}}</th>
                                                <th width="30%">{{  $t('nhomthuoctinh')}}</th>
                                                <th width="10%">{{  $t('tinhtrang')}}</th>
                                               
                                                <th width="50px" class="middle text-end">Tác vụ</th>
                                            </tr>
                                        </thead>
                                            
                                            <Skeleton v-if="showSkeleton" cols=5 rows=3  height=50 />
                                                <tbody v-if="!showSkeleton">
                                                <tr  v-for="(v,k) in listItems.data" v-bind:key="k">
                                                
                                                    <td>{{ k+1 }}</td>
                                                    <td>{{ v.name }}</td>
                                                    <td>{{ findValueByField(this.listGroup,v.category_id,'name') }}</td>
                                                    <td>
                                                        <SwitchToggle :checked="v.status" v-model="v.status" @toggle="handleChange" :pk="v.id" field="status" :tbl="service" />
                                                       
                                                </td>
                                                   <td class=" text-end">
                                                    
                                                        <a @click="openSupplierAmenitiesItemModal(v)" href="javascript:void(0);" class="link-success fs-17 d-inline-block me-2"><i class="ri-edit-2-line"></i></a>
                                                        <a href="javascript:void(0);" class="link-danger fs-17"><i class="ri-delete-bin-line"></i></a>
                                                   
                                                </td>
                                                </tr>
                                            </tbody>
                                    </table>
                                    <BPagination v-if="listItems.last_page > 1"  v-model="currentPage" :total-rows="listItems.last_page" @page-click="pageChange" :perPage="1"  />
                                </div>
                            </BCardBody>

                        </BCard>

                    </BCol>

                </BRow>

            </Layout>
        </template>