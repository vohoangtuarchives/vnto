 const state = {
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
};



 const mutations = {
  beginLoading(state) {
  
  state.loading = true;
      
  },
  endLoading(state) {
    
    state.loading = false;

  },
  SET_MENU(state,menu){
    state.menu = menu;
  },
  CHANGE_LAYOUT(state, layoutType) {
    state.layoutType = layoutType;
  },
  CHANGE_LAYOUT_WIDTH(state, layoutWidth) {
    state.layoutWidth = layoutWidth;
  },
  CHANGE_SIDEBAR_TYPE(state, sidebarSize) {
    state.sidebarSize = sidebarSize;
  },
  CHANGE_TOPBAR(state, topbar) {
    state.topbar = topbar;
  },
  CHANGE_MODE(state, mode) {
    state.mode = mode;
  },
  CHANGE_POSITION(state, position) {
    state.position = position;
  },
  CHANGE_SIDEBAR_VIEW(state, sidebarView) {
    state.sidebarView = sidebarView;
  },
  CHANGE_SIDEBAR_COLOR(state, sidebarColor) {
    state.sidebarColor = sidebarColor;
  },
  CHANGE_SIDEBAR_IMAGE(state, sidebarImage) {
    state.sidebarImage = sidebarImage;
  },
  CHANGE_PRELOADER(state, preloader) {
    state.preloader = preloader;
  },
  CHANGE_VISIBILITY(state, visibility) {
    state.visibility = visibility;
  }
};
const getters = {
  isLoading(state){
   
    return state.loading;
  },
  getMenu(state){
    return state.menu;
  }


}
 const actions = {
  
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
};

export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
