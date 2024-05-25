<template>
  <div class="table- table-card">
    <table class="table">
      <slot></slot>
    </table>
    <BPagination  v-model="currentPage"  :total-rows="totalPage" :per-page="per_page" />
  </div>
</template>

<style>
.td-action{
  width: 50px;
}
.td-stt{
  width: 50px;
}
</style>
<script>
import {ref} from "vue";
import api from "@/services/api";

const DEFAULT_PER_PAGE = 10;

export default {
  props:{
    ajax:{
      type: String
    },
    options: {
      type: Object
    }
  },
  setup(){
    let params = new window.URLSearchParams(window.location.search);
    let query = {};
    params.forEach(function (value, key){
      query[key] = value;
    });
    const currentPage =  ref(query.page || 1);
    const per_page =  ref(query.per_page || DEFAULT_PER_PAGE);

    return {
      currentPage: ref(currentPage),
      per_page: ref(per_page),
      totalPage: ref(DEFAULT_PER_PAGE),
      initRequest: true,
      query: ref({
        page: currentPage,
        per_page: per_page
      })
    }
  },
  beforeMount() {
    if(this.options.per_page && this.query.per_page == DEFAULT_PER_PAGE){
      this.query.per_page = this.options.per_page;
    }
    if(!this.query){
      this.query.per_page = this.per_page;
      this.query.page = this.currentPage;
    }
  },
  watch:{
    'currentPage':{
      handler(newId, oldId) {
        if(newId!==oldId && oldId!==undefined){
          this.query.page = newId;
          this.$router.replace({ query: this.query});
          this.getData(newId);
        }
      },
      immediate: false // Load data initially if id exists
    }
  },
  mounted() {

    console.log(this.query, this.currentPage, this.per_page);
    this.getData(this.currentPage);
  },
  methods: {
    buildURL(options){
      let url = new URL(this.getApiUrl(this.ajax));
      let params = new window.URLSearchParams(window.location.search);

      if(options.per_page){
        params.set("per_page", options.per_page);
      }else{
        params.delete("per_page");
      }

      if(options.page){
        params.set("page", options.page);
      }else{
        params.delete("page");
      }

      url.search = params;
      return url.toString();
    },
    getApiUrl(str){
      let url = api.defaults.baseURL + str;
      return url.replace(/([^:]\/)\/+/g, "$1");
    },
    getData(page){

      let that = this;

      let finalFantasy = this.buildURL({
        per_page: this.query.per_page,
        page: page
      });
      api.get(finalFantasy).then(function (response){
        let result =  response.data;
        that.totalPage = result.meta.total;
        that.options.data= result.data;
      });
    },
  }
}
</script>