import api from "./api";

class PostService{
    getItem(id){
        return api
            .get("/post/"+id)
            .then((response) => {
                return response;
            });
    }
    getList(data){
        return api
            .get("/post/paginate",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }
    
    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/post/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/post/create", item)
            .then((response) => {
                return response;
            });
    }

    destroy(id) {
        return api
            .delete("/post/"+id)
            .then((response) => {
                return response;
            });
    }
    destroyAll(ids) {
        return api
            .post("/post/del-all-post",{
                ids: ids 
            })
            .then((response) => {
                return response;
            });
    }
    showItemOnNews(ids) {
        return api
            .post("/post/show-on-news",{
                ids: ids 
            })
            .then((response) => {
                return response;
            });
    }
    pause(item) {
        if(item.id){
            return api
                .put("/post/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
    }
    // call api xu li file
    getAllFile(conditions){
        return api
            .get("/media-post/media-uploads",{
                params: conditions 
            })
            .then((response) => {
                return response;
            });
    }

    destroyFile(id) {
        return api
            .delete("/media-post/"+id)
            .then((response) => {
                return response;
            });
    }
}

export default new PostService();