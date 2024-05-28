export default {
    path : "/timesheet",
    name: "timesheet",
    meta: {
        title: "Timesheet",
        authRequired: true
    },
    children: [
        {
            path: "/settings/organization/information",
            name: "settings.organization.information",
            component: () => import (
                "@/views/settings/organizations/pages/information.vue"
                )
        }

    ]
};