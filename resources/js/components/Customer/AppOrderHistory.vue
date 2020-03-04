<template>
    <v-container grid-list-lg class="mb-5">
        <div class="subheading font-weight-bold">
            Riwayat transaksi
        </div>

        <v-divider class="my-2"></v-divider>
    
        <v-layout row wrap>
            <transition name="fade">
                <v-flex xs12 class="text-xs-center loading pt-5" v-if="loading">
                    <v-progress-circular
                        :size="70"
                        :width="7"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
                </v-flex>
            </transition>
            <template v-if="!!listOrders.length">
                <v-flex xs12 md6 xl4 v-for="(item, i) in listOrders" :key="`transaction-${i}`">
                    <v-card class="rounded">
                        <v-card-title class="pb-1">
                            <span class="subheading font-weight-medium">Stand {{ item.stands.stand_name }}</span>
                            <v-spacer></v-spacer>
                            <v-chip
                                color="error" text-color="white"
                                class="mx-0"
                                v-if="!!item.is_cancel"
                            >
                                <strong>Batal</strong>
                            </v-chip>
                            <v-chip
                                color="success" text-color="white"
                                class="mx-0"
                                v-else-if="!!item.is_paid"
                            >
                                <strong>Selesai</strong>
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="pt-0 pb-0">
                            <div class="pb-1">
                                {{ $getDateString(item.created_at) }}, {{ $getTimeString(item.created_at) }}
                            </div>
                            <div>
                                <span class="font-weight-medium primary--text">
                                    {{ $rupiahFormat(item.harga_total) }}
                                </span>
                                <span class="grey--text px-1">|</span>
                                <span class="grey--text text--darken-1">
                                    {{ item.order.length }} Menu, {{ getTotalPortion(item) }} porsi
                                </span>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" flat round
                                @click="seeOrderDetail(item)"
                            >
                                <v-icon left>description</v-icon>
                                detail
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </template>
            <template v-if="!listOrders.length && !loading">
                <v-flex xs12 class="mt-5">
                    <v-img
                        src="/assets/svg/empty_cart.svg"
                        height="130"
                        contain
                    ></v-img>
                </v-flex>
                <v-flex xs12 class="text-xs-center mt-3">
                    <p class="subheading grey--text text--darken-1">
                        Tidak ada pesanan.
                        <br />
                        Mulai pesan makanan sekarang!
                    </p>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <v-btn
                        color="primary"
                        large round
                        to="/stands"
                    >
                        <v-icon left>store_mall_directory</v-icon>
                        Lihat stand
                    </v-btn>
                </v-flex>
            </template>        
        </v-layout>

        <v-dialog
            v-model="dialogDetail" lazy 
            persistent max-width="600px"
            scrollable
        >
            <v-card class="rounded">
                <template v-if="!!currentItem">
                    <v-card-title>
                        <div>
                            <h3 class="subheading font-weight-bold">Stand {{ currentItem.stands.stand_name }}</h3>
                            <div>
                                {{ $getDateString(currentItem.created_at) }}, {{ $getTimeString(currentItem.created_at) }}
                            </div>
                            <div class="mt-1">
                                <v-chip
                                    color="red" text-color="white"
                                    class="mx-0"
                                    v-if="!!currentItem.is_cancel"
                                >
                                    <strong>Batal</strong>
                                </v-chip>
                                <v-chip
                                    color="success" text-color="white"
                                    class="mx-0"
                                    v-else-if="!!currentItem.is_paid"
                                >
                                    <strong>Selesai</strong>
                                </v-chip>
                            </div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogDetail = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="px-0" style="height: 300px;">
                        <v-list>
                            <v-list-tile 
                                avatar 
                                v-for="(item, index) in currentItem.order" 
                                :key="`order-${index}`"
                                class="mb-3"
                            >
                                <v-list-tile-avatar>
                                    <img :src="item.product.image" :alt="item.product.name">
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <div class="item-wrapper">
                                        <div class="item-wrapper__name pr-2">
                                            {{ item.product.name }}
                                        </div>
                                        <div class="item-wrapper__price primary--text">
                                            {{ $rupiahFormat(item.harga_satuan) }}
                                        </div>
                                    </div>
                                    <v-list-tile-sub-title>{{ item.quantity }} porsi</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-title class="subheading">
                        Total:
                        <v-spacer></v-spacer>
                        <span class="font-weight-bold primary--text">
                            {{ $rupiahFormat(currentItem.harga_total) }}
                        </span>
                    </v-card-title>
                </template>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { firebaseDB } from '../../helpers/Firebase'

export default {
    data: () => ({
        listOrders: [],
        loading: true,
        dialogDetail: false,
        currentItem: null,
    }),
    methods: {
        getListOrders() {
            this.loading = true;
            axios.get(`/api/nota-cust-finished/${this.$user.info().id}`)
            .then(res => {
                this.listOrders = res.data;
                this.loading = false;
            })
            .catch(err => {
                console.log(err);
            })
        },
        getTotalPortion(item) {
            return item.order.reduce((acc, item) => acc + item.quantity, 0);
        },
        seeOrderDetail(item) {
            this.currentItem = item;
            this.dialogDetail = true;
        },
    },
    mounted() {
        this.getListOrders();
        const custId = (this.$user.info().id).toString();

        firebaseDB
        .collection('pkwu_pl').doc('nota')
        .collection('customer').doc(custId.toString())
        .onSnapshot(() => {
            this.getListOrders();
        });
    },
}
</script>

<style lang="scss" scoped>
    .loading {
        padding: 0;
        width: 100vw;
        height: 100%;
        position: absolute;
        opacity: 0.8;
        background: #fafafa;
        z-index: 10;
    }
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
            flex: 0 0 auto;
        }
    }
</style>