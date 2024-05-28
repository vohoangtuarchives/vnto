class TokenService {
    getLocalRefreshToken() {
      const user = JSON.parse(localStorage.getItem("user"));
     
      return user?.refresh_token;
    }
  
    getLocalAccessToken() {

      const user = this.getUser();
      return user?.access_token;
    }
    getUserField(field){
       const user = this.getUser();
       return user.user.user[field];
        
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
    getPem() {
      return JSON.parse(localStorage.getItem("pem"));
    }
    setPem(data){
      localStorage.setItem("pem", JSON.stringify(data));
    }
  
    removeUser() {
      localStorage.removeItem("user");
      localStorage.removeItem("pem");
    }
  }
  
  export default new TokenService();
  