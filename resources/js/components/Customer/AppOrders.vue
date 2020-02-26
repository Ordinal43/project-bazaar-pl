<template>
    <v-container grid-list-lg class="mb-5">
        <div class="subheading font-weight-bold">
            Daftar pesanan
        </div>

        <v-divider class="my-2"></v-divider>
    
        <v-layout row wrap>
            <template v-if="loading">
                <v-flex xs12 class="text-xs-center">
                    <v-progress-circular
                        :size="70"
                        :width="7"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
                </v-flex>
            </template>
            <template v-else>
                <v-flex xs12 md6 xl4 v-for="(item, i) in listOrders" :key="`transaction-${i}`">
                    <v-card class="rounded">
                        <v-card-title class="pb-1">
                            <span class="subheading font-weight-medium">Stand {{ getStandName(item) }}</span>
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
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="accent" flat round
                                @click="seeOrderDetail(item)"
                            >
                                <v-icon left>info</v-icon>
                                detail
                            </v-btn>
                            <v-btn color="primary" round
                                v-if="!item.is_paid && !item.is_cancel"
                            >
                                <v-icon left>local_dining</v-icon>
                                ambil
                            </v-btn>
                        </v-card-actions>
                    </v-card>
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
                            <h3 class="subheading font-weight-bold">Stand {{ getStandName(currentItem) }}</h3>
                            <span>
                                {{ $getDateString(currentItem.created_at) }}, {{ $getTimeString(currentItem.created_at) }}
                            </span>
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
                        <v-spacer></v-spacer>
                        <v-btn color="red" flat round
                            @click="cancelOrder(currentItem)"
                            v-if="!currentItem.is_paid && !currentItem.is_cancel"
                        >
                            <v-icon left>cancel</v-icon>
                            batal
                        </v-btn>
                        <v-btn color="primary" round
                            v-if="!currentItem.is_paid && !currentItem.is_cancel"
                        >
                            <v-icon left>local_dining</v-icon>
                            ambil
                        </v-btn>
                    </v-card-actions>
                </template>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
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
            axios.get(`/api/nota-user/${this.$user.info().id}`)
            .then(res => {
                this.listOrders = res.data.reverse();
                this.loading = false;
            })
            .catch(err => {
                console.log(err);
            })
        },
        getStandName(item) {
            const product = (item.order[0] || {}).product || {};
            const standName = (product.stand || {}).stand_name || "??" 
            return standName;
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
                text: "Saldo PL Pay anda akan dikembalikan.",
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
                    const res = await axios.patch(`/api/nota/cancel/${item.id}`)
                    swal({
                        title: "Pesanan dibatalkan!",
                        text: "Saldo PL Pay dikembalikan.",
                        icon: "success",
                        button: "Close",
                    });
                    this.getListOrders();
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
        }
    },
    mounted() {
        this.getListOrders();
    },
}
</script>

<style lang="scss" scoped>
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