import store from "@/state/store";

export default {
    mounted(el, binding, vnode) {

        var permissions = store.state.permissions;

        if(permissions.includes(binding.value))
        {
            return vnode.el.hidden = false;
        }
        else
        {
            return vnode.el.hidden = true;
        }
    },
};

