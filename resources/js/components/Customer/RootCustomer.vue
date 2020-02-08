<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-side-icon
                @click.stop="drawer = !drawer"
            ></v-toolbar-side-icon>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-menu
                    v-model="cartMenu"
                    bottom offset-y left
                    open-on-hover
                >
                    <template v-slot:activator="{ on }">
                        <v-btn flat large
                            v-on="on"
                            to="/cart"
                        >
                            <v-badge left color="red" :value="!!getMenuAmount">
                                <template v-slot:badge>
                                    <span>{{ getMenuAmount }}</span>
                                </template>
                                <v-icon left>shopping_cart</v-icon>
                                KERANJANG
                            </v-badge>
                        </v-btn>
                    </template>

                    <v-card class="py-2" width="400px">
                        <template v-if="!!getMenuAmount">
                            <v-list>
                                <v-list-tile 
                                    avatar 
                                    v-for="(item, index) in getCartItems.slice(0, 2)" 
                                    :key="`cart-${index}`"
                                    class="mb-3"
                                >
                                    <v-list-tile-avatar>
                                        <img :src="item.image" :alt="item.name">
                                    </v-list-tile-avatar>

                                    <v-list-tile-content>
                                        <div class="item-wrapper">
                                            <div class="item-wrapper__name pr-2">
                                                {{ item.name }}
                                            </div>
                                            <div class="item-wrapper__price primary--text">
                                                {{ $rupiahFormat(item.price) }}
                                            </div>
                                        </div>
                                        <v-list-tile-sub-title>{{ item.qty }} porsi</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        <div 
                            v-if="!!getCartItems.slice(2).length"
                            class="text-xs-center pb-3 subheading grey--text text--darken-1"
                        >
                            ...dan {{ getCartItems.slice(2).length }} menu lainnya
                        </div>

                        <v-card-title class="subheading">
                            <div>
                                Total: 
                                <span class="font-weight-bold">
                                    {{ getMenuAmount }} porsi
                                </span>
                            </div>
                            <v-spacer></v-spacer>
                            <router-link to="/cart" class="primary--text font-weight-bold">
                                Lihat semua
                            </router-link>
                        </v-card-title>
                        </template>
                        <template v-else>
                            <v-card-title class="pt-5">
                                <v-img
                                    src="/assets/svg/empty_cart.svg"
                                    height="130"
                                    contain
                                ></v-img>
                            </v-card-title>
                            <v-card-text class="text-xs-center">
                                <p class="subheading grey--text text--darken-1">
                                    Keranjangmu masih kosong nih. Yuk mulai pesan!
                                </p>
                            </v-card-text>
                            <v-card-text>
                                <div>
                                    <v-btn
                                        color="primary"
                                        large round block
                                        to="/"
                                    >
                                        lihat daftar menu
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </template>
                    </v-card>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <v-navigation-drawer app v-model="drawer">
            <v-list>
                <v-list-tile
                    to="/stands"
                    class="my-3"
                >
                    <v-list-tile-action>
                        <v-icon>mdi-food-fork-drink</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>Cari Stand</v-list-tile-title>
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
        </v-content>
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
    data: () => ({
        routerKey: 0,
        drawer: true,
        cartMenu: false,
        dialogConfirm: false,
        selectedItem: null,
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
        }
    }
</style>