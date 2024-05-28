<script>
import {ref} from "vue";
import Carousel from 'primevue/carousel';
import uploadPhotoService from "@/services/uploadPhoto.service";
import {
  required,
  email,
  helpers
} from "@vuelidate/validators";

import {mapActions} from 'vuex'
import {
  authMethods,
  notificationMethods,
} from "@/state/helpers";


export default {
  components: {
    Carousel,
  },
  data() {
    return {
      email: "test@example.com",
      password: "password",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      processing: false,
      showInput:false,
      dataBanner: ref([]),
      urlLogo:null,
      typeBanner: 'banner-login',
      typeLogo: 'logo-login',
    };
  },
  validations: {
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Please enter valid email", email),
    },
    password: {
      required: helpers.withMessage("Password is required", required),
    },
  },
  created(){
    this.getData();
    this.getDataLogo();
  },
  computed: {
    ...mapActions('data', ['initializeData','getSetting']),
    ...mapActions('auth', ['setPem']),
   
  },
  methods: {
    ...authMethods,
    ...notificationMethods,
      signinapi() {
      this.authError = null;
      this.processing = true;
      this.isAuthError = false;
      this.$store.dispatch("auth/login", {email:this.email,password:this.password}).then(
        () => {
           this.$router.push("/");
           this.initializeData;
           this.getSetting;

           this.processing = false;

        },
        (error) => {
          this.processing = false;   
          this.isAuthError = true;
          try{
            if(error.response.data.data==undefined){
              this.authError = error.message
            }else{
              this.authError = error.response.data.data
            }
          }catch(e){
            this.authError = 'Network error'
          }
        }
      );
      },
      getData(){
          const  conditionsBanner = {
            status: 1,
            type: this.typeBanner
        };
        uploadPhotoService.getBanner(conditionsBanner).then((response)=>{
          this.dataBanner = response.data.data;
        })
      },
      async getDataLogo() {
        try {
          const response = await uploadPhotoService.getItem(this.typeLogo);
          if(response.data.data){
            this.urlLogo= this.imageLink(this.typeLogo+'/'+response.data.data.name_file);
          }
        } catch (error) {
          console.error('Error while fetching data:', error);
        }
      },
    }
};
</script>

<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-content bg-dark">
      <BRow>
        <BCol class="mt-0 px-0 d-none d-sm-block" lg="8" xl="8 "  md="8 ">
          <div class="banner-login">
            <div v-if="this.dataBanner.length">
              <Carousel :value="this.dataBanner" :numVisible="1" :numScroll="1" circular:false :autoplayInterval="3000"  :showNavigators="false" :showIndicators="false">
                <template #item="slotProps">
                    <div class="">
                      <div v-if="slotProps.data.link" >
                          <router-link :to="slotProps.data.link" class="text-reset">
                            <img :src="this.imageLink(this.typeBanner+'/'+slotProps.data.name_file)" :alt="slotProps.data.link" class="w-full h-full" />
                          </router-link>
                      </div>
                      <div v-else >
                          <img :src="this.imageLink(this.typeBanner+'/'+slotProps.data.name_file)" :alt="slotProps.data.link" class="w-full h-full" />
                      </div>
                    </div>
                </template>
              </Carousel>
            </div>
            <div v-else></div>
          </div>
        </BCol>
        <BCol md="4" lg="4" xl="4" class="p-0">
          <BCard no-body class="p-4 bg-login">
              <div class="text-center mb-4 text-white-50">
                <div>
                  <router-link to="/" class="d-inline-block auth-logo">
                    <img :src="this.urlLogo" alt="" width="250" style="max-width:100%;"  />
                  </router-link>
                </div>
              </div>
              <div class="text-center mt-2 title-login">
                <h2 class="m-0">CÔNG TY CỔ PHẦN TM VÀ DV DU LỊCH VIETNAM TOURIST</h2>
                <p class="m-0 mt-4 text-uppercase">Sign in to continue to system.</p>
              </div>
              <div class="p-2 mt-4">
                <BAlert v-model="isAuthError" v-if="isAuthError==true" variant="danger" class="mt-3" dismissible v-html="authError"></BAlert>
                <form @submit.prevent="tryToLogIn">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email" />
                    <div class="invalid-feedback ">
                      <span></span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="float-end">
                      <router-link to="/forgot-password" class="text-muted">Forgot
                        password?</router-link>
                    </div>
                    <label class="form-label" for="password-input">Password</label>
                    <div class="position-relative auth-pass-inputgroup mb-3">
                      <input :type="showInput?'text':'password'" v-model="password" class="form-control pe-5" placeholder="Enter password"
                        id="password-input" />
                      <BButton variant="link" @click="showInput=!showInput" class="position-absolute end-0 top-0 text-decoration-none text-muted "
                        type="button" id="password-addon">
                        <i class="ri-eye-fill  text-white"></i>
                      </BButton>
                      <div class="invalid-feedback">
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                    <label class="form-check-label" for="auth-remember-check">Remember me</label>
                  </div>
                  <div class="mt-4">
                    <BButton class="w-100 " type="submit" @click="signinapi" :disabled="processing" :loading="processing" loadingText="Please wait ">
                      Sign In <i class="ri-arrow-right-line text-white"></i>
                    </BButton>
                  </div>
                </form>
              </div>
          </BCard>
        </BCol>
      </BRow>
  </div>
  </div>
</template>