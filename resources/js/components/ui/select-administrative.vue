<script>

    import Dropdown from 'primevue/dropdown';
    import { integer } from '@vuelidate/validators';
    import { mapGetters } from 'vuex'
    export default {
        components: {
            Dropdown
        },
        watch: {
            parent(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.loadData(newValue);
                }
            }
        },
        methods: {
            loadData(value) {
                let tmp = [];
                this.data = [];
                if(this.type=='city'){
                    tmp = this.$store.getters['data/getCity'](value);
                }
                if(this.type=='district'){
                    tmp = this.$store.getters['data/getDistrict'](value);
                }
                if(this.type=='wards'){
                    tmp = this.$store.getters['data/getWards'](value);
                }
                Object.keys(tmp).forEach(key => {
                    this.data.push({'id':key,'name':tmp[key].name_with_type});
                });
            }

        },
        data() {
            return {
              
                data:[],
                value:null,
                input:false
            }
        },
        async created()  {  
            if(this.type=="country"){
                try{
                let tmp = await this.getCountry;
             
                Object.keys(tmp).forEach(key => {
                    this.data.push({'id':key,'name':tmp[key]});
                });
            }catch(error){
                console.error(error);
            }
            }

        },
        async mounted() {
            if(this.type!="country"){
                this.loadData(this.parent);
            }
        },
        computed: {
            ...mapGetters('data',['getCountry','getCity']),
            selected: {
                get() {
                    // if(this.data.length){
                    // }
                   return this.value;
                },
                set(data) {
                   
                    this.$emit('update:modelValue', data.id);
                    this.value =data;

                }

            }
        },
        props: {
            parent:{
                type:[integer,String]
            },  
            title: {
                type: String,
               
            },
            type: {
                type: String
            },
            modelValue: {
                type: [integer,String],
                
            },
            disabled:{default:false,type:[String,Boolean]}
        }
    };
</script>
<template>
    <div class="input-group  flex-row">
        <div class="form-control border-0 p-0 m-0">
            <Dropdown
                :disabled="this.disabled"
                v-model="selected"
                :options="data"
                filter="filter"
                optionLabel="name"
                :placeholder="$t('chon')"
            
                class="w-100"></Dropdown>
        </div>
    </div>
</template> 
<style>
    .p-dropdown-panel ul,
    .p-multiselect-items {
        padding-left: 5px;
        margin: 0;
    }
    .p-dropdown {
        height: 37px;
    }
    span.p-dropdown-label.p-inputtext {
        font-size: 14px;
    }
    .p-dropdown-panel .p-dropdown-items .p-dropdown-item {
        font-size: 14px;
    }
</style>