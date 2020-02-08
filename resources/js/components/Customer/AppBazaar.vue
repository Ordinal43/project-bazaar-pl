<template>
    <v-container grid-list-lg class="my-5">
        <!-- Random Stand -->
        <v-layout justify-space-between align-center>
            <div class="subheading font-weight-bold">Kunjungi Stand Kami!</div>
            <v-btn color="primary" @click="loadRandomStand" :loading="randomStandLoading">
                <v-icon left>replay</v-icon>
                Muat lain
            </v-btn>
        </v-layout>
        
        <v-divider class="my-3"></v-divider>

        <v-layout column justify-center align-center class="my-5" v-if="randomStandLoading">
            <v-flex>
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-flex>
            <v-flex class="title font-weight-light">
                Memuat stand
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center v-else>
            <v-flex xs6 md4 lg3 v-for="(item, id) in stands" :key="`stand-${id}`">
                <stand-card :item="item"></stand-card>
            </v-flex>
            <v-flex xs12 v-show="!randomStandLoading">
            <v-card class="rounded" hover
                :ripple="{ class: 'primary--text' }"
                to="/stands" height="100%"
            >
                <v-card-text style="height: 100%" class="px-4">
                <v-layout row wrap justify-center align-center fill-height>
                    <v-flex xs12 lg6>
                    <v-img
                        src="/assets/svg/stands.svg"
                        height="180"
                        contain
                    ></v-img>
                    </v-flex>
                    <v-flex xs12 lg6>
                        <v-card-text class="display-1 font-weight-light primary--text text-xs-center text-lg-left">
                            Lihat Semua Stand
                        </v-card-text>
                    </v-flex>
                </v-layout>
                </v-card-text>
            </v-card>
            </v-flex>
        </v-layout>

        <div class="my-5"></div>

        <!-- Random Menu -->
        <v-layout justify-space-between align-center>
            <div class="subheading font-weight-bold">Coba menu kami!</div>
            <v-btn color="primary" @click="loadRandomProduct" :loading="randomProductLoading">
                <v-icon left>replay</v-icon>
                Muat lain
            </v-btn>
        </v-layout>
        <v-divider class="my-3"></v-divider>
        <v-layout column justify-center align-center class="my-5" v-if="randomProductLoading">
            <v-flex>
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-flex>
            <v-flex class="title font-weight-light">
                Memuat menu
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center v-else>
            <v-flex xs6 md4 lg3 v-for="(item, id) in products" :key="`produk-${id}`">
                <product-card :item="item"></product-card>
            </v-flex>
            <v-flex xs12 v-show="!randomProductLoading">
            <v-card class="rounded" hover
                :ripple="{ class: 'primary--text' }"
                to="/products" height="100%"
            >
                <v-card-text style="height: 100%" class="px-4">
                <v-layout row wrap justify-center align-center fill-height>
                    <v-flex xs12 lg6>
                    <v-img
                        src="/assets/svg/foods.svg"
                        height="180"
                        contain
                    ></v-img>
                    </v-flex>
                    <v-flex xs12 lg6>
                        <v-card-text class="display-1 primary--text font-weight-light text-xs-center text-lg-left">
                            Lihat Semua Menu
                        </v-card-text>
                    </v-flex>
                </v-layout>
                </v-card-text>
            </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    components: {
        ProductCard: () => import('../ProductCard' /* webpackChunkName: "js/chunk-product-card" */),
        StandCard: () => import('./StandCard' /* webpackChunkName: "js/chunk-cust-stand-card" */),
    },
    data() {
        return {
            randomStandLoading: true,
            randomProductLoading: true,
            stands: [],
            products: [],
        }
    },
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
    },
    methods: {
        loadRandomStand() {
            return new Promise(async (resolve, reject) => {
                this.randomStandLoading = true;
                try {
                    const res = await axios.get('/api/stands/random');
                    this.stands = res.data;
                    
                    resolve("oke")
                } catch (err) {
                    reject(err);
                }
                this.randomStandLoading = false;
            })
        },
        loadRandomProduct() {
            return new Promise(async (resolve, reject) => {
                this.randomProductLoading = true;
                try {
                    const res = await axios.get('/api/products/random');
                    this.products = res.data.map((item) => {
                        let q = 0;
                        this.getCartItems.forEach(cartItem => {
                            if(cartItem.id === item.id) {
                                q = cartItem.qty
                            }
                        });
                        return {
                            ...item, 
                            qty: q
                        }
                    });
                    resolve("oke")
                } catch (err) {
                    reject(err);
                }
                this.randomProductLoading = false;
            })
        },
    },
    async mounted() {
        Promise.all([this.loadRandomStand(), this.loadRandomProduct()]);
    },
}
</script>
