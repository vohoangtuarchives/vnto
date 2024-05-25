
<script>
  import AmenitiesService from "@/services/amenities.service";
  import { useVuelidate } from '@vuelidate/core'
  import {
    required,
    helpers,
   
} from '@vuelidate/validators'
const myCustomValidator = (value) => !helpers.req(value) || value !=0

    export default {
        name: "SupplierAmenitiesFormModalComponent",
        data() {
            const dataInsert = this.item;
            if(dataInsert.status  == undefined || dataInsert.status==1){
                dataInsert.status = true;
            }   
            if(dataInsert.category_id==null){
                dataInsert.category_id=0; 
            }

            alert(dataInsert.status);
          
            return {
                errors_msg: [],
                isLoading:false,
                success_msg:'',
                dataInsert,
            };
        },
        validations() {
            
            return {
                dataInsert: {
                    name:{
                        required: helpers.withMessage(this.$t('notempty',{'name':this.$t('tenthuoctinh')}), required),
                        
                    },
                   category_id:{
                       required: helpers.withMessage(this.$t('notempty_select',{'name':this.$t('nhomthuoctinh')}), required),
                       myCustomValidator:helpers.withMessage(this.$t('notempty_select',{'name':this.$t('nhomthuoctinh')}), myCustomValidator),
                       
                       
                    }
                    
                },
        
            }
        },
        created() {
         
        },
        methods: {
            close() {
                this
                    .$vbsModal
                    .close();
            },
            async submitForm() {
             
                this.success_msg='';
                if (!this.isLoading) {
                    this.isLoading = true;
                    this.errors_msg = [];
                    const result = await this.v$.$validate()

                    if (!result) {
                        let that = this;
                        this.v$.$errors.forEach(function (error) {
                            console.log(error);
                            that.errors_msg.push(error.$message);
                        });
                        this.isLoading = false;
                        return
                    }  
                    
                    AmenitiesService.create(this.dataInsert).then((rs) => {
                       
                        if (rs.data.status == false) {
                            this.errors_msg.push(rs.data.data);
                        } else {
                            
                            if (!this.dataInsert.id) {
                                this.success_msg = this.$t('themmoithanhcong');
                            } else {
                                this.success_msg = this.$t('capnhatthanhcong');
                            }
                            setTimeout(() => {
                                this.$emit("onUpdate");
                                this.close();
                            }, (1500));
                        }
                        this.isLoading = false;
                        console.log(rs);
                    });
                }
                return false;
            },
            
        },
        setup() {
            
            return {v$: useVuelidate()}
        },
        mounted() {
            console.log(this.category);

        },
        props: {
            item: {
                type: Object,
                default: function () {
                    return {
                        id:null,
                        name:null,
                        status:true,
                        category_id:0
                    }
                }
            },
            category:{
                type: Object,
                default:function(){

                }
            }
        
          
            
        }
    };
</script>

<template>
    <div id="login">
        <div class="modal-header p-3 bg-info-subtle">
            <h5 class="modal-title">{{ this.iditem==''?$t('t-themmoi'):$t('t-dieuchinh') }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <BForm @submit="submitForm" @reset="onReset">
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

                <BFormGroup :label="this.$t('nhomthuoctinh')" class="mb-2">
                    <BFormSelect class="mt-3" :options="this.category" v-model="dataInsert.category_id"/>
                </BFormGroup>
                <BFormGroup :label="this.$t('tenthuoctinh')" class="mb-2">
                <BFormInput  v-model="dataInsert.name"/>
                </BFormGroup>
             
                <div class="form-check form-switch" dir="ltr">
                    <input type="checkbox" class="form-check-input" id="customSwitchsizesm"  v-model="dataInsert.status">
                    <label class="form-check-label" for="customSwitchsizesm">{{ $t('khadung') }}</label>
                </div>

            </div>
            <div class="modal-footer">
                <BButton type="submit" variant="primary" :loading="isLoading" :loadingText="$t('vuilongcho')">Submit</BButton>
                <BButton type="reset" variant="danger">Reset</BButton>
            </div>
        </BForm>
    </div>
</template>