 
  export default {
    path : "/organization",
    name: "organization",
    meta: {
        title: "Organization",
        authRequired: true
    },
    children: [
        {
            path: "/settings/organization/information",
            name: "settings.organization.information",
            component: () => import (
                "@/views/settings/organizations/pages/information.vue"
                )
        },
        {
            path: "/settings/organization/job-position",
            name: "settings.organization.job-position",
            component: () => import (
                "@/views/settings/organizations/pages/job-position.vue"
            ),
        }, {
            path: "/settings/organization/branchs",
            name: "settings.organization.branchs",
            component: () => import ("@/views/settings/organizations/pages/branchs.vue")
        },
        {
            path: "/settings/organization/departments",
            name: "settings.organization.departments",
            component: () => import ("@/views/settings/organizations/pages/departments.vue"),
            meta: {
                requiredRoles: ['departments.list']
            }
        },
        {
            path: "/settings/organization/unit",
            name: "settings.organization.unit",
            component: () => import ("@/views/settings/organization-unit/index.vue")
        },

        {
            path: "/organization/units",
            name: "settings.organization.units",
            component: () => import ("@/views/organization/pages/units.vue")
        }

    ]
};