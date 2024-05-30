// src/stores/exam.js
import { defineStore } from 'pinia';
import appConfig from "@/configs/app.config";
import routes from "@/router/routes";
import {useAuthStore} from "@/stores/auth.store";

export const useActionStore = defineStore('action', {
    // Khai báo state
    state: () => ({
    }),
    // Khai báo getters
    getters: {
    },
    // Khai báo actions
    actions: {
        imageLink(str) {
            return appConfig.APP_UPLOAD + str;
        },
        getPem(){
            return useAuthStore().getPem || [];
        },
        findRouterByName(routers, name) {
            let foundRouter = null;

            function search(router) {
                if (router.name === name) {
                    foundRouter = router;
                    return true;
                }

                if (router.children && router.children.length > 0) {
                    for (const child of router.children) {
                        if (search(child)) {
                            return true;
                        }
                    }
                }

                return false;
            }

            routers.forEach(router => {
                if (!foundRouter) {
                    search(router);
                }
            });

            return foundRouter;
        },
        canAny(listPermission){
            let pem = this.getPem();
            if(pem.includes('*'))
                return true;
            return listPermission.some(permission => pem.includes(permission));
        },
        canAll(listPermission){
            let pem = this.getPem();
            if(pem.includes('*'))
                return true;
            console.log(pem);

            return listPermission.every(permission => pem.includes(permission));
        },
        can(action){
            let pem = this.getPem();
            if(pem.includes('*'))
                return true;
            let rs = pem.includes(action);
            return rs;
        },
        canLink(routerName){
            let pem = this.getPem();
            if(pem.includes('*'))
                return true;
            let find = this.findRouterByName(routes,routerName);
            let next = true;
            

            if(find && find.meta && find.meta.requiredRoles){

                console.error("find:",find,routerName,find.meta.requiredRoles,pem);
                next = find.meta.requiredRoles.every(role => pem.includes(role));
            }

            return next;

        },
    }
});
