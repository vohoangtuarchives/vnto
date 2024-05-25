import moment from "moment";
import appConfig from "@/configs/app.config";

export default {
    methods: {
      getStatusInfo(status) {
          const text = status ?
              this.$t('khadung') :
              this.$t('khongkhadung');
          const className = status ?
              'badge border border-success  text-success' :
              'badge border border-danger  text-danger';
          return {
              text,
              className
          };
      },
      dataSelect(data,is_status = true){

        data = data.filter(item => {
          item['text'] = item['name']; 
          
          if(is_status==true){
            return item['status'] !== 0 && item['status'] !== false;
          }else{
            return item;
          }
          
      });
    
      return data;
      },
      parseBoolean(value) {
        // Nếu giá trị là một chuỗi, kiểm tra xem nó có phải là "true" không (không phân biệt hoa thường)
        if (typeof value === 'string') {
            return value.trim().toLowerCase() === 'true';
        }
        // Nếu giá trị là một số, trả về true nếu nó khác 0, và false nếu nó là 0
        else if (typeof value === 'number') {
            return value !== 0;
        }
        // Nếu giá trị là một boolean, trả về giá trị ban đầu
        else if (typeof value === 'boolean') {
            return value;
        }
        // Trong các trường hợp còn lại, trả về false
        else {
            return false;
        }
    },
    
      syncData(arrayData, fields) {
        arrayData.forEach(data => {
          fields.forEach(field => {
              if (data && field in data && (data[field] === 1 || data[field] === 0)) {
                  data[field] = data[field] === 1 ? true : false;
              }
          });
      });
      return arrayData
       
      },
      dateFormat(data,format="DD-MM-YYYY HH:mm"){
        return moment(data).format(format)
      },
      imageLink(str) {
        return appConfig.APP_UPLOAD + str;

      },    
      currentRouter(){
       return  this.$router.history.current.path
        
      },
      convertObjectToOptions(data,def=true){
        var result = {};
        if(def==true){
          result[0] = this.$t('vuilongchon');
        }
        data.forEach(item => {
          result[item.id] = item.name;
      });

      return result;  


      },
      findValueByField(data,id, field) {
        const foundItem = data.find(item => item.id === id);
        
        return foundItem ? foundItem[field] : null;
      }
      
  }
}
