<template>
<!-- <LoaderBar /> -->
 <router-view></router-view>
  <Toast></Toast>
  <ConfirmDialog style="min-width: 25rem;"></ConfirmDialog>

<Dialog v-model:visible="visible" modal :header="$t('thongbao')" :style="{ width: '25rem' }">
  <div class="flex align-items-center gap-3 mb-3">
  {{ message }}
  </div>
    
    
    <div class="text-center gap-2">
        <button type="button" class="btn btn-info px-5" @click="visible = false">OK</button>
        
    </div>
</Dialog>
</template>
<script>
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import { useConfirm } from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {
    mapGetters
} from 'vuex';
import { ref } from 'vue';
export default {

  name: 'App',

  components: {
    // LoaderBar
    Toast,
    ConfirmDialog,
    Dialog
  },
  watch: {
    isLoading: function(newLoadingState) {
        if(newLoadingState){
          document.body.classList.add("loading");
        }else{
          document.querySelector('body').classList.remove('loading');
        }
    }
  },
  setup(){
    
    return {
      visible:ref(false),
      confirm:useConfirm(),
      toast: useToast(),
      message:ref(''),
    }
  },
  computed: {
        ...mapGetters('layout', ['isLoading'])
    },
    
  methods: {
    alert(message){
      this.message = message;
      this.visible = true;
    },
    showConfirm(data){
            this.confirm.require({
                message: data.content,
                header: data.title,
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: data.cancel??this.$t('confirm.cancel'),
                acceptLabel: data.ok??this.$t('confirm.ok'),
                accept: () => {
                  if (typeof data.accept === 'function') {
                      data.accept(); 
                  }
                },
                reject: () => {
                  if (typeof data.reject === 'function') {
                      data.reject(); 
                  }
                }
   
            });
        this.confirm
    },
    showToast(msg, options){
      
      this.toast.add({severity: options && options.type?options.type:'success',summary: options && options.title?options.title:this.$t('thongbao'),  detail: msg, life: 3000});
    },
  }
}

</script>
<style>
#nprogress .bar{height: 5px !important;}
</style>
