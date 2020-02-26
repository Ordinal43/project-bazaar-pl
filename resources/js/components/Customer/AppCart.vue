<template>
    <v-container grid-list-lg>
        <div class="subheading font-weight-bold">
            Keranjang anda
        </div>

        <v-divider class="my-2"></v-divider>

        <v-layout row wrap justify-center>
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
                                    <div class="pl-3 card-container__contents subheading">
                                        <div class="mb-2">
                                            {{ item.name }}
                                        </div>
                                        <div class="primary--text font-weight-medium">
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

                <div class="review">
                    <v-card class="rounded review__card">
                        <v-card-title class="subheading pb-1">
                            Total harga
                            <v-spacer></v-spacer>
                            <span class="font-weight-medium primary--text">
                                {{ $rupiahFormat(getSubtotal) }}
                            </span>
                        </v-card-title>
                        
                        <v-card-text class="py-2">
                            <v-divider></v-divider>
                        </v-card-text>
                        
                        <v-card-title :class="{
                            'subheading': true,
                            'pt-0': true,
                            'red--text': notEnoughBalance 
                        }">
                            {{ notEnoughBalance? 'Saldo kurang' : 'Sisa saldo' }}
                            <v-spacer></v-spacer>
                            <span>
                                {{ $rupiahFormat($user.info().balance - getSubtotal) }}
                            </span>
                        </v-card-title>

                        <v-card-title class="pt-2">
                            <v-btn 
                                color="accent" large round block
                                to="/topup"
                                v-if="notEnoughBalance"
                            >
                                Topup pl pay
                            </v-btn>
                            <v-btn 
                                color="accent" large round block
                                @click="confirmOrder"
                                :loading="loadingMakeOrder"
                                v-else
                            >
                                Pesan ({{ getMenuAmount }})
                            </v-btn>
                        </v-card-title>
                    </v-card>
                </div>
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

        <div class="bottom-spacer"></div>

        <v-dialog
            v-model="dialogOrderSuccess"
            lazy max-width="600"
        >
            
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    data: () => ({
        dialogOrderSuccess: false,
        loadingMakeOrder: false,
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
        notEnoughBalance() {
            return this.$user.info().balance < this.getSubtotal;
        }
    },
    methods: {
        ...mapActions([
            'addToCart',
            'removeFromCart',
            'makeOrder',
        ]),
        ...mapMutations([
            'subtractFromCart',
            'emptyCart',
        ]),
        async confirmOrder() {
            this.loadingMakeOrder = true;
            const willOrder = await swal({
                title: "Buat pesanan?",
                text: "Pesanan tetap bisa dibatalkan dan saldo akan kembali.",
                icon: "warning",
                closeOnClickOutside: false,
                buttons: {
                    cancel: {
                        text: "Kembali",
                        value: false,
                        visible: true,
                        closeModal: true,
                    },
                    confirm: {
                        text: "Pesan",
                        value: true,
                        visible: true,
                        closeModal: false
                    }
                }
            });

            if(willOrder) {
                try {
                    const res = await this.makeOrder(this.$user.info().id);
                    swal({
                        title: "Pesanan dibuat!",
                        icon: "success",
                        button: "Close",
                    });

                    this.$router.push('/orders');
                    this.emptyCart();
                } catch (err) {
                    console.log(err);
                    const code = err.response.status;
                    swal({
                        title: "Oops!",
                        text: `Error ${code}.`,
                        icon: "error",
                    });
                }
            } else {
                this.loadingMakeOrder = false;
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .bottom-spacer {
        height: 210px;
    }

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

    .review {
        left: 0;
        position: fixed;
        bottom: 70px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &__card {
            width: 95%;
            max-width: 400px;
        }
    }
</style>
