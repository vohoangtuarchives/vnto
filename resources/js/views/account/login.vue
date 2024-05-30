<script>
import {ref} from "vue";
import {
  required,
  email,
  helpers
} from "@vuelidate/validators";

import {useUserStore} from "@/stores/user.store.js";

import {mapActions} from 'vuex'
import {
  authMethods,
  notificationMethods,
} from "@/state/helpers";


export default {
  setup(){
    const userStore = useUserStore();
    return{userStore};
  },
  components: {
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
      rememberMe: true,
      csrfToken: ""
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
  },
  computed: {

  },
  methods: {
      async signinapi() {
      this.authError = null;
      this.processing = true;
      this.isAuthError = false;
      try {
          let isAuth = await this.userStore.login({email:this.email,password:this.password,_token: this.csrfToken});
          if(isAuth){
            alert(isAuth)
            this.$router.push("/");
            this.processing = false;
          }
      }catch (e) {
          alert(e)
          this.authError = 'Network error'
      }


      //   response.then(
      //   (response) => {
      //     this.userStore.setUser(JSON.stringify(response.data.data.user));
      //
      //      this.$router.push("/");
      //      this.processing = false;
      //   },
      //   (error) => {
      //     this.processing = false;
      //     this.isAuthError = true;
      //     try{
      //       if(error.response.data.data==undefined){
      //         this.authError = error.message
      //       }else{
      //         this.authError = error.response.data.data
      //       }
      //     }catch(e){
      //       console.log(e)
      //       this.authError = 'Network error'
      //     }
      //   }
      // );
      },
      getData(){
          const  conditionsBanner = {
            status: 1,
            type: this.typeBanner
        };
        axios.get('/api/sanctum/csrf-cookie').then(response => {
          this.csrfToken = response.csft_token
        });
      },
    }
};
</script>

<template>
  <div class="auth-page-wrapper">
    <div class="auth-page-content bg-dark">
      <BRow>
<!--        <BCol class="mt-0 px-0 d-none d-sm-block" lg="8" xl="8 "  md="8 ">-->
<!--          <div class="banner-login">-->
<!--            <div v-if="this.dataBanner.length">-->
<!--              <Carousel :value="this.dataBanner" :numVisible="1" :numScroll="1" circular:false :autoplayInterval="3000"  :showNavigators="false" :showIndicators="false">-->
<!--                <template #item="slotProps">-->
<!--                    <div class="">-->
<!--                      <div v-if="slotProps.data.link" >-->
<!--                          <router-link :to="slotProps.data.link" class="text-reset">-->
<!--                            <img :src="this.imageLink(this.typeBanner+'/'+slotProps.data.name_file)" :alt="slotProps.data.link" class="w-full h-full" />-->
<!--                          </router-link>-->
<!--                      </div>-->
<!--                      <div v-else >-->
<!--                          <img :src="this.imageLink(this.typeBanner+'/'+slotProps.data.name_file)" :alt="slotProps.data.link" class="w-full h-full" />-->
<!--                      </div>-->
<!--                    </div>-->
<!--                </template>-->
<!--              </Carousel>-->
<!--            </div>-->
<!--            <div v-else></div>-->
<!--          </div>-->
<!--        </BCol>-->
        <BCol md="6" lg="4" xl="3" class="p-0 mx-auto">
          <BCard no-body class="p-4 bg-login">
              <div class="text-center mt-2 title-login">
                <p class="m-0 mt-4 text-uppercase">Sign in to continue to system.</p>
              </div>
              <div class="p-2 mt-4 w-100">
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
                    <input class="form-check-input" type="checkbox" value="" id="auth-remember-check" v-model="rememberMe"/>
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