<script>
    import Layout from "@/layouts/main.vue";
    import PageHeader from "@/components/page-header";
    import {ModalSize} from "vue-bs-modal";
    import AddEditSource from "./components/AddEditSource";
    import SettingService from '@/services/setting.service'
    import {ref} from "vue";
    import { useRoute } from 'vue-router'
    export default {
        watch: {
            '$route.params.id': {
                handler(newId, oldId) {
                    this.activeGroup = newId;
                    if (newId == undefined) {
                        this.activeGroup = null;
                        
                    }
                    console.log('xxx', newId, oldId); // Load data when id changes
                },
                immediate: true // Load data initially if id exists
            },
            'currentPage':{

                handler(newId, oldId) {
                    if(newId!=oldId && oldId!=undefined){
                        this.$router.replace({ query: {page:newId}})
                        this.getData(newId); 
                    }
                },
                immediate: true // Load data initially if id exists
            }
        },
      
        methods:{
            getData(page){
                SettingService.getListCustomerSource(page).then((response)=>{
                    this.data = response.data.data.data;
                    this.pagingate = response.data.data;
                    this.currentPage = this.pagingate.current_page;
                   
                   
                })
            },
            addSourceModal(data) {
                this
                    .$vbsModal
                    .open({
                       
                        content: AddEditSource,
                        size: ModalSize.MEDIUM,
                        contentProps: {
                            title: data==null?this.$t('themmoinguonkhachhang'):this.$t('capnhatnguonkhachhang'),
                            item:data,
                        },
                        // pass event listeners to the EditProfileComponent.
                        contentEmits: {
                         onUpdate: ()=>this.getData(this.pagingate.current_page)
                        },
                        backgroundScrolling: true, // default is false
                        staticBackdrop: true, // will disable backdrop click to close modal if true
                    });

            },
           
            getStatusInfo(status) {
                
                const text = status ? this.$t('khadung') : this.$t('khongkhadung');
                const className = status ? 'badge border border-success  text-success' : 'badge border border-danger  text-danger';
                return { text, className };
            },
        },
        mounted() {
           
            this.getData(this.currentPage);
            
        },
        data() {
        return {
            // currentPage : ref(this.$route.query.page),
            data: ref([]),
            pagingate:ref({}),
            modalShow: false,
            loadSuccess:false,
            titleFormGroup: this.$t('t-themmoidanhmuc')
            };
        },
        setup() {
            const route = useRoute();
            const currentPage = ref(parseInt(route.query.page) || 1);

            return { currentPage };
        },
        
        components: {
            Layout,
            PageHeader
        },
        
       
    };
</script>

<template>
    <Layout>
        <PageHeader title="nguonkhachhang" pageTitle="Dashboard"/>


        <BRow>
            <BCol cols="12">
                

                        <BCard>
                            <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
                                <BCardTitle class="m-0">{{ $t('danhsach') }}</BCardTitle>
                                <div class="flex-shrink-0">
                                    <button class="btn btn-sm btn-success" @click="addSourceModal">
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
                                <div class="table- table-card ">
                                    <table class="table table-bordered">
                                        <thead class="table-light">
                                            <tr>
                                                <th style="width: 5%">{{ $t('stt') }}</th>
                                                <th>{{$t('tennguon')}}</th>
                                                <th>{{$t('capnhat')}}</th>
                                                <th>{{$t('trangthai')}}</th>
                                                <th width="70px" class="middle text-end">{{$t('tacvu')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,index) in data" v-bind:key="item.id">
                                                <td>{{ index+1}}</td>
                                                <td>{{ item.name }}</td>
                                                <td>{{ dateFormat(item.created_at) }}</td>
                                                <td> <span :class="getStatusInfo(item.status).className">{{ getStatusInfo(item.status).text }}</span></td>
                                                <td class="middle text-end">
                                                    <div class="dropdown">
                    <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="ri-more-2-fill"></i>
                    </a>
                  
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a class="dropdown-item" @click="addSourceModal(item)" href="#">{{$t('capnhat')}}</a></li>
                        <li><a class="dropdown-item" href="#">{{$t('xoa')}}</a></li>
                    </ul>
                </div>
                                                </td>
                                            </tr>
                                            

                                        </tbody>
                                    </table>
                                    <BPagination  v-model="currentPage" :total-rows="pagingate.last_page" :per-page="1"  />

                                  
                                </div>
                            </BCardBody>

                        </BCard>

                    </BCol>

                </BRow>
       

    </Layout>

   
</template>

