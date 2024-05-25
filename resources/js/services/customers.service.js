import api from "./api";
class CustomersService {
  async create(data) {
    return api
      .post("/customer/create", data)
      .then((response) => {
        return response;
      });
  }
  async getCustomers(page=1)  {
    return api
    .get("/customer?page="+page)
    .then((response) => {
      return response;
    });
  }

  
}

export default new CustomersService();
