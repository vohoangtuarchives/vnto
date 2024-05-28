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
            }, {
                path: "config-policy",
                name: "settings.config_policy",
                children: [
                    {
                        path: "man",
                        name: "settings.config_policy.man",
                        component: () => import ("../views/settings/config_policy/index.vue"),
                    },
                    {
                        path: "add",
                        name: "settings.config_policy.add",
                        component: () => import ("../views/settings/config_policy/add.vue")
                    },
                    {
                        path: "edit/:id",
                        name: "settings.config_policy.edit",
                        component: () => import ("../views/settings/config_policy/add.vue")
                    }
                ]
            }, {
                path: "price-rule",
                name: "settings.price_rule",
                children: [
                    {
                        path: "man",
                        name: "settings.price_rule.man",
                        component: () => import("../views/settings/price_rule/index.vue"),
                    },
                    {
                        path: "add",
                        name: "settings.price_rule.add",
                        component: () => import ("../views/settings/price_rule/add.vue")
                    },
                    {
                        path: "edit/:id",
                        name: "settings.price_rule.edit",
                        component: () => import ("../views/settings/price_rule/add.vue")
                    }
                ]
            }, {
                path: "configurations",
                name: "settings.configurations",
                component: () => import ("../views/settings/configurations/index.vue")
            }
        ]
    }, {
        path : "/information",
        meta: {
            title: "Dashboard",
            authRequired: true
        },
        children: [
            {
                path: "/job-description/:id",
                name: "information.job.description",
                component: () => import ("../views/information/page/job_description.vue")
            },
            {
                path: "/job-description/add/:id",
                name: "information.add.job.description",
                component: () => import ("../views/information/page/add_job_description.vue")
            }
        ]
    },{
        path: "/newsfeed",
        name:'newsfeed',
        meta: {
            title: "Newsfeed",
            authRequired: true,
        },
        component: () => import ("../views/newsfeed/index.vue")
    }, {
        path : "/media-upload",
        meta: {
            title: "Dashboard",
            authRequired: true
        },
        children: [
            {
                path: "",
                name: "media.upload",
                component: () => import ("../views/settings/index.vue")
            }, {
                path: "banner-login",
                name: "upload.banner_login",
                component: () => import ("../views/media-upload/photo/index.vue")
            }
            , {
                path: "logo-login",
                name: "upload.logo_login",
                component: () => import ("../views/media-upload/photo-static/index.vue")
            }
        ]
    }
    , {
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
    },
    {
        path : "/company",
        meta: {
            title: "Dashboard",
            authRequired: true
        },
        children: [
            {
                path: ":type",
                name: "static.company",
                component: () => import ("../views/company/page/page-company.vue")
            },
        ]
    },
    {
        path : "/posts",
        name: "posts",
        meta: {
            title: "QUẢN LÍ BÀI VIẾT",
            authRequired: true
        },
        children: [
            {
                path: "man/:type",
                name: "posts.man",
                component: () => import ("../views/post/page/posts-man.vue"),
            },
            {
                path: "add/:type",
                name: "posts.add",
                component: () => import ("../views/post/page/posts-add.vue")
            },
            {
                path: "edit/:type/:id",
                name: "posts.edit",
                component: () => import ("../views/post/page/posts-add.vue")
            },
            {
                path: "overview/:type/:id",
                name: "posts.overview",
                component: () => import ("../views/post/page/posts-overview.vue")
            },
        ]
    },
    {
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