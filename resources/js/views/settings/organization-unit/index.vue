<template>
  <Layout>
    <PageHeader :title="$t('organization-unit.title')" page-title="Dashboard"></PageHeader>
    <BContainer fluid>
      <BCard>
        <BCardHeader class="card-header border-1 align-items-center d-flex justify-content-between px-0 mb-3 pb-2 pt-0">
          <BCardTitle class="m-0">
            {{ $t('danhsach') }}
            <button :class="`btn btn-sm  m-2 ${this.showTree?'btn-success':'btn-dark'}`" @click="showDataTreeChart()">
              <i class="ri-play-list-add-fill"></i>
            </button>
            <button :class="`btn btn-sm  ${!this.showTree?'btn-success':'btn-dark'}`" @click="showDataTreeChart()">
              <i class="ri-organization-chart"></i>
            </button>
          </BCardTitle>
          <div class="flex-shrink-0">
            <button class="btn btn-sm btn-success" @click="addUnitModal">
              <i
                  class="ri-add-fill me-1 align-bottom"
                  data-toggle="tooltip"
                  title=""
                  data-bs-original-title="Thêm mới"
                  aria-label="Thêm mới"></i>
              Thêm mới
            </button>
          </div>
        </BCardHeader>
        <TreeTable v-if="showTree" :value="listUnitTreeTableSlect" :rowHover="true" :resizableColumns="false" :showGridlines="true">
          <Column field="name" :header="$t('organization-unit.name')" expander></Column>
          <Column field="unit_code" :header="$t('organization-unit.unit_code')"></Column>
          <Column :header="$t('organization-unit.head_of_department')">
            <template #body="data">
              {{data.node.data.user!=null?data.node.data.user.name:''}}
            </template>
          </Column>
          <Column :header="$t('trangthai')">
            <template #body="data">
              <div class="" @click="pauseItem(data.node.data)">
                <div v-if="data.node.data.status == 1"><span class="badge border border-success  text-success">{{$t('hoatdong')}}</span></div>
                <div v-if="data.node.data.status == 0"><span class="badge border border-danger  text-danger">{{$t('tamdung')}}</span></div>
              </div>
            </template>
          </Column>
           <Column headerStyle="width: 20px" >
                <template #body="slotProps">
                <div class="dropdown">
                  <a href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ri-more-2-fill"></i>
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><a class="dropdown-item" @click="addUnitModal(slotProps.node.data)" href="#">{{$t('capnhatthongtin')}}</a></li>
                    <li><a class="dropdown-item" @click="deleteItem(slotProps.node.data.id)">{{$t('xoa')}} </a></li>
                  </ul>
                </div>
              </template>
          </Column>
        </TreeTable>
        <div v-else class="card">
        <div v-if="dataTreeChart">
          <div class="col-lg-3 col-12 m-3 ">
             <input type="text" v-model.number="zoomData" class="mb-3 form-control" >
             <Slider v-model="zoomData" class="w-full" max=200 />
          </div>
          <div class="card overflow-x-auto">
            <OrganizationChart :value="dataTreeChart[0]" collapsible v-model:selectionKeys="selection" selectionMode="multiple" 
            :style="`zoom: ${zoomData}% `" @wheel.prevent="onZoom">
              <template #unit="slotProps">
                <div class="organizationchart-item">
                  <div class="font-medium text-lg font-weight-bold text-uppercase">{{ slotProps.node.dataItem.name }}</div>
                    <div class="d-flex align-items-center d-flex justify-content-between mt-2">
                      <div class="d-flex align-items-center d-flex justify-content-between">
                        <div class="">
                          <i class="ri-user-3-line"></i>
                        </div>
                        <div class="font-medium text-lg text-capitalize">
                          {{ slotProps.node.dataItem.user!=null?slotProps.node.dataItem.user.name:'--' }}
                        </div>
                      </div>
                  </div>
                </div>
              </template>
            </OrganizationChart>
          </div>
        </div>
        </div>
      </BCard>
    </BContainer>
  </Layout>
