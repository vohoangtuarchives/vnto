import moment from "moment";
import appConfig from "@/configs/app.config";

export default {
    methods: {
      stt(index,page,perpage){
        return (index+1) + (page-1)*perpage;
      },
      _parseInt(value, defaultValue) {
        const parsedValue = parseInt(value);
        return isNaN(parsedValue) ? defaultValue : parsedValue;
      },
      
      findRouterByName(routers, name) {
        let foundRouter = null;
    
        function search(router) {
            if (router.name === name) {
                foundRouter = router;
                return true;
            }
    
            if (router.children && router.children.length > 0) {
                for (const child of router.children) {
                    if (search(child)) {
                        return true;
                    }
                }
            }
    
            return false;
        }
    
        routers.forEach(router => {
            if (!foundRouter) {
                search(router);
            }
        });
    
        return foundRouter;
    },
    
      changeParams(router, newParams) {
        const currentRoute = router.currentRoute.value;
        const query = { ...currentRoute.query, ...newParams };
        router.replace({ query: query }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error(err);
          }
        });
      },
      addLoading(obj){
          const newDiv = document.createElement('div')
          newDiv.classList = 'wrap-loading'
          newDiv.innerHTML =  '<div class="spinner-border text-primary avatar-sm" role="status"><span class="visually-hidden">Loading...</span></div>'
          obj.appendChild(newDiv);
          obj.classList.add('show-loading')
      },
      removeLoading(obj){
          const elementsToRemove = obj.getElementsByClassName('wrap-loading');
          while (elementsToRemove.length > 0) {
            elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
          }
          obj.classList.remove('show-loading');
      },
       generateCode(data) {
        if (!data || !data.begin || !data.length || !data.pattern) {
          return null;
        }
        let code = data.pattern + String(data.begin).padStart(data.length, '0');
        return code;
      },
      checkVariable(key, data) {
        let keys = key.split('.');
        let temp = data;
        for (let k of keys) {

          if (temp!=undefined && Object.hasOwn(temp,k)) {
            temp = temp[k];
          } else {
            return false;
          }
        }
        return true;
      },
      getGender(gender) {
        let genderList = [
          {
            'code': 'male',
            'name': this.$t('male'),
          },
          {
            'code': 'female',
            'name': this.$t('female'),
          },
          {
            'code': 'unknown',
            'name': this.$t('unknown'),
          },
        ];
      
        if (gender === false) {
          return genderList;
        } else {
          let matchedGender = genderList.find(item => item.code === gender);
          return matchedGender ? matchedGender.name : '';
        }
      },
      isImageMIME(mimeType) {
        var pattern = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff|image\/webp)$/;
        return pattern.test(mimeType);
      },
      toBoolean(val) {
          return !!JSON.parse(String(val).toLowerCase());
      },
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
