<script>

import TokenService from "@/services/token.service";
import Dialog from 'primevue/dialog';
import appConfig from "@/configs/app.config";
export default {
    components:{
        Dialog
    },
    
    methods:{
      emitClose() {
            // Gửi sự kiện close về ComponentA thông qua emit
            this.$emit('close');
        },
        // handleSelect:(selection) => {
        //     this.selectedFiles.value = selection
        // },
        // handleButtonClick:() => {
        //     console.log(this.selectedFiles.value);
        // }

    },
    data() {
      const token = TokenService.getLocalAccessToken();
      const user_id = TokenService.getUser().user.id;
      const upload_patch = appConfig.APP_UPLOAD+user_id+"/";
    return {
      path:appConfig.APP_API+"/"+user_id,
        visible: false,
    //selectedFiles:ref([]),
     handleSelectButton:{
      // show select button
      active: true,
      // allow multiple selection
      multiple: false,
      // handle click event
      click: (items, ) => {
        
        if (!items.length) {
          alert('No item selected');
          return;
        }
        const link = [];
        console.log(items);
        items.map(function(x){
          x.path = upload_patch+x.path.replace("local://","");
          link.push(x);
        })
        
        this.visible = false;
        this.$emit('file',link);
        
        
      }
    },
      request: {
        baseUrl: appConfig.APP_API+"filemanager",
        headers: { "Authorization": `Bearer ${token}` },
        params: { user: user_id },
       
        transformRequest: req => {
          if (req.method === 'get') {
            req.params.vf = "1"
          }
          return req;
        },
        xsrfHeaderName: "X-CSRF-TOKEN",
      },
    };
  },
  mounted(){
    if(this.open==true){
      
      this.visible = true;
    }
  },
  watch: {
        // Watcher cho prop fileManagerOpen
        open(newVal) {
          this.visible = newVal;
        },
    },
  props: {
        
        open:{default:false,type:[String,Boolean]},
        multi:{default:false,type:[String,Boolean]}
    }
}
</script>
<template>
    <div class="card flex justify-content-center">
       
        <Dialog v-model:visible="visible" @hide="emitClose" :showHeader="false" class="pt-4"  modal :style="{ width: '90rem',}" :breakpoints="{ '1199px': '95vw', '575px': '90vw' }">
            <vue-finder
                style="height:70vh"
                id='my_vuefinder'
                :request="request"
                max-height="100vh"
                height="100%"
                @close="emitClose"
                :multiple="multi"
                :select-button="handleSelectButton"
                ></vue-finder>
        </Dialog>
    </div>
</template>
<style type="scope">
.vf-selector-area{}
.p-component-overlay{z-index: 12345 !important}
.vuefinder .resize-y{resize: none !important;}
.vuefinder > div > div{height: 100%;}
.vuefinder > div{    display: flex;
    flex-direction: column;
   
    height: 100%;}
    /* .vuefinder :is(.w-screen){width: 100%  !important;} */
</style>

