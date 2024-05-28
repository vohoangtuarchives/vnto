
<script>
export default {
    name: "TableFile",
    components: {
    },
    data() {
        return { 
            success_msg:'',
            imageExtensions :['jpg', 'jpeg', 'png', 'gif'],
        };
    },
    props: {
        dataFiles: {
            type: Array,
            default: function () {
            return [
                    {
                        id: "",
                        name: "",
                    }
                ];
            },
        },
        typePost:{
            type:String
        },
        funcDel:{
            type:Boolean,
        },
    },
    methods:{
        checkfile(nameFile) {
            const fileName = nameFile.toLowerCase();
            const fileExtension = fileName.split('.').pop(); 
            // Kiểm tra xem phần mở rộng của file có trong danh sách các phần mở rộng của các file hình ảnh hay không
            if (this.imageExtensions.includes(fileExtension)) {
                // File là hình ảnh
                return this.imageLink(this.typePost+'/'+nameFile);
            } else {
                // File không phải là hình ảnh
                return false;
            }
        },
    },
};
</script>
<template>
    <p v-if="success_msg!=''" class="alert alert-success">
        {{success_msg}}
    </p>
    <BCardBody v-if="dataFiles.length>0">
        <div class="vstack gap-2">
            <div v-for="(file, index) in dataFiles" :key="index" class="border rounded border-dashed p-2">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 me-3">
                        <div class="avatar-sm">
                            <div class="avatar-title bg-light text-secondary rounded fs-24">
                                <i v-if="!checkfile(file.name_file)" class="ri-folder-zip-line"></i>
                                <img v-else :src="checkfile(file.name_file)" :alt="file.name_file" class="avatar-xs">
                            </div>
                        </div>
                    </div>
                    <div class="flex-grow-1 overflow-hidden">
                        <h5 class="fs-13 mb-1">
                            <span href="#" class="text-body text-truncate d-block">
                                {{file.name_file}}</span>
                        </h5>
                        <div>{{file.size_file}}MB</div>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                        <div class="d-flex gap-1">
                            <BLink 
                                class="btn-icon text-muted fs-18" target="_blank" :href="this.imageLink(file.type_upload+'/'+file.name_file)">
                                <i class="ri-download-2-line"></i>
                            </BLink>
                            <BLink v-if="funcDel"
                                class="btn-icon text-muted fs-18" @click="funcDel(file.id)">
                                <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                            </BLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BCardBody>
    <BCardBody v-else>
        {{$t('chuacofilenao')}}
    </BCardBody>
</template>