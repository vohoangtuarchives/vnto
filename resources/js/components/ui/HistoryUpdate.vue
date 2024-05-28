<script>
import { ref } from "vue";
import historyUpdateService from "@/services/historyUpdate.service";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  name: "HistoryUpdate",
  components: {
    DataTable,
    Column,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    id_post: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data: ref([]),
      conditions: {},
      service: historyUpdateService,
      pagingate: ref({}),
      isLoading: false,
      currentPage: 1,
      perPage: 10,
    };
  },
  watch: {
    currentPage: {
      handler(newId, oldId) {
        if (newId != oldId && oldId != undefined) {
          this.$router.replace({ query: { page: newId } });
          this.getData(newId);
        }
      },
      immediate: true, // Load data initially if id exists
    },
  },
  mounted() {
    this.getData(this.currentPage);
  },
  methods: {
    close() {
      this.$vbsModal.close();
    },
    async getData() {
        this.conditions.id_post = this.id_post;
        this.conditions.page = this.currentPage;
        this.conditions.perpage = this.perPage;
        try {
          const response = await this.service.getAll(this.conditions);
          if (response.data.data.data) {
            this.data = response.data.data.data;
            this.pagingate = response.data.data;
            this.currentPage = this.pagingate.current_page;
          }
        } catch (error) {
          console.error("Error while fetching data:", error);
        }
    },
  },
};
</script>
<template>
  <BContainer v-if="data.length > 0">
    <BCard>
      <div>
        <div class="modal-header p-2 bg-success-subtle mb-2">
          <h5 class="modal-title">{{ $t("history-update") }}</h5>
        </div>
        <DataTable
          :value="data"
          :pt="{
            table: 'table',
            thead: 'table-light',
          }"
          :key="unitCode"
        >
          <Column :header="$t('stt')" style="width: 50px">
            <template #body="{ index }">
              {{ index + 1 }}
            </template>
          </Column>
          <Column field="updated_by" :header="$t('history-user')" style="">
            <template #body="{ data }">
              <div v-if="data.user">
                {{ data.user.name }}
              </div>
            </template>
          </Column>
          <Column :header="$t('thoigian')" style="width: 130px">
            <template #body="{ data }">
              {{ dateFormat(data.created_at) }}
            </template>
          </Column>
        </DataTable>
        <BPagination
          v-model="currentPage"
          :total-rows="pagingate.last_page"
          :per-page="1"
        />
      </div>
    </BCard>
  </BContainer>
</template>
