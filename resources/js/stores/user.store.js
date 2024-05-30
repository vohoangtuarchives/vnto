// src/stores/exam.js
import { defineStore } from 'pinia';
import {useAuthStore} from "@/stores/auth.store.js";

const authStore = useAuthStore();

export const useUserStore = defineStore('user', {
    // Khai báo state

    state: () => ({
        user: null,
        userList: []
    }),

    // Khai báo getters
    getters: {
        getUser(state) {
            return state.user;
        },
    },

    // Khai báo actions
    actions: {
        setUser(obj){
            this.user = obj;
            authStore.setUser(obj);
            localStorage.setItem("user", obj);
        },
        setToken(token){
            authStore.setToken(token);
        },
        async login(credentials){
            return axios.post("api/auth/login", credentials).then(
                (response) => {
                    let success = response.data.success;
                    if(success){
                        let objToken = response.data.data.token;
                        let ojbUser =  JSON.stringify(response.data.data.user);
                        this.setUser(ojbUser);
                        this.setToken(objToken);
                        return success;
                    }else{
                        throwError(
                            response.data.errors.message
                        )
                    }

                },
                (error) => {
                    return error;
                }
            )
        }
    }
});
