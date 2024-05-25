import api from "./api";

class OrganizationService{
    getBranchList(page=1){
        return api
            .get("/organization/branchs?page="+page)
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

}

export default new OrganizationService();