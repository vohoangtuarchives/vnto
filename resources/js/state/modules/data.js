import api from "@/services/api";
import { get, set } from 'idb-keyval';
import tokenService from '../../services/token.service';

export default ({
    state: {
      location: [],
      data: [],
     
    },
    mutations: {
      setLocation(state, data) {
        state.location = data;
      },
      setData(state, data) {
        state.data = data;
      },
    },
    getters:{
      getLocation(state) {
        return state.location;
      },
      getData(state) {
        return state.data;
      },
      getCountry(state){
        return state.location.country;
      },

      getCountryById: (state) => (country_code = null) => {
        let data = state.location.country;
        return data[country_code];
      },

      getCityById: (state) => (id = null) => {
        let data = state.location.city;
        return data[id];
      },
      getDistrictById: (state) => (id = null) => {
        let data = state.location.district;
        return data[id];
      },
      getWardsById: (state) => (id = null) => {
        let data = state.location.wards;
        return data[id];
      },
      getCity: (state) => (country_code = null) => {
        let data = state.location.city;
        if (country_code !== null) {
          data = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value.country === country_code)
          );
        }
        return data;
      },
      getDistrict: (state) => (parent_code = null) => {
        let data = state.location.district;
        if (parent_code !== null) {
          data = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value.parent_code === parent_code)
          );
        }
        return data;
      },
      getWards: (state) => (parent_code = null,id=null) => {
        let data = state.location.wards;
        if (parent_code !== null) {
          data = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value.parent_code === parent_code)
          );
        }
        if(id!=null){
          return Object.entries(data).filter(([, value]) => value.id === id)
        }
        return data;
      }
     
    },
    actions: {
      async initializeData({ commit }) {

        const user = tokenService.getUser();
        if(user==null)
          return
          var location = await get('setLocation');
          
        if(!location){
            await api.get('setting/intialize').then((response)=>{
              commit('setLocation', response.data.data.location);
              set('setLocation', response.data.data.location);
              delete response.data.data.location;
              commit('setData', response.data.data);
              
              set('setData', response.data.data);
             
            }).catch(function (error) {
            console.log('error_catch',error);
          })
        }else{
          commit('setLocation', await get("setLocation"));
          commit('setData',await get("setData"));
        }
       
      },
    },
    namespaced: true,
  });