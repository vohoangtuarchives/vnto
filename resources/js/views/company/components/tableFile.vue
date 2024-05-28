
<script>
import uploadPhotoService from "@/services/uploadPhoto.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {ref} from "vue";
export default {
    name: "TableFile",
    components: {
        DataTable,
        Column,
    },
    props: {
        data: {
            type: Array,
            default: function () {
            return [
                    {
                        id: "",
                        name: "",
                        size_file: "",
                    }
                ];
            },
        },
        funcDel:{
            type:Boolean,
        },
    },
    data() {
        return { 
            errors_msg: '',
            success_msg: '',
            selectedItem: ref(),
            service: uploadPhotoService,
            destroyed: ref([]),
        };
    },
    methods: {
        async deleteFile(id) {
            if (confirm(this.$t('cochacmuonxoabainay'))) {
                this.service.destroy(id).then((rp) => {
                    if (rp.data.success == true) {
                        this.success_msg = this.$t("daxoafile");
                        setTimeout(() => {
                            this.success_msg = '';
                            this.$emit("destroyed");
                        }, 500);
                    } else {
                        this.errors_msg = this.$t("xayraloi");
                        setTimeout(() => {
                            this.errors_msg = '';
                        }, 1500);
                    }
                })
            }    
        },
        async deleteMuitlItem(){
            if(this.selectedItem===undefined || this.selectedItem===null){
                alert(this.$t('canchon1bai'))
            }else{
                if (confirm(this.$t('cochacmuonxoa'))) {
                    this.service.destroyAll(this.selectedItem).then((rp)=>{
                        if (rp.data.success == true) {
                            this.success_msg = this.$t("daxoafile");
                            this.destroyed = rp.data.data;
                            this.selectedItem = null;
                            setTimeout(() => {
                                this.success_msg = '';
                                this.$emit("destroyed");
                            }, 1500);
                        } else {
                            this.errors_msg = this.$t("xayraloi");
                            setTimeout(() => {
                                this.errors_msg = '';
                            }, 1500);
                        }
                    })
                }
            }
        },
    },
};
</script>
<template>
    <p v-if="errors_msg" class="alert alert-danger">
        {{errors_msg}}
    </p>
    <div v-if="success_msg!=''" class="alert alert-success">
        {{success_msg}} 
        <div v-if="destroyed.length > 0">
            <div v-for="(id, index) in this.destroyed" :key="index">
                {{ id }}
            </div>
        </div>
    </div>
    <DataTable v-if="data.length" :value="data" :pt="{
        table: 'table',
        thead: 'table-light'
        }" :key="unitCode" 
        bodyStyle="text-align:center"
        style="vertical-align: middle"
        class="align-middle min"
        v-model:selection="selectedItem"
    >
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column :header="$t('stt')" style="width: 50px" class="align-middle">
        <template #body="{index}">
        {{ index+1 }}
        </template>
    </Column>
    <Column header="Name file" style="" class="align-middle">
        <template #body="{data}">
        {{ data.name_file }}
        </template>
    </Column>
    <Column bodyStyle="text-align:right" style="width: 30px;" class="align-middle">
        <template #header v-if="funcDel">
            <a @click="deleteMuitlItem" class="dropdown-item btn btn-success w-100">
                <i class="ri-delete-bin-line me-1 text-danger "></i>
                {{$t('xoatatca')}}
            </a>
        </template>
        <template #body="{data}">
            <div class="d-flex justify-content-end">
                <a class="cursor-pointer mx-2" target="_blank" :href="this.imageLink(data.type_upload+'/'+data.name_file)" ><i class="ri-eye-fill"></i></a>
                <a v-if="funcDel" class="cursor-pointer" @click="deleteFile(data.id)"><i class="pi pi-times"></i></a>
            </div>
        </template>
    </Column>
    </DataTable>
</template>