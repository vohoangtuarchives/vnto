import api from "@/services/api";
//import { get, set } from 'idb-keyval';
import tokenService from '../../services/token.service';

export default ({
    state: {
        list: [],
    },
    mutations: {
        setList(state, data) {
            state.list = data;
        },
    },
    getters:{
        getList(state) {
            return state.list;
        },
        getUser: (state) => (id = null) => {
            let data = state.list;
            if (id !== null) {
                data = Object.fromEntries(
                    Object.entries(data).filter(([, value]) => value.id === id)
                );
            }
            return data[0];
        }
    },
    actions: {
        async getUserList({ commit }) {

            const user = tokenService.getUser();
            if(user==null)
                return
            //var city = await get('city');
            // var district = await get('district');
            // var wards = await get('wards');
            // var country = await get('country');
            await api.get('user/list').then((response)=>{
                console.log(response);
                commit('setList', response.data.data);
                // set('country', response.data.data.country);
                // set('city', response.data.data.city);
                // set('district', response.data.data.district);
                // set('wards', response.data.data.wards);

            }).catch(function (error) {
                console.log('error_catch',error);
            })


            // commit('setTinhThanh', city);
            // commit('setQuanHuyen', district);
            // commit('setPhuongXa', wards);

        },
    },
    namespaced: true,
});