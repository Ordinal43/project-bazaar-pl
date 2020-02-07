import Vue from 'vue'
import VueRouter from 'vue-router'
// Admin Pages
Vue.use(VueRouter)

const routes = [
    {
        path: '/etalase',
        component: () => import('./components/StoreFront' /* webpackChunkName: "js/chunk-store-front" */), 
    },
    {
        path: '/login',
        component: () => import('./components/AppLogin' /* webpackChunkName: "js/chunk-app-login" */),
    },
    {
        path: '/register',
        component: () => import('./components/AppRegister' /* webpackChunkName: "js/chunk-app-register" */), 
    },
    {
        path:'/', 
        component: () => import('./components/Customer/RootCustomer' /* webpackChunkName: "js/chunk-root-customer" */),
        children: [
            {
                path: '', 
                redirect: 'home',
            },
            {
                path: 'home', 
                component: () => import('./components/Customer/AppBazaar' /* webpackChunkName: "js/chunk-app-bazaar" */),
                meta: { roleId: 3 },
            },
            {
                path: 'stands', 
                component: () => import('./components/Customer/AppAllStands' /* webpackChunkName: "js/chunk-app-all-stands" */),
                meta: { roleId: 3 },
            },
            {
                path: 'stands/:standId', 
                component: () => import('./components/Customer/AppStandDetails' /* webpackChunkName: "js/chunk-app-cust-stand-details" */),
                meta: { roleId: 3 },
            },
            {
                path: 'products',
                component: () => import('./components/Customer/AppAllProducts' /* webpackChunkName: "js/chunk-app-all-products" */),
                meta: { roleId: 3 },
            },
            {
                path: 'cart', 
                component: () => import('./components/Customer/AppCart' /* webpackChunkName: "js/chunk-app-cart" */),
                meta: { roleId: 3 },
            },
        ],
        meta: { requiresAuth: true },
    },
    {
        path: '/register/seller',
        component: () => import('./components/Admin/AppRegister' /* webpackChunkName: "js/chunk-app-seller-register" */), 
    },
    {
        path: '/',
        component: () => import('./components/Admin/AppDashboard' /* webpackChunkName: "js/chunk-app-dashboard" */), 
        children: [
            {
                path: '', 
                redirect: 'all-stands',
            },
            {
                path: 'all-stands', 
                component: () => import('./components/Admin/Pages/AppAdminAllStands' /* webpackChunkName: "js/chunk-app-admin-all-stands" */),
                meta: { roleId: 1 },
            },
            {
                path: 'admin-stands/:standId', 
                component: () => import('./components/Admin/Pages/AppStandDetails' /* webpackChunkName: "js/chunk-app-admin-stand-details" */),
                meta: { roleId: 1 },
            },
            {
                path: 'transactions', 
                component: () => import('./components/Admin/Pages/AppAdminTransaction' /* webpackChunkName: "js/chunk-app-admin-transaction" */), 
                meta: { roleId: 1 },
            },
            // {
            //     path: 'order-menu', 
            //     component: () => import('./components/Admin/Pages/AppOrder' /* webpackChunkName: "js/chunk-app-order" */),
            //     meta: { roleId: 2 },
            // },
            {
                path: 'my-stand', 
                component: () => import('./components/Admin/Pages/AppStandDetails' /* webpackChunkName: "js/chunk-app-my-stand-details" */),
                meta: { roleId: 2 },
            },
            {
                path: 'stand-transactions', 
                component: () => import('./components/Admin/Pages/AppStandTransactions' /* webpackChunkName: "js/chunk-app-stand-transactions" */),
                meta: { roleId: 2 },
            },
        ],
        meta: { requiresAuth: true },
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
    "/admin/register",
    "/etalase",
];

router.beforeEach(async (to, from, next) => {
    if(to.matched.some(route => route.meta.requiresAuth)) {
        if(!User.loggedIn()) {
            next({path: '/login', replace: true})
            return
        } else {
            // check if there's a valid roleId meta tag 
            if(to.matched.some(route => (route.meta.roleId >= 0 && route.meta.roleId <= 3))) {
                if(User.info().role_id != to.meta.roleId) {
                    // redirect according
                    switch(User.info().role_id) {
                        case 1:
                            next({path: '/all-stands', replace: true});
                            return;
                        case 2:
                            next({path: '/my-stand', replace: true});
                            return;
                        case 3:
                            next({path: '/home', replace: true});
                            return;
                    }
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
            next({path: '/login', replace: true})
            return
        }
    }

    next();
})

export default router;