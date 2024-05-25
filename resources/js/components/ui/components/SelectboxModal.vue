<script>
    import draggable from 'vuedraggable'
    import {toast} from "vue3-toastify";
    import Skeleton from '@/components/skeleton'
    import SettingService from '@/services/setting.service';
    export default {
        name: "SelectboxModal",
        data() {

            return {searchQuery: null,data: [], errors_msg: [], success_msg: '', isLoading: false,preload:true};
        },
        methods: {
            removeAt(idx) {

                this.data.splice(idx, 1);
            },

            addItem() {
                this
                    .data
                    .push({id:null,name: '', status: true, is_default: false,ordered:this
                    .data.length});
                        const seft = this;
                        setTimeout(function(){
                    seft.$refs.input.focus(); 
                 
                },10)
            },
            close() {
                this
                    .$vbsModal
                    .close();
            },
            async updateList() {
                this.success_msg = '';
                if (!this.isLoading) {
                
                    this.isLoading = true;
                    this.errors_msg = [];
                   
                   
                    
                    SettingService
                        .updateOptions(this.type,this.data)
                        .then((rs) => {
                            
                            
                            let data_return = [];
                            rs.data.data.map(function (value) {
                                data_return.push(value);
                            });
                            
                            this.$emit("refresh",this.syncData(data_return,['status','is_default']));
                            toast(this.$t('capnhatthanhcong'));
                            this.isLoading = false;
                            this.close();
                        });
                    }
                return false;
            },
            changeCountrySelectBox(x) {
                console.log(x);
            },
            changeList(data){
                console.log('change list',data);
            }
            
        },
    
        computed: {
            dragOptions() {
                return {animation: 200, group: "description", disabled: false, ghostClass: "ghost"};
            },
     
            resultQuery:{

                get: function() {
                    if(this.searchQuery){
                        return this.data.filter((item)=>{
                            return this.searchQuery.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
                        })
                    }else{
                        return this.data;
                    }
                  
                },
                set: function(data) {
                    this.data = data;
                }
                
            }

        },
        setup() {
           
        },
        mounted() {
            const seft = this;
            SettingService.getOptions({'type':this.type}).then((response)=>{
            response.data.data.map(function (value) {
                seft.data.push(value);
              
            });
            setTimeout(function(){
                seft.preload = false;
            },500)
            this.syncData(this.data,['status','is_default']);
        }).catch((e)=>{     console.log(e); })
        },
        components: {
            draggable, Skeleton
        },
        props: {
            type: {
                type: String,
                required: true
            },

        }
    };
</script>
<template>
    <div>
        <div class="modal-header p-3 ">
            <h5 class="modal-title">{{ $t('thietlapgiatri') }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <form @submit.prevent="updateList">
            <div class="modal-body">
                <div class="search-box">
                    <input
                        type="text"
                        v-model="searchQuery" 
                        class="form-control bg-light border-light"
                        placeholder="Search here...">
                        <i class="ri-search-2-line search-icon"></i>
                    </div>
                    <hr/>
                    <div class="list-attr mt-3">
                        <simplebar style="max-height: 400px;" data-simplebar="data-simplebar">
                            <Skeleton v-if="preload" isTable="false" rows="3" height="40" class="mb-2"></Skeleton>
                            <draggable
                                v-if="!preload"
                                change="changeList"
                                class="list-unstyled mb-0"
                                v-model="resultQuery"
                                handle=".handle"
                                itemKey=""
                                @start="isDragging = true"
                                @end="isDragging = false"
                                :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
                                v-bind="dragOptions">
                                <template #item="{ element, index }">
                                    <li>
                                        <div class="input-group mb-2 ">

                                            <span class="input-group-text">
                                                <input
                                                    :checked="element.status === 1"
                                                    class="form-check-input mt-0"
                                                    type="checkbox"
                                                    v-model="element.status"
                                                    ></span>
                                                <input type="text"  ref="input" v-model="element.name" :disabled="element.is_default" class="form-control"/>
                                                <span class="input-group-text p-1">
                                                    <BButton :disabled="element.is_default" class="bg-transparent border-0 text-black btn p-0 px-2" @click="removeAt(index)">
                                                        <i class="ri-subtract-line align-bottom me-1"></i>
                                                    </BButton>

                                                </span>
                                                <span class="input-group-text p-1 handle">
                                                    <BButton class="bg-transparent border-0 text-black btn p-0 px-2 ">
                                                        <i class="ri-drag-move-line align-bottom me-1"></i>
                                                    </BButton>
                                                </span>
                                            </div>
                                        </li>
                                    </template>
                                </draggable>
                            </simplebar>

                        </div>
                        <hr/>
                        <button
                            type="button"
                            @click="addItem"
                            class="btn btn-outline-secondary waves-effect waves-light">
                            <i class="ri-add-line align-bottom me-1"></i>
                            {{ $t('themdong')}}</button>

                    </div>
                    <div class="modal-footer">
                        <BButton :loading="isLoading" type="submit" class="btn btn-success">
                            {{$t('capnhat')}}</BButton>
                        <button type="button" class="btn btn-danger" @click="close">
                            <i class="ri-close-line"></i>{{ $t('dong') }}
                        </button>
                    </div>
                </form>
            </div>
        </template>
        <style>
            .button {
                margin-top: 35px;
            }

            .flip-list-move {
                transition: transform 0.5s;
            }

            .no-move {
                transition: transform 0s;
            }

            .ghost {
                opacity: 0.5;

            }

            .list-group {
                min-height: 20px;
            }

            .list-group-item {
                cursor: move;
            }

            .list-group-item i {
                cursor: pointer;
            }
        </style>