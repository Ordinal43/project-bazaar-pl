<template>
    <div>
        <router-view :key="$route.fullPath"></router-view>
        <vue-progress-bar></vue-progress-bar>
        <transition name="fade">
            <div class="fullscreen" v-if="loading"></div>
        </transition>
    </div>
</template>

<script>
export default {
    data: () => ({
        loading: false
    }),
    mounted () {
        //  [AppRoot.vue specific] When AppRoot.vue is finish loading finish the progress bar
        this.$Progress.finish();
        this.loading = false;
    },
    created () {
        //  [AppRoot.vue specific] When AppRoot.vue is first loaded start the progress bar
        this.$Progress.start();
        this.loading = true;
        
        this.$router.beforeEach(async (to, from, next) => {
            this.loading = true;
            this.$Progress.start();
            
            if(to.matched.some(route => route.meta.requiresAuth)) {
                
                if(!this.$user.loggedIn()) {
                    next({path: '/login', replace: true})
                    return
                } else {
                    try {
                        await this.$user.getInfo()
                        // check if there's a valid roleId meta tag 
                        if(to.matched.some(route => (route.meta.roleId >= 0 && route.meta.roleId <= 3))) {
                            if(this.$user.info().role_id != to.meta.roleId) {
                                // redirect accordingly
                                switch(this.$user.info().role_id) {
                                    case 1:
                                        next({path: '/admin-topup', replace: true});
                                        return;
                                    case 2:
                                        next({path: '/my-stand', replace: true});
                                        return;
                                    case 3:
                                        next({path: '/home', replace: true});
                                        return;
                                }
                            }
                            // user with balance over 1.000.000 can't topup
                            if(this.$user.info().balance > 1000000 && to.path === '/topup') {
                                next({path: '/home', replace: true});
                                return;
                            }
                        }
                    } catch (error) {
                        console.log(error);
                        next({path: '/login', replace: true})
                        return
                        
                    }
                }
            } else {
                if(this.$user.loggedIn()) {
                    next({path: '/', replace: true})
                    return
                }
            }
            
            next();
        })

        this.$router.afterEach((to, from) => {
            //  finish the progress bar
            this.$Progress.finish();
            this.loading = false;
        })
    },
}
</script>

<style scoped>
    .fullscreen {
        width: 100vw;
        height: 100vh;
        position: fixed;
        opacity: 0.8;
        background: #fafafa;
        top: 0;
        z-index: 10;
    }
</style>