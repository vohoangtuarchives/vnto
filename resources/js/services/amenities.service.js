import api from './api';

class AmenitiesService {
  getList() {
    return api.get('/amenities/group/list');
  }
  getItemByList(id){
    return api.get('/amenities/item/list?id='+id);
  }
  create(data){
    return api.post('/amenities/item/create',data);
  }
  getItems(params){
    return api.get('/amenities/item/index',{params:params});
  }
 
}

export default new AmenitiesService();
