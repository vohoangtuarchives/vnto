<template>
 <router-view></router-view>
</template>
<script>
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import { useConfirm } from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import Toast from "primevue/toast";
import {
    mapGetters
} from 'vuex';
import { ref } from 'vue';
export default {
  name: 'App',
}

</script>
<style>
#nprogress .bar{height: 5px !important;}
</style>
