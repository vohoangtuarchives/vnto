import api from "./api";

class OrganizationService{

    getBranchList(page=1){
        return api
            .get("/organization/branchs?page="+page)
            .then((response) => {
                return response;
            });
    }
    getUnitTree(){
        return api
        .get("/organization/unit-tree")
        .then((response) => {
            return response;
        });
    }
    getUnits(){
        return api
        .get("/organization/units-select-tree")
        .then((response) => {
            return response;
        });
    }

    updateOrCreateBranch(item) {
        if(item.id){
            return api
                .put("/organization/branch/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/organization/branch", item)
            .then((response) => {
                return response;
            });
    }
    findUnit(key){
        return api
            .get("/organization/unit/"+key)
            .then((response) => {
                return response;
            });
    }
    countChidl(id){
        return api
            .get("/organization/unit-sum-child/"+id)
            .then((response) => {
                return response;
            });
    }
    getOrganizationUnit(params){
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return api.get('/organization/unit?' + queryParams).then((response) => {
            return response;

        });

    }
    updateOrCreateUnit(item){
        if(item.id){
            return api
                .put("/organization/unit/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/organization/unit", item)
            .then((response) => {
                return response;
            });
    }
    destroy(id){
        return api
        .delete("/organization/branch/"+id)
        .then((response) => {
            return response;
        });
    }
    destroyUnit(id){
        return api
        .delete("/organization/unit/"+id)
        .then((response) => {
            return response;
        });
    }
    pause(item) {
        if(item.id){
            return api
                .put("/organization/unit/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
    }



    updateOrCreateJobPosition(item){
        if(item.id){
            return api
                .put("/organization/unit/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/organization/unit", item)
            .then((response) => {
                return response;
            });
    }
    

}

export default new OrganizationService(); 