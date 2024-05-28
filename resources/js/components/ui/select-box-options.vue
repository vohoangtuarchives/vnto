<script>
import {
    ref
} from 'vue';
import SettingService from '@/services/setting.service';
import SelectboxModal from './components/SelectboxModal';
import Skeleton from 'primevue/skeleton';
import {
    ModalSize
} from "vue-bs-modal";
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';

export default {
    components: {
        MultiSelect,
        Dropdown,
        Skeleton
    },
    methods: {

        initData(){
            
            if(this.firstLoad){
                this.isLoading = true;
                let seft = this;
                SettingService
                .getOptions({
                    'type': this.type
                })
                .then((response) => {
                    
                    response
                        .data
                        .data
                        .map(function (value) {
                            seft
                                .data
                                .push(value);
                        });
                    seft.data = this.dataSelect(seft.data, true);
                    this.isLoading = false;
                })
                this.firstLoad =  false;
                
            }
        },
        openModal() {
            this
                .$vbsModal
                .open({

                    content: SelectboxModal,
                    size: ModalSize.MEDIUM,

                    contentProps: {
                        type: this.type
                    },

                    contentEmits: {
                        refresh: (response) => {
                            this.data = this.dataSelect(response);
                        }
                    },
                    backgroundScrolling: true,
                    staticBackdrop: true
                });
        }
    },
    data() {
        return {
            data: ref([]),
            firstLoad:true,
            isLoading:ref(false)

        }
    },
   
    computed: {
        selectedItem: {
            get() {
                if (this.parseBoolean(this.multi) == false && this.modelValue) {
                    const foundItem = this.data.find(item => this.modelValue.includes(item.id));
                    return foundItem;

                }
                if (this.modelValue && this.data.length && this.modelValue.length) {
                    return this
                        .data
                        .filter(item => this.modelValue.includes(item.id));
                }

                return [];
            },
            set(data) {
                if (this.parseBoolean(this.multi) == false) {
                    this.$emit('update:modelValue', data.id);
                } else {
                    this.$emit('update:modelValue', data.map(item => item.id));
                }

            }

        }
    },
    props: {

        title: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            required: true
        },

        multi: {
            type: [Boolean,String],
            default: false,
        },
        modelValue: {
            
            
        },
        edit:{
            type:[Boolean,String],
            default:true
        },
        search:{
            type:[Boolean,String],
            default:true
        }

    }
};
</script>
<template>
<div class="input-group  flex-row">

    <div class="form-control border-0 p-0 m-0">

        <MultiSelect v-if="parseBoolean(multi)==true" v-model="selectedItem" class="w-100 " :class="!parseBoolean(edit)?'rounded-end-0':''" :options="data" :filter="parseBoolean(search)" optionLabel="name" :loading="isLoading" :placeholder="title"  @click="initData" :maxSelectedLabels="1" >
            <template #empty>
                <div v-if="isLoading">
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    
                </div>
               
            </template>
        </MultiSelect>
        <Dropdown v-if="parseBoolean(multi)==false" v-model="selectedItem" :options="data" class="w-100 rounded-1 " :class="!parseBoolean(edit)?'rounded-end-0':''" :filter="parseBoolean(search)" optionLabel="name"  :loading=isLoading :placeholder="title" @click="initData" loader="{xxx}" :highlightOnSelect="true" variant="filled" >
            <template #empty>
                <div v-if="isLoading">
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    <Skeleton class="mb-2 py-3"></Skeleton>
                    
                </div>
               
            </template>

        </Dropdown> 



        
    </div>

    <BButton v-if="parseBoolean(edit)" class="input-group-text btn  btn-danger waves-effect"  @click="openModal">
        <i class="ri-settings-4-line"></i></BButton>
       
</div>
</template>

<style>
.p-dropdown-panel ul,
.p-multiselect-items {
    padding-left: 5px;
    margin: 0;
}
.p-dropdown{height: 37px;}
span.p-dropdown-label.p-inputtext{font-size: 14px;}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item{font-size: 14px;}
</style>
