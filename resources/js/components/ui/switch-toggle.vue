
  <script>
  import { ref } from 'vue';
  import  api from '@/services/api';
  import NProgress from 'nprogress';
  export default {
    setup(props, { emit }) {
      const item = ref(props.checked);
     
      if(item.value==1){
        item.value = true;
      }
      const triggerChange = () => {
        NProgress.start()
        api.post("/setting/toggle",{'value':item.value,...props}).then(()=>{
            NProgress.done()
            emit('update:modelValue', item.value);
        });
      };
      return { item, triggerChange };
    },
    props: {
      checked: {
        type: Boolean,
        required: true,
      },
      pk: {
        type: String,
        required: true,
      },
      field: {
        type: String,
        required: true,
      },
      tbl: {
        type: String,
        required: true,
      }
    }
  };
  </script>
  <template>
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" role="switch" v-model="item" id="SwitchCheck1" @change="triggerChange">
    </div>
  </template>
  