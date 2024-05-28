import {createApp} from 'vue';

import App from './App.vue';
import router from "./router";
import './assets/js/custom.js'
import i18n from './i18n';
import store from "./state/store";
import NumberFormatDirective from './directives/NumberFormatDirective';
import mixin from '@/mixins/helperMixin';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import BootstrapVueNext from 'bootstrap-vue-next';/*https://bootstrap-vue-next.github.io/bootstrap-vue-next/*/
import Modal from "vue-bs-modal";
import vClickOutside from "click-outside-vue3";
import ConfirmationService from 'primevue/confirmationservice';

import {vMaska} from "maska"
import '@vuepic/vue-datepicker/dist/main.css';/*https://vue3datepicker.com/props/time-picker-configuration/*/
import VueFeather from 'vue-feather';
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import "vue-loading-skeleton/dist/style.css"
import '~/nprogress/nprogress.css'
import '@/assets/scss/config/default/app.scss';
import "leaflet/dist/leaflet.css";
import '@/assets/scss/mermaid.min.css';
import '@/assets/scss/custom.scss';
import 'bootstrap/dist/js/bootstrap.bundle'
import "primevue/resources/themes/aura-light-green/theme.css";
import "primevue/resources/primevue.min.css"; /* Deprecated */

import setupInterceptors from '@/services/setupInterceptors';

import 'vuefinder_fix/dist/style.css'
import VueFinder2 from 'vuefinder_fix/dist/vuefinder'

import Ripple from 'primevue/ripple';

import Skeleton from 'primevue/skeleton';

import StyleClass from 'primevue/styleclass';

import Tooltip from 'primevue/tooltip';

setupInterceptors();

const app = createApp(App)
    .mixin(mixin)
    .use(VueFinder2)
    .use(ConfirmationService)
    .use(ToastService)
    .use(simplebar)
    .use(PrimeVue, {
        pt: {
            global: {
                css: `
                .p-multiselect-panel ol, .p-multiselect-panel ul {
                    padding: 0;
                    padding-left: 4px;
                }
                .p-datatable-wrapper .p-icon{
                    width:11px;
                    height:11px
                }
                span.p-sortable-column-badge {
                    min-width: auto;
                    margin-left: 4px;
                    padding-top: 3px;
                    font-size: 11px;
                }
                .p-component{
                    font-size: 0.85rem;
                }
                .p-tag{
                    font-size: 0.7rem;
                }
                .p-dropdown-panel{
                    z-index: 9999;
                }
                .p-datatable .p-datatable-thead > tr > th,.p-datatable .p-datatable-tbody > tr > td{
                    padding: 0.5rem 0.5rem;
                    
                    font-size:0.8rem;
                }
                .p-datatable-wrapper{
                    overflow: unset!important;
                }
                .p-datatable-thead{background:#F5F6F8}
                .table-card th:first-child, .table-card td:first-child{
                    padding-left:0.3rem;
                }
                .p-dialog{border-radius:5px}
                `
            }
        },
        'dateFormat': 'dd/mm/yy',
        zIndex: {
            modal: 1100, //dialog, sidebar
            overlay: 1000, //dropdown, overlaypanel
            menu: 1000, //overlay menus
            tooltip: 1100 //tooltip
        },
        ripple: true
    })
    .use(simplebar)
    .use(Skeleton)
    .use(store)
    .use(router)
    .use(BootstrapVueNext)
    .use(Modal)
    .component(VueFeather.name, VueFeather)
    .component('simplebar', simplebar)
    .directive("maska", vMaska)
    .directive('currency', NumberFormatDirective)
    .use(i18n)
    .use(vClickOutside);

app.use(ToastService);
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);


// app.config.globalProperties.$axios = { ...axiosInstance }
app.mount("#app");

