import { createWebHistory, createRouter } from "vue-router";
import routes from './routes';
import appConfig from "../../app.config";
import TokenService from "@/services/token.service";
import api from "@/services/api";
import NProgress from 'nprogress';
const router = createRouter({
  history: createWebHistory(),
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach(async (routeTo, routeFrom, next) => {
    NProgress.start()
   const authRequired = routeTo.matched.some((route) => route.meta.authRequired);

  if (!authRequired) return next();

  await api.get('auth/user-profile').then((data) => {
    TokenService.setUserInfo(data.data.user);
    next();
  }).catch(async (res) =>  {
   
    if(res.status!=undefined || res.status==401){
      await api.post('auth/refresh',{'refresh_token':TokenService.getLocalRefreshToken()}).then((data) => {
        TokenService.updateLocalAccessToken(data.data.access_token);
        next();
      }).catch(()=>{
        next({ name: 'login'});
      });  
    }else{
      TokenService.removeUser();
      next({ name: 'login'});
    }
   });
});

router.beforeEach((routeTo, routeFrom, next) => {

    const publicPages = ['/login', '/register', '/forgot-password'];

    const authpage = !publicPages.includes(routeTo.path);

    const loggeduser = localStorage.getItem('user');

    if (authpage && !loggeduser) {
      return next('/login');
    }
    next();
 
});

router.beforeResolve(async (routeTo, routeFrom, next) => {
  console.log("ROUTER TO:",routeTo.name);

    // Start the route progress bar.

  try {
    
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
      
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
           
            if (args.length) {
           
              next(...args);
              reject(new Error('Redirected'));
            } else {
              resolve();
            }
          });
        } else {
         
          resolve();
        }
      });
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (error) {
    return;
  }
  document.title = routeTo.meta.title + ' | ' + appConfig.title;
  // If we reach this point, continue resolving the route.
  next();
});
router.afterEach(() => {
  NProgress.done()
})

export default router;
