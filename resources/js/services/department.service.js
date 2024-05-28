import api from "./api";

class DepartmentService{
    getList(data){
        return api
            .get("/organization/departments",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }
    getPivotDepartmentJobPosition(params){
        return api
            .get("/organization/pivot-department-jobposition",{params:params})
            .then((response) => {
                return response;
            });
    }


    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/organization/departments/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/organization/departments", item)
            .then((response) => {
                return response;
            });
    }
    destroy(id){
        return api
        .delete("/organization/departments/"+id)
        .then((response) => {
            return response;
        });
    }

}

export default new DepartmentService();