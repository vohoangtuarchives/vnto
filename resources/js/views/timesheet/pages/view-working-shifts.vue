<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Skeleton from 'primevue/skeleton';
import {ref,reactive} from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from 'primevue/tag';
import WorkingShiftEntity from "@/views/timesheet/entities/WorkingShiftEntity";

export default {
  props:{
    headerTitle: String,
    pageTitle: String,
  },
  components: {
    Layout,
    PageHeader,
    DataTable,
    Column,
    Skeleton,
    Tag,
  },
  data() {
    return {
      filter:{
        keyword:this.keyword
      },
      data: reactive(new Array(4)),
      totalRecords:ref(0),
      pagingate:ref({}),
      modalShow: false,
      loading:true,
      titleFormGroup: this.$t('t-themmoidanhmuc'),
      service: WorkingShiftEntity.getService(),
      perPageList:[1,10, 20, 50],
      dataTableObject:null,
      selectedItem : ref(),
      metaKey : ref(true),
    };
  },
  watch:{
    '$route.params.type':{
      handler(newType) {
        this.typePost = newType;
        this.selectedItem=null;
        this.getData();
      },
      immediate: true
    }
  },
  mounted() {
    this.getData();
  },

  computed:{
    filterValue(){
      return this.filter;
    },
    perPageValue() {
      return parseInt(this.$route.query.perpage || 10)
    },
    pageValue(){
      return parseInt(this.$route.query.page || 1)
    },
    fistPageValue(){
      return (this.pageValue-1)*this.perPageValue;
    },
    sortValue(){
      return (this.$route.query.sort ||'')
    },
    keywordValue:{
      set(value){
        this.filter.keyword = value
      },
      get(){
        return (this.$route.query.keyword ||'')
      }
    }
  },
  methods: {
    onSearch(){
      this.getData({
        page: 1,
        keyword: this.filter.keyword,
      });
    },
    onPage(e){
      if(e.page+1!=this.pageValue ||  this.perPageValue != e.rows){
        this.currentPage = e.page+1;
        this.getData({page:this.currentPage,perpage:e.rows});
      }
    },
    onSort(e) {
      this.getData({
        sort: e.sortField + ":" + (e.sortOrder === 1 ? 'asc' : 'desc'),
        page: 1,
        perpage: this.perPageValue,

      });
    },
    getData(data){
      const requestData = {
        type: this.typePost,
        page: this.pageValue,
        perpage: this.perPageValue,
        sort: this.sortValue,
        keyword: this.keywordValue,
        ...data
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
      })
    },
    async deleteItem(id) {
      if (confirm(this.$t('cochacmuonxoabainay'))) {
        this.service.destroy(id).then(() => {
          this.getData(this.pagingate.current_page)
        })
      }
    },
    async pauseItem(data, key) {
      let $messConfirm = '';
      if (key == 'show_on_news') {
        if (data.show_on_news == true) {
          $messConfirm = this.$t('cochacmuonthaokhoibangtin');
        }
        if (data.show_on_news == false) {
          $messConfirm = this.$t('cochacmuonduabainaylenbangtin');
        }
        if (confirm($messConfirm)) {
          const newdata = {...data};
          newdata[key] = !newdata[key];
          this.service.pause(newdata).then(() => {
            this.getData(this.pagingate.current_page)
          })
        }
      } else {
        $messConfirm = '';
        if (data.status == true) {
          $messConfirm = this.$t('cochactamdung');
        }
        if (data.status == false) {
          $messConfirm = this.$t('cochachoatdong');
        }
        if (confirm($messConfirm)) {
          const newdata = {...data};
          newdata[key] = !newdata[key];
          this.service.pause(newdata).then(() => {
            this.getData(this.pagingate.current_page)
          })
        }
      }
    },
    async deleteMuitlItem() {
      if (this.selectedItem === undefined || this.selectedItem === null) {
        alert(this.$t('canchon1bai'))
      } else {
        if (confirm(this.$t('cochacmuonxoa'))) {
          this.service.destroyAll(this.selectedItem).then(() => {
            this.getData(this.pagingate.current_page)
          })
        }
      }
    },
    async showMuitlItemOnNews() {
      if (this.selectedItem === undefined || this.selectedItem === null) {
        alert(this.$t('canchon1bai'))
      } else {
        if (confirm(this.$t('cochacmuondualenbangtin'))) {
          this.service.showItemOnNews(this.selectedItem).then(() => {
            this.getData(this.pagingate.current_page)
          })
        }
      }
    },
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="$t(`timesheet.working-shift.form.main-title`)" pageTitle="Dashboard"/>
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCardHeader
              class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
            <BCardTitle class="m-0">
              <BForm @submit="onSearch">
                <div class="d-flex justify-content-center align-item-center">
                  <div class="wrap-search-form">
                    <BFormInput v-model="keywordValue" :placeholder="$t('search')"/>
                    <BButton type="submit"><i class="ri-search-line"></i></BButton>
                  </div>
                </div>
              </BForm>
            </BCardTitle>
            <div class="flex-shrink-0">
              <div class="dropdown">
                <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  {{ $t('hoatdong') }}
                  <i class="ri-more-2-fill"></i>
                </a>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <router-link :to="`/timesheet/working-shift/create`" class="dropdown-item btn btn-success w-100">
                      <i class="ri-add-line align-bottom me-1 text-secondary "></i>
                      {{ $t('themmoi') }}
                    </router-link>
                  </li>
                  <li>
                    <a @click="deleteMuitlItem" class="dropdown-item btn btn-success w-100">
                      <i class="ri-delete-bin-line me-1 text-danger "></i>
                      {{ $t('xoatatca') }}
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
              :pt="{table: 'table',thead: 'table-light'}"
              paginator
              :first="fistPageValue"
              :rows="perPageValue"
              :rowsPerPageOptions="perPageList"
              dataKey="id"
              v-model:selection="selectedItem"
          >
            <template #empty>{{ $t('search_no_record') }}</template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column :header="$t('stt')" style="width: 50px">
              <template #body="{index,}" v-if="!loading">
                {{ stt(index, this.pageValue, this.perPageValue) }}
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('timesheet.working-shift.form.name')" sortable field="name">
              <template #body="{data}" v-if="!loading">
                  {{ data.name }}
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('timesheet.working-shift.form.code')" sortable field="code">
              <template #body="{data}" v-if="!loading">
                {{ data.code }}
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('timesheet.working-shift.form.start_time')" sortable field="start_time" style="width: 138px">
              <template #body="{data}" v-if="!loading">
                <span class="badge text-bg-success">{{ data.start_time }}</span>
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>

            <Column :header="$t('timesheet.working-shift.form.end_time')" sortable field="end_time" style="width: 138px">
              <template #body="{data}" v-if="!loading">
                <span class="badge text-bg-success">{{ data.end_time }}</span>
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>


            <Column :header="$t('trangthai')" sortable field="status" style="width: 120px">
              <template #body="{data}" v-if="!loading">
                <div @click="pauseItem(data,'status')" class="btn p-0">
                  <Tag v-if="data.status == 1" severity="success" :value="$t('hoatdong')"></Tag>
                  <Tag v-if="data.status == 0" severity="danger" :value="$t('tamdung')"></Tag>
                </div>
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>
            <Column :header="$t('ngaytao')" sortable field="created_at" style="width: 150px">
              <template #body="{data}" v-if="!loading">
                {{ dateFormat(data.created_at) }}
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>
            <Column style="width: 30px">
              <template #body="{data}" v-if="!loading">
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li>
                      <router-link :to="`/timesheet/working-shift/edit/${data.id}`" class="dropdown-item"><i
                          class="ri-file-edit-fill align-bottom me-1 text-secondary "></i>{{ $t('capnhatthongtin') }}
                      </router-link>
                    </li>
                    <li><a class="dropdown-item btn" @click="deleteItem(data.id)"><i
                        class="ri-delete-bin-line me-1 text-danger "></i>{{ $t('xoa') }}</a></li>
                  </ul>
                </div>
              </template>
              <template v-else #body>
                <Skeleton height="2rem"></Skeleton>
              </template>
            </Column>
          </DataTable>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>