</template>

<script>

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import {ModalSize} from "vue-bs-modal";
import AddUnitModal from "@/views/settings/organization-unit/components/AddUnitModal.vue";
import OrganizationService from "@/services/organization.service";
import Column from "primevue/column";
import {ref} from "vue";
import TreeTable from 'primevue/treetable';
import OrganizationChart from 'primevue/organizationchart';
import Slider from 'primevue/slider';
export default {
  props: {
  },
  emits: {

  },
  data(){
    return {
      listUnitTreeTableSlect: ref(),
      unitCode: 1,
      dataTreeChart: ref(),
      showTree: false,
      zoomData : ref(100),
      zoomLevel: 1,
    }
  },
  setup(){

  },
  created(){
    
  },
  mounted() {
    this.getDataUnit();
    this.getData();
  },
  computed: {
  },
  components: {
    OrganizationChart,
    TreeTable,
    Layout,
    PageHeader,
    Column,
    Slider,
  },
  methods: {
    onZoom(event) {
        const zoomSpeed = 0.1;
        const minZoom = 0.5;
        const maxZoom = 2; // Thay đổi giá trị tối đa thành 2

        this.zoomLevel += event.deltaY > 0 ? -zoomSpeed : zoomSpeed;

        // Giới hạn zoomLevel
        this.zoomLevel = Math.max(minZoom, Math.min(maxZoom, this.zoomLevel));

        // Chuyển đổi zoomLevel thành phần trăm
        const percentage = Math.round(((this.zoomLevel - minZoom) / (maxZoom - minZoom)) * 200);
        this.zoomData=percentage;
        console.log(`Zoom Level: ${percentage}%`);
    },
    showDataTreeChart(){
      this.showTree=!this.showTree;
    },
    getDataUnit(){
      OrganizationService.getUnits().then((response)=>{
         this.listUnitTreeTableSlect = response.data.data;
      })
    },
    getData(){
      OrganizationService.getUnitTree().then((response)=>{
         this.dataTreeChart = response.data.data;
      })
    },
    
    getStatusInfo(status) {
      switch (status) {
        case 1:
          return `<span class="badge border border-success  text-success">`+this.$t('khadung')+`</span>`;
        case 0:
          return `<span class="badge border border-danger  text-danger">`+this.$t('khongkhadung')+`</span>`;
      }
    },
    changeUnitKey(){
      this.unitCode++;
    },
    addUnitModal(data) {
      this
          .$vbsModal
          .open({
            content: AddUnitModal,
            size: ModalSize.XLARGE,
            contentProps: {
              title: this.$t("organization-unit.add-title"),
              item:data,
              listUnitTree:this.listUnitTreeTableSlect,
            },
            // pass event listeners to the EditProfileComponent.
            contentEmits: {
              onUpdate: ()=> {    
                this.getDataUnit();
                this.getData();
              }
            },
            backgroundScrolling: true, // default is false
            staticBackdrop: true, // will disable backdrop click to close modal if true
          });
    },
    async deleteItem(id){
        OrganizationService.destroyUnit(id).then(()=>{
          this.getDataUnit();
          this.getData();
        })
    },
    async pauseItem(data){
        const newdata=data;
        newdata.status=!data.status;
        delete newdata.user;
        OrganizationService.pause(newdata).then(()=>{
          this.getDataUnit();
          this.getData();
        })
    },
  }
}
</script>
<style scoped lang="scss">
.p-organizationchart-table {
    tbody{
      tr{
        td{
          .p-organizationchart-node-content {
            &:has(.p-node-toggler) {
              padding:0;
              border-top:3px solid red;
            }
            .organizationchart-item{
              min-width: 140px;
            }
            .font-weight-bold{
              font-weight: bold;
            }
            .text-lg{
              font-size: 13px;
            }
          }
        }
      }
    }
}
.zoom-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.content {
  transform-origin: top left;
}
</style>