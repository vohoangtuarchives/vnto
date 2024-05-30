<script>
import { ref, reactive } from "vue";
import Skeleton from "primevue/skeleton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import InputSwitch from "primevue/inputswitch";

export default {
  name: "TableData",
  components: {
    DataTable,
    Column,
    Skeleton,
    Tag,
    InputSwitch,
  },
  props: {
    titleMan: {
      type: String,
    },
    typeMan: {
      type: String,
    },
    services: {
      type: Boolean,
    },
    columShow: {
      type: Array,
    },
    arrayLink:{
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      titlePage: this.titleMan,
      typePage: this.typeMan,
      arrayColumShow: this.columShow,
      filter: {
        keyword: this.keyword,
      },
      data: reactive(new Array(4)),
      totalRecords: ref(0),
      pagingate: ref({}),
      loading: true,
      service: this.services,
      perPageList: [5, 10, 20, 50],
      selectedItem: ref(),
    };
  },
  watch: {
    "$route.query.title": {
      handler(newTitle) {
        this.titlePage = newTitle;
      },
      immediate: true,
    },
    "$route.params.type": {
      handler(newType) {
        if (newType) {
          this.typePage = newType;
          this.selectedItem = null;
          this.getData();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getData();
  },
  computed: {
    filterValue() {
      return this.filter;
    },
    perPageValue() {
      return parseInt(this.$route.query.perpage || 10);
    },
    pageValue() {
      return parseInt(this.$route.query.page || 1);
    },
    fistPageValue() {
      return (this.pageValue - 1) * this.perPageValue;
    },
    sortValue() {
      return this.$route.query.sort || "created_at:desc";
    },
    keywordValue: {
      set(value) {
        this.filter.keyword = value;
      },
      get() {
        return this.$route.query.keyword || "";
      },
    },
  },
  methods: {
    onSearch() {
      this.getData({
        page: 1,
        keyword: this.filter.keyword,
      });
    },
    onPage(e) {
      if (e.page + 1 != this.pageValue || this.perPageValue != e.rows) {
        this.currentPage = e.page + 1;
        this.getData({ page: this.currentPage, perpage: e.rows });
      }
    },
    onSort(e) {
      this.getData({
        sort: e.sortField + ":" + (e.sortOrder === 1 ? "asc" : "desc"),
        page: 1,
        perpage: this.perPageValue,
      });
    },
    getData(data) {
      const requestData = {
        type: this.typePage,
        page: this.pageValue,
        perpage: this.perPageValue,
        sort: this.sortValue,
        keyword: this.keywordValue,
        ...data,
      };
      if (this.perPageList.indexOf(requestData.perpage) === -1) {
        requestData.perpage = this.perPageList[0];
      }
      this.changeParams(this.$router, requestData);
      this.loading = true;
      this.service.getList(requestData).then((response) => {
        this.totalRecords = response.data.data.total;
        this.data = response.data.data.data;
        this.pagingate = response.data.data;
        this.loading = false;
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
      }
      if (key == "record_kpi") {
        if (data.record_kpi == true) {
          $messConfirm = this.$t("cochacmuonboghinhankpi");
        }
        if (data.record_kpi == false) {
          $messConfirm = this.$t("cochacmuonghinhankpi");
        }
      }
      if (key == "status") {
        $messConfirm = "";
        if (data.status == true) {
          $messConfirm = this.$t("cochactamdung");
        }
        if (data.status == false) {
          $messConfirm = this.$t("cochachoatdong");
        }
      }

      if (confirm($messConfirm)) {
        const newdata = { ...data };
        newdata[key] = !newdata[key];
        this.service.pause(newdata).then(() => {
          this.getData(this.pagingate.current_page);
        });
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
    hasLink(name) {
      return this.arrayLink.some(link => link.name === name);
    },
    getLinkRoute(name) {
      const link = this.arrayLink.find(link => link.name === name);
      if (link) {
        return link.route;
      }
      return ''; // Trả về một đối tượng rỗng nếu không tìm thấy link
    }
  },
};
</script>
<template>
  <BCardHeader
    class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0"
  >
    <BCardTitle class="m-0">
      <BForm @submit="onSearch">
        <div class="d-flex justify-content-center align-item-center">
          <div class="wrap-search-form">
            <BFormInput v-model="keywordValue" :placeholder="$t('search')" />
            <BButton type="submit"><i class="ri-search-line"></i></BButton>
          </div>
        </div>
      </BForm>
    </BCardTitle>
    <div class="flex-shrink-0">
      <div class="dropdown dropdown-action">
        <a
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="ri-add-line"></i>
          {{ $t("hoatdong") }}
          <i class="ri-list-settings-line"></i>
        </a>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <li v-if="hasLink('add')">
            <router-link
              :to="{
                name: getLinkRoute('add'),
                params: { type: typePage },
                query: { title: titlePage },
              }"
              class="dropdown-item btn btn-success w-100"
            >
              <i class="ri-add-line align-bottom me-1 text-secondary"></i>
              {{ $t("themmoi") }}
            </router-link>
          </li>
          <li v-if="columShow.includes('show_on_news')">
            <a
              @click="showMuitlItemOnNews"
              class="dropdown-item btn btn-success w-100"
            >
              <i class="ri-send-plane-fill me-1 text-success"></i>
              {{ $t("post-news") }}
            </a>
          </li>
          <li>
            <a
              @click="deleteMuitlItem"
              class="dropdown-item btn btn-success w-100"
            >
              <i class="ri-delete-bin-line me-1 text-danger"></i>
              {{ $t("xoatatca") }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </BCardHeader>
  <DataTable
    :value="data"
    :totalRecords="totalRecords"
    lazy
    @page="onPage($event)"
    @sort="onSort($event)"
    @filter="onFilter($event)"
    :pt="{ table: 'table', thead: 'table-light' }"
    paginator
    :first="fistPageValue"
    :rows="perPageValue"
    :rowsPerPageOptions="perPageList"
    dataKey="id"
    v-model:selection="selectedItem"
  >
    <template #empty>{{ $t("search_no_record") }} </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column :header="$t('stt')" style="width: 50px">
      <template #body="{ index }" v-if="!loading">
        {{ stt(index, pageValue, perPageValue) }} 
      </template>
      <template v-else #body>
        <Skeleton height="2rem"></Skeleton>
      </template>
    </Column>

    <Column
      v-if="columShow.includes('photo')"
      :header="$t('photo')"
      style="width: 120px"
    >
      <template #body="{ data }" v-if="!loading">
        <router-link
          v-if="hasLink('view')"
          :to="{
            name: getLinkRoute('view'),
            params: { type: typePage, id: data.id },
            query: { title: titlePage },
          }"
        >
          <img
            v-if="data.photo"
            :src="imageLink(typePage + '/' + data.photo)"
            alt="Preview"
            style="max-width: 100%; max-height: 40px"
          />
          <img
            v-else
            src="@/assets/images/noimage.png"
            alt="Preview"
            style="max-width: 100%; max-height: 40px"
          />
        </router-link>
      </template>
    </Column>

    <Column :header="$t('post.name')" sortable field="name">
      <template #body="{ data }" v-if="!loading">
        <router-link
          v-if="hasLink('view')"
          :to="{
            name: getLinkRoute('view'),
            params: { type: typePage, id: data.id },
            query: { title: titlePage },
          }"
        >
          {{ data.name }}
        </router-link>
        <span v-else>{{ data.name }}</span>
        <div v-if="data.user" class="mt-1 text-success">
          <i class="ri-user-add-line me-1"></i
          >{{ data.user ? data.user.name : "" }}
        </div>
      </template>
      <template v-else #body>
        <Skeleton height="2rem"></Skeleton>
      </template>
    </Column>
    <Column
      v-if="columShow.includes('service_policy')"
      :header="$t('doituong.loaihinhdichvu')"
    >
      <template #body="{ data }" v-if="!loading">
        <div v-if="data.service_policy">
          {{ data.service_policy.name }}
        </div>
      </template>
    </Column>
    <Column
      v-if="columShow.includes('quydoisocho')"
      :header="$t('doituong.quydoisocho')"
    >
      <template #body="{ data }" v-if="!loading">
        <div v-if="data.num_seats">
          {{ data.num_seats }}
        </div>
      </template>
    </Column>
    <Column
      v-if="columShow.includes('donvitinh')"
      :header="$t('doituong.donvitinh')"
    >
      <template #body="{ data }" v-if="!loading">
            {{ $t(data.unit_price) }}
      </template>
    </Column>
    <Column
      v-if="columShow.includes('donvikhach')"
      :header="$t('doituong.donvikhach')"
    >
      <template #body="{ data }" v-if="!loading">
        {{ $t(data.age_group) }}
      </template>
    </Column>
    <Column
      v-if="columShow.includes('ghinhankpi')"
      :header="$t('doituong.ghinhankpi')"
    >
      <template #body="{ data }" v-if="!loading">
        <div @click="pauseItem(data, 'record_kpi')">
          <InputSwitch v-model="data.record_kpi" readonly="true" />
        </div>
      </template>
    </Column>
    <Column
      v-if="columShow.includes('show_on_news')"
      :header="$t('post-news')"
      sortable
      field="show_on_news"
      style="width: 150px"
    >
      <template #body="{ data }" v-if="!loading">
        <div @click="pauseItem(data, 'show_on_news')">
          <InputSwitch v-model="data.show_on_news" readonly="true" />
        </div>
      </template>
      <template v-else #body>
        <Skeleton height="2rem"></Skeleton>
      </template>
    </Column>
    <Column
      :header="$t('trangthai')"
      sortable
      field="status"
      style="width: 120px"
    >
      <template #body="{ data }" v-if="!loading">
        <div @click="pauseItem(data, 'status')" class="btn p-0">
          <Tag
            v-if="data.status == 1"
            severity="success"
            :value="$t('hoatdong')"
          ></Tag>
          <Tag
            v-if="data.status == 0"
            severity="danger"
            :value="$t('tamdung')"
          ></Tag>
        </div>
      </template>
      <template v-else #body>
        <Skeleton height="2rem"></Skeleton>
      </template>
    </Column>
    <Column
      :header="$t('ngaytao')"
      sortable
      field="created_at"
      style="width: 150px"
    >
      <template #body="{ data }" v-if="!loading">
        {{ dateFormat(data.created_at) }}
      </template>
      <template v-else #body>
        <Skeleton height="2rem"></Skeleton>
      </template>
    </Column>
    <Column style="width: 30px">
      <template #body="{ data }" v-if="!loading">
        <div class="list-tools">
          <router-link
            v-if="hasLink('edit')"
            :to="{
              name: getLinkRoute('edit'),
              params: { type: typeMan, id: data.id },
              query: { title: titleMan },
            }"
            class="edit"
          >
            <i class="ri-file-edit-fill align-bottom text-secondary"></i>
          </router-link>
          <a class="delete" @click.prevent="deleteItem(data.id)" href="#"
            ><i class="ri-delete-bin-line text-danger"></i
          ></a>
        </div>
      </template>
      <template v-else #body>
        <Skeleton height="2rem"></Skeleton>
      </template>
    </Column>
  </DataTable>
</template>
