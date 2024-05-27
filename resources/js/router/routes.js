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