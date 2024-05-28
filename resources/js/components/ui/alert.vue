<script>
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

export default {
  components:{
    Toast
  },  
  data(){
    return {data:[]}
  },
  mounted() {
    const toast = useToast();
    const seft = this;
    var detail_msg = [];
  
    if (typeof this.errors === 'object' && this.errors !== null) {
      if(Object.keys(this.errors).length>0){
      Object.keys(this.errors).forEach(function(key) {
       
         if (typeof seft.errors[key]==='object' && seft.errors[key] !== null) {
          seft.errors[key].map(function(elm){
            detail_msg.push(elm);
           })
           
         }else{
          
          if(seft.errors[key]!==null){
              detail_msg.push(seft.errors[key]);
          }
         }
      });
    }
    
    if(typeof this.errors === 'string'){
    
      detail_msg.push(this.errors);
    }
   
    if(detail_msg.length){
      toast.add({ severity: this.type, summary: this.localizedTitle, detail: detail_msg.join("\r\n")
, life: 7000,});
    }
  } 
   
   
  },
  computed: {
  localizedTitle() {
    return this.$t(this.title);
  }
},
  props: {
  errors: {
    default: () => []
  },
  type: {
    type: String
  },
  title: {
    type: String,
    default: 'thongbao'
  }
}

};
</script>
<template >
   <Toast />

 
</template>
<style type="scope">
.p-toast{z-index: 12345;}
</style>