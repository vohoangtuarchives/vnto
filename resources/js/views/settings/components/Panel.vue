<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title mb-0 flex-grow-1">{{ title }}</h5>
    </div>
    <div class="card-body">
      <ul class="list-unstyled row m-0">
        <template v-for="(item, index) in items" :key="index">
          <PanelLinkItem  v-if="canLink(item.router)" :item="item" />
        </template>
        
      </ul>
    </div>
  </div>
</template>
<script>
  import PanelLinkItem from "@/views/settings/components/PanelLinkItem.vue";
  import {mapActions} from "pinia";
  import {useActionStore} from "@/stores/action.store";
  


  export default {
    components: {PanelLinkItem},
    props: {
      panelItems: Object
    },
    setup() {

    },
    methods:{
      ...mapActions(useActionStore, ["canLink"])
    },
    data(){
      return {
        title: '',
        items: []
      }
    },
    mounted(){
      this.items = this.panelItems.items || [];
      this.title = this.panelItems.title || '';
    }
  }
</script>