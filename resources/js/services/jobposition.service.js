import api from "./api";

class JobPositionService{
    getList(data){
        return api
            .get("/organization/job-position",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }

    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/organization/job-position/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/organization/job-position", item)
            .then((response) => {
                return response;
            });
    }
    Destroy(id){
        return api
        .delete("/organization/job-position/"+id)
        .then((response) => {
            return response;
        });
    }

}

export default new JobPositionService();