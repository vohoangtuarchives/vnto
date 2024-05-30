import {layout} from "@/stores/layout.store";


import {mapState, mapActions } from "pinia";
export const layoutComputed = {
    ...mapState(layout, {
        layoutType: (state) => state.layoutType,
        sidebarSize: (state) => state.sidebarSize,
        layoutWidth: (state) => state.layoutWidth,
        topbar: (state) => state.topbar,
        mode: (state) => state.mode,
        position: (state) => state.position,
        sidebarView: (state) => state.sidebarView,
        sidebarColor: (state) => state.sidebarColor,
        sidebarImage: (state) => state.sidebarImage,
        visibility: (state) => state.visibility
    })
}


export const layoutMethods = mapActions(layout,
    ['changeLayoutType', 'changeLayoutWidth', 'changeSidebarSize', 'changeTopbar', 'changeMode', 'changePosition', 'changeSidebarView',
        'changeSidebarColor','changeSidebarImage','changePreloader', 'changeVisibility'])