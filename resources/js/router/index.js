import { createWebHistory, createRouter } from "vue-router";
import routes from './routes';
import store from "@/state/store";
import appConfig from "../../app.config";
import TokenService from "@/services/token.service";
import api from "@/services/api";
import NProgress from 'nprogress';
const pem =  store.getters['auth/getPem'];
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
  NProgress.start();
  
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);
  if (!authRequired) {
    return next();
  }

  // try {
  //   // Kiểm tra xem người dùng đã đăng nhập hay chưa
  //   // const response = await api.get('auth/check');
  //   // TokenService.setPem(response.data.data);
  //   // await store.dispatch('auth/setPem');
  //
  //
  //
  //
  // } catch (error) {
  //   // Nếu không, thử làm mới token
  //   try {
  //     const refreshedToken = await api.post('auth/refresh', {'refresh_token': TokenService.getLocalRefreshToken()});
  //     TokenService.updateLocalAccessToken(refreshedToken.data.access_token);
  //   } catch (refreshError) {
  //     // Nếu làm mới token không thành công, chuyển hướng đến trang đăng nhập
  //     TokenService.removeUser();
  //     return next({ name: 'login' });
  //   }
  // }
  //
  //
  //
  //
  // if (routeTo.meta.requiredRoles && routeTo.meta.requiredRoles.length) {
  //   const hasRequiredRoles = routeTo.meta.requiredRoles.every(role => pem.includes(role));
  //
  //   if (!hasRequiredRoles && !pem.includes('*')) {
  //     alert("Khoông coó quyeênền truy capâpập");
  //
  //     return next('/');
  //   }
  // }

  // Nếu mọi thứ đều ổn, cho phép tiếp tục
  next();
});


router.beforeEach((routeTo, routeFrom, next) => {
    const publicPages = ['/login', '/register', '/forgot-password','/user-profile'];
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
