<template>
    <v-container grid-list-lg>
        <v-layout row wrap v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-flex>
        </v-layout>
        <div v-show="!loading">
            <v-layout row align-center>
                <v-btn fab dark color="primary" to="/all-stands" v-if="$user.info().role_id == 1">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <div class="ml-4">
                    <v-layout row wrap align-center>
                        <span class="headline font-weight-bold mr-1">
                            Stand {{ name }}
                        </span>
                    </v-layout>
                    <v-layout row wrap>
                        <div class="subheading">{{ description }}</div>
                    </v-layout>
                </div>
            </v-layout>
            <v-divider class="mt-4"></v-divider>
            <v-container grid-list-lg>
                <v-layout row align-center class="mt-2 mb-3">
                    <v-flex xs6 class="title font-weight-bold">
                        Daftar Menu
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md6 lg4 v-for="(item, i) in standProducts" :key="`am-${i}`">
                        <product-card :item="item"></product-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>
    </v-container>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        ProductCard: () => import('../ProductCard' /* webpackChunkName: "js/chunk-product-card" */),
    },
    data: (vm) => ({
        stand: vm.$route.params.standId,
        productId: 0,
        loading: false,
        name: "",
        description: "",
        standProducts: [],
    }),
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
    },
    methods: {
        ...mapMutations({
            addToCartVuex: 'addToCart',
            subtractFromCartVuex: 'subtractFromCart',
        }),
        async getStandDetails() {
            this.loading = true;
            try {
                const res = await axios.get(`/api/stands/${this.stand}`);
                const stand = res.data;
                this.name = stand.stand_name;
                this.description = stand.description;
                this.standProducts = stand.products.reverse();
            } catch (err) {
                console.log(err);
            }    
            this.loading = false;    
        },
    },
    mounted() {
        this.getStandDetails();
    }
}
</script>
