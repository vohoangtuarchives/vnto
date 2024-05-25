import api from './api';

class UploadService{
    upload(data){
        let formdata = new FormData();
        Object.keys(data).forEach(function(key) {
            formdata.append(key, data[key]);
            console.log(key, data[key]);
        });
        formdata.append('file', data.file);
        return api.post(
            ("/upload"),
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
    }
}

export default new UploadService();