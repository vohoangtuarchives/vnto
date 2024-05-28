import api from './api';

class UserService {
  create(data){
    return api.post('/auth/register',data);
  }
  updateInfo(data){
    return api.patch('/user/info',data);
  }
  updatePassword(data){
    return api.patch('/user/password',data);
  }
  getPublicContent() {
    return api.get('/test/all');
  }

  getUserBoard() {
    return api.get('/test/user');
  }

  getModeratorBoard() {
    return api.get('/test/mod');
  }

  getAdminBoard() {
    return api.get('/test/admin');
  }

  getList() {
      return api.get('/user/list');

  }

}

export default new UserService();
