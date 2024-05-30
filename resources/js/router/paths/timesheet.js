export default {
    path : "/timesheet",
    name: "timesheet",
    meta: {
        title: "Timesheet",
        authRequired: true
    },
    children: [
        {
            path: "/timesheet/working-shift",
            name: "timesheet.working-shift.view",
            component: () => import (
                "@/views/timesheet/pages/view-working-shifts.vue"
                )
        },
        {
            path: "/timesheet/working-shift/create",
            name: "timesheet.working-shift.create",
            component: () => import (
                "@/views/timesheet/pages/create-working-shifts.vue"
                )
        },
        {
            path: "/timesheet/working-shift/edit/:id",
            name: "timesheet.working-shift.edit",
            component: () => import (
                "@/views/timesheet/pages/edit-working-shifts.vue"
                )
        },
        {
            path: "/timesheet/shift-plan",
            name: "timesheet.shift-plan.view",
            component: () => import (
                "@/views/timesheet/pages/shift-plan.vue"
                )
        }

    ]
};