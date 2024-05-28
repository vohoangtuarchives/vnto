import api from "./api";

class Timesheet{
    updateOrCreateWorkingShift(item) {
        if(item.id){
            return this.put("/timesheet/working-shift/update/"+item.id, item);
        }
        return api
            .post("/timesheet/working-shift/create", item)
            .then((response) => {
                return response;
            });
    }
    getWorkingShift(id){
        return api
            .get("/timesheet/working-shift/edit/"+id)
            .then((response) => {
                return response;
            });
    }
    getList(data){
        return api
            .get("/timesheet/working-shift",{
                params: data
            })
            .then((response) => {
                return response;
            });
    }
    put(uri, item){
        return api
            .put(uri, item)
            .then((response) => {
                return response;
            });
    }

    pause(item) {
        if(item.id){
            return this.updateOrCreateWorkingShift(item);
        }
    }
}
export default new Timesheet();