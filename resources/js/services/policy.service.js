import api from "./api";

class PolicyService{
    getAll(){
        return api
            .get("/service-policy/")
            .then((response) => {
                return response;
            });
    }
    getList(data){
        return api
            .get("/service-policy/service-policies",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }
    getItem(id){
        return api
            .get("/service-policy/"+id)
            .then((response) => {
                return response;
            });
    }

    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/service-policy/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/service-policy/", item)
            .then((response) => {
                return response;
            });
    }

    destroy(id) {
        return api
            .delete("/service-policy/"+id)
            .then((response) => {
                return response;
            });
            
    }
    destroyAll(ids) {
        return api
            .post("/service-policy/del-all-post",{
                ids: ids 
            })
            .then((response) => {
                return response;
            });
    }
    pause(item) {
        if(item.id){
            return api
                .put("/service-policy/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
    }

}

export default new PolicyService();