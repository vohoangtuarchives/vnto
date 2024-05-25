
<script>

    import { useVuelidate } from '@vuelidate/core'
    import { required, helpers } from '@vuelidate/validators'
    import SettingService from '@/services/setting.service'
    export default {
        name: "AddEditSource",
        data() {
            return {
                id:this.item.id,
                name: this.item.name,
                target: this.item.target,
                status:this.item.id!=null ? this.item.status==1?true:false : true,
                errors_msg:[],
                success_msg:'',
                isLoading:false,
            };
        },
       
     
        methods: {
            close() {
                this
                    .$vbsModal
                    .close();
            },
            async  updateOrCreateSource() {
                
              
                if(!this.isLoading){
                this.isLoading = true;
                this.errors_msg = [];
                const result = await this.v$.$validate()
                if (!result) { 
                    let that = this;
                    this.v$.$errors.forEach(function(error){
                        that.errors_msg.push(error.$message);
                    });
                    this.isLoading = false;
                    return
                }
                var status = this.status;
                
                SettingService.updateOrCreateSource ({'name':this.name,'target':this.target,'status':status,id:this.id,type:this.type}).then((rs)=>{
                    
                    if(rs.data.status==false){
                        this.errors_msg.push(rs.data.data);
                    }else{
                        if(!this.id){
                            this.success_msg = this.$t('themmoithanhcong');
                        }else{
                            this.success_msg = this.$t('capnhatthanhcong');
                        }
                       
                        setTimeout(() => {
                            this.$emit("onUpdate");
                            this.close();
                        }, (1500));
                    }
                    this.isLoading = false;

                });
            }
            return false;
            },
           
        },
        validations () {
            return {
                name: {
                    required:helpers.withMessage(this.$t('notempty'), required)
                },
                // target: {
                //     required:helpers.withMessage(this.$t('notempty'), required)
            
                // }
            }
            
        },
        setup() {
            
            return { v$: useVuelidate() }
        },
         mounted() {
            console.log(this.target);
        },
        props: {
            title: {
                type: String,
                default: ""
            },
            type:{
                type:String,
                default:""
            },
            item: {
                type: Object,
                default: function () {
                    return {
                        name:'',
                        target:'',
                        status:1,
                        id:'',
                       
                    }
                }
            },
        
            
            
        }
    };
</script>


<template>
    <div>
        <div class="modal-header p-3 bg-info-subtle">
            <h5 class="modal-title">{{ this.title }} {{ this.type }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <form @submit.prevent="updateOrCreateSource" >
        <div class="modal-body">
            <p v-if="errors_msg.length" class="alert alert-danger">
                <b>Please correct the following error(s):</b>
                <ul class="mb-0">
                    <li v-for="(error,key) in errors_msg" :key="key">{{ error }}</li>
                </ul>
            </p>
            <p v-if="success_msg!=''" class="alert alert-success">
                {{success_msg}}
            </p>

            
            <div class="mb-3">
                <label class="form-label">{{ $t('ten') }} (<span class="text-danger">*</span>)</label>
                <input type="text" v-model="name" class="form-control" :placeholder=" $t('ten') " >
            </div>
            
            <div class="mb-3" v-if="type=='source'">
                <label class="form-label">Áp dụng cho online</label>
                
                <select class="form-select mb-3"  v-model="target">
                    <option value="">{{ $t('chon') }}</option>
                    <option value="doitac-ctv">{{ $t('doitac-ctv') }}</option>
                    <option value="website">Website</option>
                </select>
            </div>
            <div class="mb-3">
                <div class="form-check form-switch" dir="ltr">
                    <input type="checkbox" class="form-check-input" id="customSwitchsizesm" v-model="status">
                    <label class="form-check-label" for="customSwitchsizesm">{{ $t('khadung') }}</label>
                </div>

            </div>
        </div>
        <div class="modal-footer"> 
            
            <BButton :loading="isLoading" type="submit" class="btn btn-success"> {{item.id?$t('capnhat'):$t('them')}}</BButton> 
            <button type="button" class="btn btn-danger" @click="close"> <i class="ri-close-line"></i>{{ $t('dong') }} </button>  
        </div> 
        </form>
  </div>
</template>