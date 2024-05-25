import api from "./api";

class SettingService {
  updateOrCreateSource(item) {
    if(item.id){
        return api
      .put("/setting/customer-source/create/"+item.id, item)
      .then((response) => {
        return response;
      });    
    }
    return api
      .post("/setting/customer-source/create", item)
      .then((response) => {
        return response;
      });
  }
  async getCustomerData()  {
    return await api
    .get("/setting/customer-source?type=all")
    .then((response) => {
      return response.data.data;
    });
  }
  getListCustomerSource(page=1,type){
    return api
    .get("/setting/customer-source?type="+type+"&page="+page)
    .then((response) => {
      return response;
    });
  }
  getOptions(params){
    return api
    .get("/options",{params:params})
  }
  updateOptions(type,data){
  
    return api
    .post("/options/update",{type,data})
  }


}

export default new SettingService();
