import { defineStore } from 'pinia'

export const layout = defineStore('layout', {
    state: () => ({
        loading:false,
        layoutType: 'vertical',
        layoutWidth: 'fluid',
        sidebarSize: 'lg',
        topbar: 'light',
        mode: 'light',
        position: 'fixed',
        sidebarView: 'default',
        sidebarColor: 'dark',
        sidebarImage: 'none',
        preloader: 'disabled',
        visibility: 'show',
        menu:null,
    }),
    getters: {
        isLoading(state){
            return state.loading;
        },
        getMenu(state){
            return state.menu;
        },
    },
    actions:{
        beginLoading() {
            this.loading = true;
        },
        endLoading() {
            this.loading = false;
        },
        SET_MENU(menu){
            this.menu = menu;
        },
        CHANGE_LAYOUT(layoutType) {
            this.layoutType = layoutType;
        },
        CHANGE_LAYOUT_WIDTH(layoutWidth) {
            this.layoutWidth = layoutWidth;
        },
        CHANGE_SIDEBAR_TYPE(sidebarSize) {
            this.sidebarSize = sidebarSize;
        },
        CHANGE_TOPBAR(topbar) {
            this.topbar = topbar;
        },
        CHANGE_MODE(mode) {
            this.mode = mode;
        },
        CHANGE_POSITION(position) {
            this.position = position;
        },
        CHANGE_SIDEBAR_VIEW(sidebarView) {
            this.sidebarView = sidebarView;
        },
        CHANGE_SIDEBAR_COLOR(sidebarColor) {
            this.sidebarColor = sidebarColor;
        },
        CHANGE_SIDEBAR_IMAGE(sidebarImage) {
            this.sidebarImage = sidebarImage;
        },
        CHANGE_PRELOADER(preloader) {
            this.preloader = preloader;
        },
        CHANGE_VISIBILITY(visibility) {
            this.visibility = visibility;
        },
        changeLayoutType({ commit }, { layoutType }) {
            commit('CHANGE_LAYOUT', layoutType);
            document.body.removeAttribute("style");
        },
        changeLayoutWidth({ commit }, { layoutWidth }) {
            commit('CHANGE_LAYOUT_WIDTH', layoutWidth);
        },

        changeSidebarSize({ commit }, { sidebarSize }) {
            commit('CHANGE_SIDEBAR_TYPE', sidebarSize);
        },

        changeTopbar({ commit }, { topbar }) {
            commit('CHANGE_TOPBAR', topbar);
        },

        changeMode({ commit }, { mode }) {
            commit('CHANGE_MODE', mode);
        },

        changePosition({ commit }, { position }) {
            commit('CHANGE_POSITION', position);
        },

        changeSidebarView({ commit }, { sidebarView }) {
            commit('CHANGE_SIDEBAR_VIEW', sidebarView);
        },

        changeSidebarColor({ commit }, { sidebarColor }) {
            commit('CHANGE_SIDEBAR_COLOR', sidebarColor);
        },

        changeSidebarImage({ commit }, { sidebarImage }) {
            commit('CHANGE_SIDEBAR_IMAGE', sidebarImage);
        },

        changePreloader({ commit }, { preloader }) {
            commit('CHANGE_PRELOADER', preloader);
        },

        changeVisibility({ commit }, { visibility }) {
            commit('CHANGE_VISIBILITY', visibility);
        }
    }
})