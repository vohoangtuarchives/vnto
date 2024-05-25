import store from "@/state/store";
const routes = [];

const paths = import.meta.glob('./paths/*.js', {
    eager: true
});

for (const key in paths) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
        routes.push(paths[key].default);
    }
}


routes.push(
    {

        path: "/login",
        name: "login",
        component: () => import ("../views/account/login.vue"),
        meta: {
            title: "Login",
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in

                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    alert("X");
                    next({name: "default"});
                } else {
                    // Continue to the login page
                    next();
                }
            }
        }
    }, {
        path : "/register",
        name: "Register",
        component: () => import ("../views/account/register.vue"),
        meta: {
            title: "Register",
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({name: "default"});
                } else {
                    // Continue to the login page
                    next();
                }
            }
        }
    }, {
        path : "/forgot-password",
        name: "Forgot password",
        component: () => import ("../views/account/forgot-password.vue"),
        meta: {
            title: "Forgot Password",
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({name: "default"});
                } else {
                    // Continue to the login page
                    next();
                }
            }
        }
    }, {
        path : "/",
        name: "default",

        meta: {
            title: "Dashboard",
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({name: "default"});
                } else {
                    // Continue to the login page
                    next();
                }
            }
        },
        component: () => import ("../views/settings/index.vue")
    }, {
        path : "/settings",
        meta: {
            title: "Dashboard",
            authRequired: true
        },
        children: [
            {
                path: "",
                name: "settings",
                component: () => import ("../views/settings/index.vue")
            }, {
                path: "customer-source",
                name: "settings.customer_source",
                component: () => import ("../views/settings/source/source.vue")
            }, {
                path: "customer-type",
                name: "settings.customer_type",
                component: () => import ("../views/settings/source/type.vue")
            }
        ]
    }, {
        path : "/customers",
        meta: {
            title: "Dashboard",
            authRequired: true
        },
        children: [
            {
                path: "",
                name: "customer.index",
                component: () => import ("../views/customers/index.vue")
            }, {
                path: "source/index",
                name: "settings.source.index",
                component: () => import ("../views/settings/source/source.vue")
            }
        ]
    },
    /* staff */
    {
        path : "/staff",
        meta: {
            title: "Staff",
            authRequired: true
        },
        children: [
            {
                path: "list",
                name: "staff.list",
                component: () => import ("../views/staff/list-staff.vue")
            },
            {
              path: "create",
              name: "staff.create",
              component: () => import ("../views/staff/create-staff.vue")
          }, {
                path: "source/index",
                name: "settings.source.index",
                component: () => import ("../views/settings/source/source.vue")
            }
        ]
    }, {
        path : "/settings/amenities",
        name: "settings.amenities",
        meta: {
            title: "Amenities",
            authRequired: true
        },
        component: () => import ("../views/settings/amenities/index.vue"),
        children: [
            {
                path: ":id",
                name: "settings.amenities.details",
                component: () => import ("../views/settings/amenities/index.vue")
            }
        ]
    }, {
        path : "/logout",
        name: "logout",
        meta: {
            title: "Logout",
            authRequired: true
        },
        component: () => import ("../views/auth/logout/basic")
    },

    /* account */
    {
        path : "/account",
        name: "account",
        meta: {
            title: "Amenities",
            authRequired: true
        },
        children: [
            {
                path: "/account/profile",
                name: "account.profile",
                component: () => import ("../views/account/profile.vue")
            }, {
                path: "/account/profile/edit",
                name: "account.editprofile",
                component: () => import ("../views/account/profile.edit.vue")
            }
        ]
    },

    //ogranizations
    {
        path : '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import ('../views/auth/errors/404-cover')
    }, {
        path : '/user-:afterUser(.*)',
        component: () => import ('../views/auth/errors/404-cover')
    }
);

export default routes;