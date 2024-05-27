<script>

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
      crsf_token: ""
    };
  },
mounted(){
  axios.get('/api/sanctum/csrf-cookie').then(response => {
    this.crsf_token =  response.data.csrf_token;
  });
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
  computed: {
    ...mapActions('data', ['initializeData']),
   
  },
  methods: {
    ...authMethods,
    ...notificationMethods,
   
      signinapi() {
      this.authError = null;
      this.processing = true;
      this.isAuthError = false;
      this.$store.dispatch("auth/login", {
        _crsf: this.crsf_token,
        email:this.email,password:this.password}).then(
        (response) => {
          console.log(response)
          if(response.success){
            this.$router.push("/");
            this.initializeData;
            this.processing = false;
          }

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
      
      

      }
    }
   
};
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>

      <div class="shape">

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>

    <div class="auth-page-content">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link to="/" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo-light.png" alt="" height="20" />
                </router-link>
              </div>
             
            </div>
          </BCol>
        </BRow>

        <BRow class="justify-content-center">
          <BCol md="8" lg="6" xl="5">
            <BCard no-body class="mt-4">
              <BCardBody class="p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">{{ $t("t-dashboards") }}</h5>
                  <p class="text-muted">Sign in to continue to Velzon.</p>
                </div>
                <div class="p-2 mt-4">

                  <BAlert v-model="isAuthError" v-if="isAuthError==true" variant="danger" class="mt-3" dismissible v-html="authError"></BAlert>

                  <div>

                  </div>

                  <form @submit.prevent="tryToLogIn">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email" />
                      <div class="invalid-feedback">
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
                        <BButton variant="link" @click="showInput=!showInput" class="position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button" id="password-addon">
                          <i class="ri-eye-fill align-middle"></i>
                        </BButton>
                        <div class="invalid-feedback">
                          <span></span>
                        </div>
                      </div>
                    </div>

                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                      <label class="form-check-label" for="auth-remember-check">Remember
                        me</label>
                    </div>

                    <div class="mt-4">
                      <BButton variant="success" class="w-100" type="submit" @click="signinapi" :disabled="processing" :loading="processing" loadingText="Please wait ">
                        Sign In
                      </BButton>
                    </div>

                    
                  </form>
                </div>
              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
      </BContainer>
    </div>

    <footer class="footer">
      <BContainer>
        <BRow>
          <BCol lg="12">
            <div class="text-center">
              <p class="mb-0 text-muted">
                &copy; {{ new Date().getFullYear() }} Velzon. Crafted with
                <i class="mdi mdi-heart text-danger"></i> by Themesbrand
              </p>
            </div>
          </BCol>
        </BRow>
      </BContainer>
    </footer>
  </div>
</template>