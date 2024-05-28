import api from "./api";

class staticPostService{
    getItem(type){
        return api
            .get("/static-post/find-type/"+type)
            .then((response) => {
                return response;
            });
    }
    getAll(conditions){
        return api
            .get("/static-post/static-posts",{
                params: conditions // Truyền biến conditions vào request
            })
            .then((response) => {
                return response;
            });
    }
    getList(page,conditions){
        return api
            .get("/static-post/static-post?page="+page,{
                params: conditions // Truyền biến conditions vào request
            })
            .then((response) => {
                return response;
            });
    }

    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/static-post/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/static-post/", item)
            .then((response) => {
                return response;
            });
    }
    
    // update(item) {
    //     if(item.id){
    //         return api
    //             .put("/static-post/update/"+item.id, item)
    //             .then((response) => {
    //                 return response;
    //             });
    //     }
    // }
    
    destroy(id) {
        return api
            .delete("/static-post/"+id)
            .then((response) => {
                return response;
            });
            
    }

}

export default new staticPostService();