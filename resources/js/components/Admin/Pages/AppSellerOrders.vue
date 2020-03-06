<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <p class="headline primary--text">Daftar Pesanan</p>
            </v-flex>
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
                <v-flex xs12 md6 lg4 v-for="(item, i) in listOrders" :key="`transaction-${i}`">
                    <v-card class="rounded">
                        <v-card-title class="pb-1">
                            <span class="subheading font-weight-medium order-title">{{ item.users.name }}</span>
                            <v-spacer></v-spacer>
                            <v-chip
                                color="red" text-color="white"
                                v-if="!!item.is_cancel"
                            >
                                <strong>Batal</strong>
                            </v-chip>
                            <v-chip
                                color="success" text-color="white"
                                v-else-if="!!item.is_paid"
                            >
                                <strong>Selesai</strong>
                            </v-chip>
                            <v-chip
                                color="warning" text-color="white"
                                v-else
                            >
                                <strong>Belum ambil</strong>
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
                        <v-card-actions class="pt-4">
                            <v-btn color="primary" flat round
                                @click="seeOrderDetail(item)"
                            >
                                <v-icon left>description</v-icon>
                                detail
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="success" round
                                v-if="!item.is_paid && !item.is_cancel"
                                @click="showQR(item)"
                            >
                                <v-icon left>done</v-icon>
                                selesai
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </template>
            <template v-if="!listOrders.length && !loading">
                <v-flex xs12 class="mt-5">
                    <v-img
                        src="/assets/svg/stands.svg"
                        height="130"
                        contain
                    ></v-img>
                </v-flex>
                <v-flex xs12 class="text-xs-center mt-3">
                    <p class="subheading grey--text text--darken-1">
                        Tidak ada pesanan menunggu.
                        <br />
                        Pastikan anda sudah menambahkan menu!
                    </p>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                    <v-btn
                        color="primary"
                        large round
                        to="/my-stand"
                    >
                        <v-icon left>store_mall_directory</v-icon>
                        stand saya
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
                            <h3 class="subheading font-weight-bold">{{ currentItem.users.name }}</h3>
                            <div>
                                {{ $getDateString(currentItem.created_at) }}, {{ $getTimeString(currentItem.created_at) }}
                            </div>
                            <div>
                                <v-chip
                                    color="red" text-color="white"
                                    v-if="!!currentItem.is_cancel"
                                >
                                    <strong>Batal</strong>
                                </v-chip>
                                <v-chip
                                    color="success" text-color="white"
                                    v-else-if="!!currentItem.is_paid"
                                >
                                    <strong>Selesai</strong>
                                </v-chip>
                                <v-chip
                                    color="warning" text-color="white"
                                    v-else
                                >
                                    <strong>Belum ambil</strong>
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
                    <v-card-actions>
                        <v-btn color="error" round
                            @click="cancelOrder(currentItem)"
                            v-if="!currentItem.is_paid && !currentItem.is_cancel"
                        >
                            <v-icon left>cancel</v-icon>
                            batal
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="success" round
                            v-if="!currentItem.is_paid && !currentItem.is_cancel"
                            @click="showQR(currentItem)"
                        >
                            <v-icon left>done</v-icon>
                            selesai
                        </v-btn>
                    </v-card-actions>
                </template>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogQR"
            max-width="500px"
        >
            <v-card class="rounded">
                <v-card-title class="pb-0">
                    <span class="subheading font-weight-medium">Selesaikan transaksi</span>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogQR = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="text-xs-center">
                    <div class="mb-2 text-xs-center subheading" v-if="currentItem">
                        <div>
                            Pemesan: <strong>{{ currentItem.users.name }}</strong>
                        </div>
                        <div>
                            Tanggal pesan:
                            <strong>
                                {{ $getDateString(currentItem.created_at) }}, {{ $getTimeString(currentItem.created_at) }}
                            </strong>
                        </div>
                        <div>
                            Harga total: <strong>{{ $rupiahFormat(currentItem.harga_total) }}</strong>
                        </div>
                    </div>
                    <qrcode v-if="!!shownQR" :value="shownQR" :options="{ width: 300 }"></qrcode>
                    <div class="text-xs-center">
                        Jika makanan 
                        <span class="font-weight-bold accent--text">sudah diambil</span>
                        , minta
                        <span class="font-weight-bold accent--text">customer</span>
                        anda untuk
                        <span class="font-weight-bold accent--text">scan kode ini</span>
                        sebagai tanda
                        <span class="font-weight-bold accent--text">transaksi selesai</span>
                        !
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { firestoreApp } from '../../../helpers/Firebase'

export default {
    data: () => ({
        listOrders: [],
        loading: true,
        dialogDetail: false,
        currentItem: null,

        dialogQR: false,
        shownQR: '',
    }),
    methods: {
        ...mapActions([
            'notifyNotaToCustomer',
            'notifyOrder'
        ]),
        getStandOrders() {
            this.loading = true;
            axios.get(`/api/nota-stand/${this.$user.getStand().id}`)
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
        async cancelOrder(item) {
            const willCancel = await swal({
                title: "Batalkan pesanan?",
                text: "Saldo PL Pay anda akan dikembalikan ke customer.",
                icon: "warning",
                dangerMode: true,
                buttons: {
                    cancel: {
                        text: "Kembali",
                        value: false,
                        visible: true,
                        closeModal: true,
                    },
                    confirm: {
                        text: "Batalkan",
                        value: true,
                        visible: true,
                        closeModal: false
                    }
                }
            });

            if(willCancel) {
                try {
                    await axios.patch(`/api/nota/cancel/${item.id}`);

                    this.notifyNotaToCustomer(item.users.id);
                    this.notifyOrder(this.$user.getStand().id);

                    swal({
                        title: "Pesanan dibatalkan!",
                        icon: "success",
                        button: "Close",
                    });
                    this.getStandOrders();
                } catch (err) {
                    console.log(err);
                    swal({
                        title: "Pesanan gagal dibatalkan!",
                        text: "Terjadi kesalahan pada sistem. Mohon coba beberapa saat lagi",
                        icon: "error",
                        button: "Close",
                    });
                    
                }
                this.dialogDetail = false
            }
        },
        showQR(item) {
            this.currentItem = item;
            this.shownQR = item.qrcode;
            this.dialogQR = true;
        },
    },
    mounted() {
        this.getStandOrders();

        const standId = this.$user.getStand().id;        
        
        firestoreApp
        .collection('pkwu_pl').doc('nota')
        .collection('seller').doc(standId.toString())
        .onSnapshot(() => {
            EventBus.$emit('updateSellerBalance');
            this.dialogDetail = false;
            this.dialogQR = false;
            this.getStandOrders();
        });
    },
}
</script>

<style lang="scss" scoped>
    .loading {
        padding: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0.8;
        background: #fafafa;
        z-index: 2;
    }
    
    .order-title {
        align-self: flex-start;
        padding-top: 3px;
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