<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-side-icon
                @click.stop="drawer = !drawer"
            ></v-toolbar-side-icon>
        </v-toolbar>

        <v-navigation-drawer
            app 
            v-model="drawer"
            class="hidden-md-and-down"
        >
            <v-list>
                <v-list-tile
                    v-for="(item, i) in routes" :key="`navdraw-${i}`"
                    router
                    :to="item.route"
                    class="my-3"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="logout">
                    <v-list-tile-action>
                        <v-icon>power_settings_new</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>Logout</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        
        <v-content>
            <router-view :key="routerKey"></router-view>

            <v-expand-x-transition>
                <div class="basket" v-if="getMenuAmount > 0">
                    <v-btn 
                        color="accent" dark
                        class="basket__button rounded"
                        large
                        @click="dialogBasket = true"
                        v-if="$route.path !== '/cart'"
                    >
                        <v-icon left>shopping_basket</v-icon>
                        {{ getMenuAmount }} menu
                    </v-btn>
                </div>
            </v-expand-x-transition>
        </v-content>

        <v-bottom-nav
            :value="true"
            app
            class="hidden-lg-and-up"
        >
            <v-btn
                v-for="(item, i) in routes" :key="`btmnav-${i}`"
                color="primary"
                flat 
                :to="item.route"
            >
                <span>{{ item.title }}</span>
                <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
        </v-bottom-nav>
        
        <v-dialog
            v-model="dialogBasket" lazy
            persistent max-width="600px"
        >
            <v-card class="rounded">
                <v-card-title>
                    <h3 class="title">Keranjang</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogBasket = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <CartPreview />
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogConfirm" lazy
            persistent max-width="600px"
        >
            <v-card class="rounded" v-if="!!selectedItem">
                <v-card-title>
                    <h3 class="title">Berhasil ditambahkan</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogConfirm = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-card class="rounded">
                        <v-card-text class="card">
                            <div class="card__container">
                                <div class="card__container__thumbnail">
                                    <img 
                                        :src="selectedItem.image" 
                                        :alt="selectedItem.name"
                                        class="card__container__thumbnail__image"
                                    >
                                </div>
                                <div class="pl-3 card__container__contents subheading grey--text text--darken-1">
                                    <div>
                                        {{ selectedItem.name }}
                                    </div>
                                    <div class="primary--text mb-2">
                                        {{ $rupiahFormat(selectedItem.price) }}
                                    </div>
                                    <div class="font-weight-bold">
                                        {{ selectedItem.qty }} porsi
                                    </div>
                                </div>
                            </div>
                            <div>
                                <v-btn color="primary" icon large to="/cart">
                                    <v-icon>shopping_cart</v-icon>
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        CartPreview: () => import('./CartPreview' /* webpackChunkName: "js/chunk-cart-preview" */),
    },
    data: () => ({
        routerKey: 0,
        drawer: false,
        routes: [
            {
                icon: "home",
                title: "Beranda",
                route: "/home",
                for_admin: false,
            },
            {
                icon: "store_mall_directory",
                title: "Daftar Stand",
                route: "/stands",
                for_admin: false,
            },
        ],
        dialogConfirm: false,
        selectedItem: null,
        dialogBasket: false,
    }),
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
        getMenuAmount() {
            return this.getCartItems.reduce((acc, item) => acc + item.qty, 0);
        },
    },
    methods: {
        async logout() {
            try {
                await this.$user.logout();
                this.$router.replace({path: "/login"})
            } catch (err) {
                const code = err.response.status;
                swal({
                    title: "Oops!",
                    text: `Error [${code}]. Please try again later.`,
                    icon: "error",
                });
            }
        },
    },
    mounted() {
        EventBus.$on('showConfirmMenu', item => {
            this.selectedItem = item
            this.dialogConfirm = true;
        })
    },
}
</script>

<style lang="scss" scoped>
    .item-wrapper {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        &__name {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            flex: 1;
        }
        &__price {
            flex-basis: 0 0 auto;
        }
    }

    .card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &__container {
            display: flex;
            &__thumbnail {
                flex: 0 0 76px;
                &__image {
                    height: 76px;
                    width: 76px;
                    border-radius: 6px;
                    object-fit: cover;
                }
            }
            &__contents {
                flex: 1 0 auto;
            }

    .basket {
        position: fixed;
        bottom: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &__button {
            width: 95%;
            max-width: 400px;
        }
    }
</style>