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
            <div class="mt-2">
                <div class="subheading font-weight-bold">
                    Stand {{ name }}
                </div>
                <div>{{ description }}</div>
            </div>

            <v-divider class="my-2"></v-divider>
            
            <div class="font-weight-medium">
                Daftar Menu
            </div>
            <v-layout row wrap>
                <v-flex xs6 md4 lg3 v-for="(item, i) in standProducts" :key="`am-${i}`">
                    <product-card :item="item"></product-card>
                </v-flex>
            </v-layout>
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
