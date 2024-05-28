<script>
import PostItem from "./component/postItem.vue";
import Layout from "@/layouts/main.vue";
import { ref } from "vue";
import PostService from "@/services/post.service";
import MultiSelect from "primevue/multiselect";
export default {
  components: {
    Layout,
    PostItem,
    MultiSelect,
  },
  data() {
    return {
      filter: {
        keyword: this.keyword,
      },
      data: ref([]),
      totalRecords: ref(0),
      pagingate: ref({}),
      modalShow: false,
      loading: false,
      titleFormGroup: this.$t("t-themmoidanhmuc"),
      service: PostService,
      perPageList: [1, 10, 20, 50],
      dataTableObject: null,
      selectedItem: ref(),
      metaKey: ref(true),
      typeNews: ref([
        { name: "Quy định", code: "regulations" },
        { name: "Quyết định", code: "decisions" },
        { name: "Thông báo", code: "notifications" },
        { name: "Uỷ quyền", code: "power-of-attorney" },
      ]),
      selectedTypeNews: ref([]),
      currentPage:1,
    };
  },
  watch: {
    'currentPage':{
      handler(newId,oldId) {
        if(newId!=oldId && oldId!=undefined){
          this.pagingate.page = newId; 
          this.getData();
        }
      },
      immediate: true 
    }
  },
  mounted() {
    this.getData();
  },

  computed: {
    filterValue(){
        return this.filter;
    },
    perPageValue() {
      return parseInt(this.$route.query.perpage || 10)
    },
    pageValue(){
      return parseInt(this.$route.query.page || 1)
    },
  },
  methods: {
    getData(data) {
      const requestData = {
        type: this.selectedTypeNews.map((item) => item.code),
        show_on_news: 1,
        page: this.pagingate.page,
        perpage: this.perPageValue,
        sort: "created_at:desc",
        keyword: this.keywordValue,
        ...data,
      };
     
      if (this.perPageList.indexOf(requestData.perpage) === -1) {
        requestData.perpage = this.perPageList[0];
      }
      this.changeParams(this.$router, requestData);
      this.loading = true;
      this.service.getList(requestData).then((response) => {
        if (response.data.data) {
          this.totalRecords = response.data.data.total;
          this.data = response.data.data.data;
          this.pagingate = response.data.data;
          this.currentPage = this.pagingate.current_page;
          this.loading = false;
        }
      });
    },
    async deleteItem(id) {
      if (confirm(this.$t("cochacmuonxoabainay"))) {
        this.service.destroy(id).then(() => {
          this.getData(this.pagingate.current_page);
        });
      }
    },
    async pauseItem(data, key) {
      let $messConfirm = "";
      if (key == "show_on_news") {
        if (data.show_on_news == true) {
          $messConfirm = this.$t("cochacmuonthaokhoibangtin");
        }
        if (data.show_on_news == false) {
          $messConfirm = this.$t("cochacmuonduabainaylenbangtin");
        }
        if (confirm($messConfirm)) {
          const newdata = { ...data };
          newdata[key] = !newdata[key];
          this.service.pause(newdata).then(() => {
            this.getData(this.pagingate.current_page);
          });
        }
      } else {
        $messConfirm = "";
        if (data.status == true) {
          $messConfirm = this.$t("cochactamdung");
        }
        if (data.status == false) {
          $messConfirm = this.$t("cochachoatdong");
        }
        if (confirm($messConfirm)) {
          const newdata = { ...data };
          newdata[key] = !newdata[key];
          this.service.pause(newdata).then(() => {
            this.getData(this.pagingate.current_page);
          });
        }
      }
    },
    async deleteMuitlItem() {
      if (this.selectedItem === undefined || this.selectedItem === null) {
        alert(this.$t("canchon1bai"));
      } else {
        if (confirm(this.$t("cochacmuonxoa"))) {
          this.service.destroyAll(this.selectedItem).then(() => {
            this.getData(this.pagingate.current_page);
          });
        }
      }
    },
    async showMuitlItemOnNews() {
      if (this.selectedItem === undefined || this.selectedItem === null) {
        alert(this.$t("canchon1bai"));
      } else {
        if (confirm(this.$t("cochacmuondualenbangtin"))) {
          this.service.showItemOnNews(this.selectedItem).then(() => {
            this.getData(this.pagingate.current_page);
          });
        }
      }
    },
    onChangeType() {
      this.getData();
    },
  },
};
</script>
<template>
  <Layout>
    <div class="" style="width: 100%; max-width: 1000px; margin: 0 auto">
      <!-- <BRow> -->
      <!-- <BCol cols="3" lg="3" md="12" sm="12">
          <div class="amis-sidebar">
            <div class="amis-sidebar-item d-flex align-items-center rounded px-2 py-2 active">
              <i class="i-bangtin"></i> <span class="fw-bold mx-2">{{ this.$t("t-bangtin") }}</span>
            </div>
            <div class="amis-sidebar-item d-flex align-items-center rounded px-2 py-2 ">
              <i class="i-tintuc"></i> <span class="fw-bold mx-2">{{ this.$t("t-tintuc") }}</span>
            </div>
            <div class="amis-sidebar-item d-flex align-items-center rounded px-2 py-2 ">
              <i class="i-sangkien"></i> <span class="fw-bold mx-2">{{ this.$t("t-sangkien") }}</span>
            </div>
            <div class="amis-sidebar-item d-flex align-items-center rounded px-2 py-2 ">
              <i class="i-binhchon"></i><span class="fw-bold mx-2">{{ this.$t("t-binhchon") }}</span>
            </div>
          </div>
        </BCol> -->
        <BCol cols="12" lg="12" md="12" sm="12">
          <div class="flex justify-content-center mb-3">
              <MultiSelect v-model="selectedTypeNews" display="chip" :options="typeNews" optionLabel="name" placeholder="Tất cả"
                  :maxSelectedLabels="4" class=" " @change="onChangeType"/>
          </div>
          <div v-for="(item, index) in this.data" :key="index">
            <PostItem :item="item" />
          </div>
        </BCol>
        <BPagination v-model="currentPage" :total-rows="pagingate.last_page" :per-page="1"  />
      <!-- </BRow> -->
    </div>
  </Layout>
</template>