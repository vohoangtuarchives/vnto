class TokenService {
    getLocalRefreshToken() {
      const user = JSON.parse(localStorage.getItem("user"));
     
      return user?.refresh_token;
    }
  
    getLocalAccessToken() {

      const user = this.getUser();
      return user?.access_token;
    }
  
    updateLocalAccessToken(token) {
      let user = JSON.parse(localStorage.getItem("user"));
      user.access_token = token;
      localStorage.setItem("user", JSON.stringify(user));
    }
    setUserInfo(data,key) {
     
      let storage = JSON.parse(localStorage.getItem("user"));
      
      if(!key){
          storage.user = data;
      }else{
        eval("storage.user."+key+" = data;");
      }
  
      localStorage.setItem("user", JSON.stringify(storage));
    }
    getUser() {
      return JSON.parse(localStorage.getItem("user"));
    }
   
    setUser(user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  
    removeUser() {
      localStorage.removeItem("user");
    }
  }
  
  export default new TokenService();
  