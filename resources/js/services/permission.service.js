import api from "./api";

class PermissionService{
    getItems(data){
        return api
            .get("/permission/item/list",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }
    getGroups(data){
        return api
            .get("/permission/group/list",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }

    updateOrCreateItem(item) {
        if(item.id){
            return api
                .put("/permission/item/create/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/permission/item/create/", item)
            .then((response) => {
                return response;
            });
    }
    updateOrCreateGroup(item) {
        if(item.id){
            return api
                .put("/permission/group/create/"+item.id??'', item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/permission/group/create/", item)
            .then((response) => {
                return response;
            });
    }
    
    destroyGroup(id){
        return api
        .delete("/permission/group/delete/"+id)
        .then((response) => {
            return response;
        });
    }

    Destroy(id){
        return api
        .delete("/permission/item/delete/"+id)
        .then((response) => {
            return response;
        });
    }

}

export default new PermissionService();