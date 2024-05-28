import AuthService from '@/services/auth.service';
import TokenService from "@/services/token.service";
import tokenService from '../../services/token.service';
const user = TokenService.getUser();
const initialState = user ? { status: { loggedIn: true }, user,permission: null } : { status: { loggedIn: false }, user: null,permission: null };

  const state = initialState
  const getters = {
    isLoggedIn(state) {
      return state.status.loggedIn;
    },
    getUserData(state) {
     
      return state.user;
    },
    getPem(state){
      return state.permission;
    }
  };
  const actions = {
    async login({ commit }, userData) {
      try {
        const user = await AuthService.login(userData); // Giả sử AuthService.login trả về lời hứa
        TokenService.setUserInfo(user);
        commit('loginSuccess', user);
        return Promise.resolve(user); // Giải quyết với dữ liệu người dùng
      } catch (error) {
        commit('loginFailure');
        console.error('Lỗi đăng nhập:', error); // Ghi nhật ký lỗi để gỡ lỗi
        throw error; // Ném lại lỗi để cho phép xử lý ở cấp thành phần (tùy chọn)
      }
    },

     async checkLogin({ commit })  {  
      var x = await AuthService.checkLogin();
      if(x.status!==200){
        commit('loginFailure');
      }
      
      
    },
    updatePhoto({commit},data){
      return AuthService.upload(data).then(
        response => {
          if(response.data.status==true){          
            commit('changeUserInfo',{data:response.data.data.url,type:response.data.data.type});
          }
          return Promise.resolve(response);
        },
        error => {
        //  commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    },
    refreshToken({ commit }, accessToken) {
      commit('refreshToken', accessToken);
    },
    updateInfo({ commit },data){
      return AuthService.updateInfo(data).then((x) => {
       
        if(x.data.status==true){
         commit('changeUserInfo',x.data.data);
        }
        return Promise.resolve(x);
      })
      .catch(error => {
        throw error
      });
    },
    setPem({ commit }){
      const pem = tokenService.getPem();     
      commit('SET_PERMISSION',pem);
    },


  }
  const mutations = {
    
    changeUserInfo(state,user){
      if(user.type!=undefined){
        tokenService.setUserInfo(user.data,user.type);
      }else{
        tokenService.setUserInfo(user);
      }
      user = TokenService.getUser();
      console.log("user in token service",user);
      state.user = user;
    },
    loginSuccess(state, user) {
       state.status.loggedIn = true;
       state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    refreshToken(state, accessToken) {
      state.status.loggedIn = true;
      state.user = { ...state.user, accessToken: accessToken };
    },
    SET_PERMISSION(state, permission) {
      state.permission = permission;
      
    }
  }

export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}