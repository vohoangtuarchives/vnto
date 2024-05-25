import api from "./api";
import TokenService from "./token.service";

class AuthService {
  login(user) {
    
    return api
      .post("/auth/login", user)
      .then((response) => {
        if (response.data.access_token) {
          
           TokenService.setUser(response.data);
        }
        //load data country, cities, provinces, district, wards ...

        return response.data;
      });
  }
  updateInfo(data){
    return  api.patch('/user/info',data);
  }
  checkLogin() {
    return api
      .post("/auth/check-login");
  }
  upload(data){

    let formdata = new FormData();
    Object.keys(data).forEach(function(key) {
      formdata.append(key, data[key]); 
      console.log(key, data[key]);
    });
    formdata.append('file', data.file); 
    return api.post(
    ("/upload"), 
    data,
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    )
  }

  logout() {
    api
        .post("/auth/logout",)
        .then(() => {
          TokenService.removeUser();
     });
    return  false;
  
  }

  register({ username, email, password }) {
    return api.post("/auth/register", {
      username,
      email,
      password
    });
  }
}

export default new AuthService();
