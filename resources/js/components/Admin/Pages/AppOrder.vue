<template>
    <div>
        <v-parallax
            src="/assets/stands_bg.png"
            height="200"
        >
            <v-layout
                align-left
                column
                justify-center
            >
                <div class="subheading primary--text">
                    Welcome to
                </div>
                <div class="display-1 primary--text text--darken-1 overflow stand-name"
                >Stand {{ $user.info().stands.stand_name }} </div>
            </v-layout>
        </v-parallax>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex xs6 sm4 lg3 v-for="(item, i) in standProducts" :key="`am-${i}`">
                    <product-card 
                        :item="item"
                        @addItem="addItem"
                    ></product-card>
                </v-flex>
            </v-layout>
        </v-container>

        <v-dialog
            v-model="dialog" lazy
            persistent max-width="600px"
        >
            <v-card class="rounded" v-if="!!selectedItem">
                <v-card-title>
                    <h3 class="title">Berhasil ditambahkan</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
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
                                    <div class="mb-2">
                                        {{ selectedItem.name }}
                                    </div>
                                    <div class="primary--text">
                                        {{ $rupiahFormat(selectedItem.price) }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <v-btn color="primary" round large to="/cart">
                                    lihat keranjang
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        ProductCard: () => import('../../ProductCard' /* webpackChunkName: "js/chunk-product-card" */),
    },
    data() {
        return {
            name: "",
            description: "",
            standProducts: [],
            dialog: false,
            selectedItem: null,
        }
    },
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
    },
    methods: {
        ...mapActions([
            'addToCart',
        ]),
        addItem(item) {
            this.dialog = true;
            this.selectedItem = item
            this.addToCart(item);
        },
        async fetchStandDetails() {
            const standId = this.$user.info().stands.id;
            const res = await axios.get(`/api/stands/${standId}`);
            const stand = res.data;
            this.name = stand.stand_name;
            this.description = stand.description;
            this.standProducts = stand.products.map((item) => {
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
        this.fetchStandDetails();
    }
}
</script>
<style lang="scss" scoped>
    .stand-name {
        width: 30%;
        min-width: 300px;
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
