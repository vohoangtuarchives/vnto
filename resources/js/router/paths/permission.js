 
export default {
    path : "/permission",
    name: "permission",
    meta: {
        title: 'Permission',
        authRequired: true
    },
    children: [
        {
            path: "/settings/permission/group",
            name: "settings.permission.group",
            component: () => import (
                "@/views/settings/permission/pages/group.vue"
            )
        },
        {
            path: "/settings/permission/item",
            name: "settings.permission.item",
            component: () => import (
                "@/views/settings/permission/pages/item.vue"
            )
        },
    ]
};