import api from "./api";

class uploadPhotoService{
    getItem(type){
        return api
            .get("/media-upload/find-type/"+type)
            .then((response) => {
                return response;
            });
    }
    getAll(conditions) {
        return api
            .get("/media-upload/all-file",{
                params: conditions // Truyền biến conditions vào request
            })
            .then((response) => {

                return response;
            });
    }
    getBanner(conditions) {
        return api
            .get("/media-get-banner",{
                params: conditions // Truyền biến conditions vào request
            })
            .then((response) => {

                return response;
            });
    }
    getList(page,conditions){
        return api
            .get("/media-upload/?page="+page,{
                params: conditions // Truyền biến conditions vào request
            })
            .then((response) => {
                return response;
            });
    }

    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/media-upload/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/media-upload/", item)
            .then((response) => {
                return response;
            });
    }
    // update(item) {
    //     if(item.id){
    //         return api
    //             .put("/media-upload/"+item.id, item)
    //             .then((response) => {
    //                 return response;
    //             });
    //     }
    // }

    
    destroy(id) {
        return api
            .delete("/media-upload/"+id)
            .then((response) => {
                return response;
            });
            
    }
    destroyAll(ids) {
        return api
            .post("/media-upload/del-all",{
                ids: ids 
            })
            .then((response) => {
                return response;
            });
    }
    
    updateFile(files) {
       
        return api
            .post("/media-upload/upload-multi", files)
            .then((response) => {
                return response;
            });
    }
    getFile(conditions){
        return api
            .get("/media-upload/media-uploads",{
                params: conditions // Truyền biến conditions vào request
            })
            .then((response) => {
                return response;
            });
    }

    uploadMultiPost(files) {
        return api
            .post("/media-post/upload-multi", files)
            .then((response) => {
                return response;
            });
    }

    pause(item) {
        if(item.id){
            return api
                .put("/media-upload/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
    }
}

export default new uploadPhotoService();