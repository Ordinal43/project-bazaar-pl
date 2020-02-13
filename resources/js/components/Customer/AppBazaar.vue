<template>
<div>
    <v-sheet color="primary" height="60"></v-sheet>
    <v-container class="pl-pay">
        <v-card class="rounded">
            <v-card-text>
                <div class="font-weight-medium grey--text text--darken-1">
                    PL Pay
                </div>
                <div class="pl-pay__contents primary--text">
                    <div class="d-flex">
                        <span class="mr-1 font-weight-bold">
                            Rp
                        </span>
                        <span class="headline font-weight-bold">
                            {{ balanceFormat(1000000) }}
                        </span>
                    </div>
                    <v-btn round color="accent" class="ma-0" to="/topup">
                        top up
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
    <v-container grid-list-lg class="mb-5">
        <v-layout justify-space-between align-center>
            <v-flex class="subheading font-weight-bold">
                Menu hari ini! 
            </v-flex>
            <v-btn color="primary" icon @click="loadRandomProduct" :loading="randomProductLoading">
                <v-icon>replay</v-icon>
            </v-btn>
        </v-layout>
        <v-divider class="my-2"></v-divider>
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
                Memuat menu...
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center v-else>
            <v-flex xs6 md4 lg3 xl2 v-for="(item, id) in products" :key="`produk-${id}`">
                <ProductCard :item="item" :noAddButton="true" />
            </v-flex>
            <v-flex xs6 md4 lg3 xl2 v-show="!randomProductLoading">
                <v-card class="rounded" hover
                    :ripple="{ class: 'primary--text' }"
                    to="/products" height="100%"
                >
                    <v-card-text style="height: 100%" class="px-3">
                        <v-layout row wrap justify-center align-center fill-height>
                            <v-flex xs12 lg6>
                                <v-img
                                    src="/assets/svg/foods.svg"
                                    :aspect-ratio="4/3"
                                    contain
                                ></v-img>
                            </v-flex>
                            <v-flex xs12 lg6>
                                <v-card-text class="title primary--text text-xs-center text-lg-left">
                                    Lihat Semua Menu <v-icon color="primary">chevron_right</v-icon>
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</div>
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
        balanceFormat(value) {
            value = parseFloat(value);
            return value.toLocaleString(
                "de-DE", { minimumFractionDigits: 0 }
            );
        },
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

<style lang="scss" scoped>
    .pl-pay {
        margin-top: -55px;
        &__contents {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>