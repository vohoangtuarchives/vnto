import api from "./api";

class historyUpdateService{
    getItem(id){
        return api
            .get("/post/"+id)
            .then((response) => {
                return response;
            });
    }
    getAll(conditions){
        return api
            .get("/update-info",{
                params: conditions 
            })
            .then((response) => {
                return response;
            });
    }
    
}

export default new historyUpdateService();