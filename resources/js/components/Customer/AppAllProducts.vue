<template>
    <v-container grid-list-lg>
        <div class="subheading font-weight-bold">
            Semua Menu
        </div>

        <v-divider class="my-2"></v-divider>

        <v-layout row wrap justify-center>
            <v-flex xs12 sm8 lg6>
                <v-text-field
                    solo
                    label="Cari produk"
                    clearable
                    v-model="querySearch"
                >
                    <v-icon>search</v-icon>
                </v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="(item, id) in getFilteredProducts" :key="`produk-${id}`">
                <product-card :item="item"></product-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    components: {
        ProductCard: () => import('../ProductCard' /* webpackChunkName: "js/chunk-product-card" */),
    },
    data() {
        return {
            products: [],
            querySearch: "",
        }
    },
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
        getFilteredProducts() {
            if(!!this.querySearch) {
                return this.products.filter((item) => item.name.toLowerCase().replace(/ /g,'').indexOf(this.querySearch.toLowerCase()) >= 0);
            } else {
                return this.products;
            }
        },
    },
    methods: {
        async getProducts() {
            const res = await axios.get('/api/products');
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
        },
    },
    mounted() {
        this.getProducts();
    },
}
</script>
