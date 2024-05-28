import api from "./api";

class PriceRuleService{
    getItem(id){
        return api
            .get("/price-rule/"+id)
            .then((response) => {
                return response;
            });
    }
    getList(data){
        return api
            .get("/price-rule/price-rules",{
                params: data
              })
            .then((response) => {
                return response;
            });
    }
    

    getServices(){
        return api
        .get("/service-policy")
        .then((response) => {
            return response;
        });
    }

    updateOrCreate(item) {
        if(item.id){
            return api
                .put("/price-rule/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
        return api
            .post("/price-rule/", item)
            .then((response) => {
                return response;
            });
    }

    destroy(id) {
        return api
            .delete("/price-rule/"+id)
            .then((response) => {
                return response;
            });
            
    }
    destroyAll(ids) {
        return api
            .post("/price-rule/del-all-post",{
                ids: ids 
            })
            .then((response) => {
                return response;
            });
    }
    pause(item) {
        if(item.id){
            return api
                .put("/price-rule/"+item.id, item)
                .then((response) => {
                    return response;
                });
        }
            
    }

}

export default new PriceRuleService();