
<template>
    <div class="">
        <p v-if="errors_msg.length" class="alert alert-danger">
            <ul class="mb-0">
                <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
            </ul>
        </p>
        <p v-if="success_msg!=''" class="alert alert-success">
            {{success_msg}}
        </p>
        <FileUpload name="fileAboutCompany[]" :customUpload="true" :multiple="true"  :maxFileSize="1000000" @select="onSelectedFiles" accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf,.png,.jpg,.PNG,.JPG,.jpeg,.JPEG,.gif,.GIF">
            <template #header="{ chooseCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2 w-100">
                    <div class="flex gap-2 mb-2">
                        <Button @click="chooseCallback()" rounded outlined class="rounded-pill "><i class="pi pi-file-plus mr-2"></i> {{$t('themfile')}}</Button>
                        <Button @click="clearCallback()" rounded outlined severity="danger" :disabled="!files || files.length === 0" class="rounded-pill mx-2 "><i class="pi pi-times mr-2"></i>  {{$t('del_all')}}</Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-100 md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                        ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
                    >
                </div>
            </template>
            <template #content="{ files, removeFileCallback }">
                <div v-if="files.length > 0">
                    <div class="sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="m-0 p-2 d-flex justify-content-between border-1 surface-border align-items-center border-bottom">
                            <span class="font-semibold flex-grow-1">{{ file.name }}</span>
                            <div class="p-2">{{ formatSize(file.size) }}</div>
                            <Button class="p-2" icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded  severity="danger" />
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="d-flex align-items-center justify-content-center flex-column" >
                    <i class="pi pi-cloud-upload border-2 border-circle p-3 text-8xl text-400 border-400" />
                    <p class="mt-4 mb-0">{{$t('keovathataptin')}}</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>
<script>
import 'primeicons/primeicons.css'
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
export default {
    name: "UploadFile",
    components: {
        FileUpload,
        Button,
        ProgressBar
    },
    props: {
        title: {
            type: String,
            default: "",
        },
    },
    data() {
        return { 
            files: [],
            totalSize: 0,
            totalSizePercent: 0,
            errors_msg: [],
            success_msg:'',
        };
    },
    methods: {
        onRemoveTemplatingFile(file, removeFileCallback, index) {
            removeFileCallback(index);
            this.totalSize -= parseInt(this.formatSize(file.size));
            this.totalSizePercent = this.totalSize / 10;
        },
        onSelectedFiles(event) {
            this.files = event.files;
            this.$emit('fileUploaded', this.files);
            this.files.forEach((file) => {
                this.totalSize += parseInt(this.formatSize(file.size));
            });
        },
        formatSize(bytes) {
            const k = 1024;
            const dm = 3;
            const sizes = this.$primevue.config.locale.fileSizeTypes;
            if (bytes === 0) {
                return `0 ${sizes[0]}`;
            }
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
            return `${formattedSize} ${sizes[i]}`;
        }
    }
};
</script>

<style lang="scss">
.p-button.p-button-icon-only.p-button-rounded{
    border-radius: 50%;
    height: 2.5rem;
}
.text-8xl {
    font-size: 6rem !important;
}
.border-400 {
    border-color: var(--surface-400) !important;
}
.text-400 {
    color: var(--surface-400) !important;
}
.border-2 {
    border-width: 2px !important;
    border-style: solid;
}
.border-circle {
    border-radius: 50% !important;
}
.p-progressbar {
    border: 0 none;
    height: 0.65rem;
    background: #e2e8f0;
    border-radius: 6px;
}
</style>