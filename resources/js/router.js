import Vue from 'vue'
import VueRouter from 'vue-router'
// Admin Pages
Vue.use(VueRouter)

const routes = [
    // { 
    //     path:'/', 
    //     component: () => import('./components/RootCustomer' /* webpackChunkName: "js/chunk-root-customer" */),
    //     children: [
    //         { 
    //             path: '/', 
    //             component: () => import('./components/Customer/AppBazaar' /* webpackChunkName: "js/chunk-app-bazaar" */),
    //         },
    //         { 
    //             path: '/stands', 
    //             component: () => import('./components/Customer/AppAllStands' /* webpackChunkName: "js/chunk-app-all-stands" */),
    //         },
    //         { 
    //             path: '/products',
    //             component: () => import('./components/Customer/AppAllProducts' /* webpackChunkName: "js/chunk-app-all-products" */),
    //         },
    //     ]
    // },
    { 
        path:'/',
        component: () => import('./components/RootAdmin' /* webpackChunkName: "js/chunk-root-admin" */),
        children: [
            {
                path: '/login', 
                component: () => import('./components/Admin/AppLogin' /* webpackChunkName: "js/chunk-app-login" */),
            },
            {
                path: '/register', 
                component: () => import('./components/Admin/AppRegister' /* webpackChunkName: "js/chunk-app-register" */), 
            },
            {
                path: '/etalase', 
                component: () => import('./components/StoreFront' /* webpackChunkName: "js/chunk-store-front" */), 
            },
            { 
                path: '', 
                component: () => import('./components/Admin/AppDashboard' /* webpackChunkName: "js/chunk-app-dashboard" */), 
                children: [
                    { 
                        path: '', 
                        redirect: 'order-menu',
                    },
                    { 
                        path: 'cart', 
                        component: () => import('./components/Admin/Pages/AppCart' /* webpackChunkName: "js/chunk-app-order" */),
                        meta: { forAdmin: false },
                    },
                    { 
                        path: 'order-menu', 
                        component: () => import('./components/Admin/Pages/AppOrder' /* webpackChunkName: "js/chunk-app-order" */),
                        meta: { forAdmin: false },
                    },
                    { 
                        path: 'my-stand', 
                        component: () => import('./components/Admin/Pages/AppStandDetails' /* webpackChunkName: "js/chunk-app-my-stand-details" */),
                        meta: { forAdmin: false },
                    },
                    { 
                        path: 'stand-transactions', 
                        component: () => import('./components/Admin/Pages/AppStandTransactions' /* webpackChunkName: "js/chunk-app-stand-transactions" */),
                        meta: { forAdmin: false },
                    },
                    {
                        path: 'all-stands', 
                        component: () => import('./components/Admin/Pages/AppAdminAllStands' /* webpackChunkName: "js/chunk-app-admin-all-stands" */),
                        meta: { forAdmin: true },
                    },
                    {
                        path: 'stands/:standId', 
                        component: () => import('./components/Admin/Pages/AppStandDetails' /* webpackChunkName: "js/chunk-app-stand-details" */),
                        meta: { forAdmin: true },
                    },
                    { 
                        path: 'transactions', 
                        component: () => import('./components/Admin/Pages/AppAdminTransaction' /* webpackChunkName: "js/chunk-app-admin-transaction" */), 
                        meta: { forAdmin: true },
                    },
                ],
                meta: { requiresAuth: true },
            },
        ],
    },
    { 
        path: '*', 
        redirect: '/' 
    },
]

const router = new VueRouter({
    routes,
    hashbang: false,
    mode: 'history',
})

import User from './helpers/User';

const NOLOGINPATHS = [
    "/login",
    "/register",
    "/etalase",
];

router.beforeEach(async (to, from, next) => {
    if(to.matched.some(route => route.meta.requiresAuth)) {
        if(!User.loggedIn()) {
            next({path: '/login', replace: true})
            return
        } else {
            if(to.matched.some(route => route.meta.forAdmin)) {
                if(!User.info().is_admin) {
                    next({path: '/order-menu', replace: true})
                    return
                }
            } else {
                if(User.info().is_admin) {
                    next({path: '/all-stands', replace: true})
                    return
                }
            }
        }
    } else {
        if(User.loggedIn()) {
            next({path: '/', replace: true})
            return
        }
    }
    
    if(NOLOGINPATHS.includes(to.path)) {
        if(User.loggedIn()) {
            next({path: '/', replace: true})
            return
        }
    }

    next();
})

export default router;