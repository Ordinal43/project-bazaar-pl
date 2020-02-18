<template>
    <v-container grid-list-lg>
        <div class="subheading font-weight-bold">
            Keranjang anda
        </div>

        <v-divider class="my-2"></v-divider>

        <v-layout row wrap>
            <template v-if="!!getCartItems.length">
                <v-flex xs12 sm7 lg8>
                    <v-layout row wrap>
                        <v-flex xs12
                            v-for="(item, index) in getCartItems" :key="`cartItem-${index}`"
                        >
                            <v-card class="rounded">
                                <v-card-text class="card-container pb-0">
                                    <div class="card-container__thumbnail">
                                        <img 
                                            :src="item.image" 
                                            :alt="item.name"
                                            class="card-container__thumbnail__image"
                                        >
                                    </div>
                                    <div class="pl-3 card-container__contents font-weight-bold subheading">
                                        <div class="mb-2">
                                            {{ item.name }}
                                        </div>
                                        <div class="primary--text">
                                            {{ $rupiahFormat(item.price) }}
                                        </div>
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn 
                                        icon outline color="grey"
                                        class="mr-2" 
                                        @click="removeFromCart(item)"
                                    >
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                    <v-btn 
                                        icon color="primary" 
                                        @click="subtractFromCart(item)" 
                                        :disabled="item.qty === 1"
                                    >
                                        <v-icon>remove</v-icon>
                                    </v-btn>
                                    <div class="subheading font-weight-medium mx-3">
                                        {{ item.qty }}
                                    </div>
                                    <v-btn 
                                        icon color="primary" 
                                        @click="addToCart(item)" 
                                        :disabled="item.qty >= item.units"
                                    >
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex sm5 lg4 class="hidden-xs-only">
                    <v-card class="rounded">
                        <v-card-title class="font-weight-bold">
                            Ringkasan Belanja
                        </v-card-title>
                        <v-card-text class="py-0">
                            <v-divider></v-divider>
                        </v-card-text>
                        <v-card-title class="subheading">
                            Total harga
                            <v-spacer></v-spacer>
                            <span class="font-weight-bold">
                                {{ $rupiahFormat(getSubtotal) }}
                            </span>
                        </v-card-title>
                        <v-card-title>
                            <v-btn 
                                color="primary" large round block
                                @click="openDialogConfirm"
                            >
                                Beli ({{ getMenuAmount }})
                            </v-btn>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </template>
            <template v-else>
                <v-flex xs12 class="mt-5">
                    <v-img
                        src="/assets/svg/empty_cart.svg"
                        height="130"
                        contain
                    ></v-img>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <p class="subheading grey--text text--darken-1">
                        Keranjang anda masih kosong. Yuk mulai pesan!
                    </p>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <v-btn
                        color="primary"
                        large round
                        to="/"
                    >
                        ke laman utama
                    </v-btn>
                </v-flex>
            </template>
        </v-layout>

        <v-dialog
            v-model="dialogConfirmPayment"
            lazy max-width="600"
        >
            <dialog-confirm-payment
                @close="dialogConfirmPayment = false"
            ></dialog-confirm-payment>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    components: {
        DialogConfirmPayment: () => import('./DialogConfirmPayment' /* webpackChunkName: "js/dialog-confirm-payment" */) 
    },
    data: () => ({
        dialogConfirmPayment: false,
    }),
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
        getMenuAmount() {
            return this.getCartItems.reduce((acc, item) => 
                acc + item.qty
            ,0);
        },
        getSubtotal() {
            return this.getCartItems.reduce((acc, item) => 
                acc + (item.qty * item.price)
            , 0)
        },
    },
    methods: {
        ...mapActions([
            'addToCart',
            'removeFromCart',
        ]),
        ...mapMutations([
            'subtractFromCart',
        ]),
        openDialogConfirm() {
            this.dialogConfirmPayment = true;
        }
    },
}
</script>
<style lang="scss" scoped>
    .card-container {
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
</style>
