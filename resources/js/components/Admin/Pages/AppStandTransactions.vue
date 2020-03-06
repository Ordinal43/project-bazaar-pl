<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <p class="headline primary--text">Rekap Transaksi</p>
            </v-flex>
            <v-flex xs12>
                <v-tabs
                    icons-and-text
                    v-model="activeTab" color="transparent"
                    slider-color="primary"
                >
                    <v-tab
                        v-for="(item, i) in tabItems"
                        :key="i" ripple
                        :href="`#tab-${i}`"
                    >
                        {{ item.name }}
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-tab>
                    
                    <v-tab-item value="tab-0">
                        <v-container grid-list-lg>
                            <v-layout row align-center class="mt-2 mb-3">
                                <div class="subheading font-weight-bold">
                                    Order Berjalan
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="fetchOngoingOrders" :loading="loadingOngoingOrders">
                                    <v-icon left>replay</v-icon>
                                    muat ulang
                                </v-btn>
                            </v-layout>
                            <v-layout row wrap>
                                <stand-order-table
                                    :items="listOngoingOrders"
                                    :loading="loadingOngoingOrders"
                                    @fetchData="fetchOngoingOrders"
                                    :hideSummary="true"
                                ></stand-order-table>
                            </v-layout>
                        </v-container>
                    </v-tab-item>

                    <v-tab-item value="tab-1">
                        <v-container grid-list-lg>
                            <v-layout row align-center class="mt-2 mb-3">
                                <div class="subheading font-weight-bold">
                                    Order Selesai
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="fetchFinishedOrders" :loading="loadingFinishedOrders">
                                    <v-icon left>replay</v-icon>
                                    muat ulang
                                </v-btn>
                                <v-btn color="success" @click="showPrint = true">
                                    <v-icon left>print</v-icon>
                                    cetak
                                </v-btn>
                            </v-layout>
                            <v-layout row wrap>
                                <stand-order-table
                                    :items="listFinishedOrders"
                                    :loading="loadingFinishedOrders"
                                ></stand-order-table>
                            </v-layout>
                        </v-container>
                    </v-tab-item>

                    <v-tab-item value="tab-2">
                        <v-container grid-list-lg>
                            <v-layout row align-center class="mt-2 mb-3">
                                <div class="subheading font-weight-bold">
                                    Order Batal
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="fetchCanceledOrders" :loading="loadingCanceledOrders">
                                    <v-icon left>replay</v-icon>
                                    muat ulang
                                </v-btn>
                            </v-layout>
                            <v-layout row wrap>
                                <stand-order-table
                                    :items="listCanceledOrders"
                                    :loading="loadingCanceledOrders"
                                    :hideSummary="true"
                                ></stand-order-table>
                            </v-layout>
                        </v-container>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
        
        <template v-if="showPrint">
            <print-transactions
                :list="listFinishedOrders"
                @finished="showPrint = false"
            ></print-transactions>
        </template>

    </v-container>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { firestoreApp } from '../../../helpers/Firebase'

export default {
    components: {
        StandOrderTable: () => import('./StandOrderTable' /* webpackChunkName: "js/chunk-stand-order-table" */),
        PrintTransactions: () => import('./PrintTransactions' /* webpackChunkName: "js/chunk-print-transactions" */),
    },
    data: (vm) => ({
        activeTab: null,
        tabItems: [
            {name: "Order Berjalan", icon: "assignment"},
            {name: "Order Selesai", icon: "assignment_turned_in"},
            {name: "Order Batal", icon: "assignment_late"},
        ],
        stand: !!vm.$route.params.standId? vm.$route.params.standId : vm.$user.getStand().id,
        loadingOngoingOrders: false,
        loadingFinishedOrders: false,
        loadingCanceledOrders: false,
        listOngoingOrders: [],
        listFinishedOrders: [],
        listCanceledOrders: [],
        showPrint: false,
    }),
    watch: {
        activeTab(val) {
            this.getOrders();
        }
    },
    methods: {
        getOrders() {
            switch(this.activeTab) {
                case "tab-0": this.fetchOngoingOrders()
                    break;
                case "tab-1": this.fetchFinishedOrders()
                    break;
                case "tab-2": this.fetchCanceledOrders()
                    break;
            }
        },
        fetchOngoingOrders() {
            this.loadingOngoingOrders = true;
            axios.get('/api/orders-null', {
                params: {
                    stand: this.stand
                }
            }).then(res => {
                const tes = res.data.filter(item => !!item.product);
                this.listOngoingOrders = tes.map(item => ({
                    id: item.id,
                    date: item.created_at,
                    menu: item.product.name,
                    customer: item.nota.users.name,
                    price: item.harga_satuan,
                    qty: item.quantity,
                    total: (item.quantity * item.harga_satuan)
                }));
                this.loadingOngoingOrders = false;
            }).catch(err => {
                console.log(err);
            });
        },
        fetchFinishedOrders() {
            this.loadingFinishedOrders = true;
            axios.get('/api/orders-true', {
                params: {
                    stand: this.stand
                }
            }).then(res => {
                const tes = res.data.filter(item => !!item.product);
                this.listFinishedOrders = tes.map(item => ({
                    id: item.id,
                    date: item.created_at,
                    menu: item.product.name,
                    customer: item.nota.users.name,
                    price: item.harga_satuan,
                    qty: item.quantity,
                    total: (item.quantity * item.harga_satuan)
                }));
                this.loadingFinishedOrders = false;
            }).catch(err => {
                console.log(err);
            });
        },
        fetchCanceledOrders() {
            this.loadingCanceledOrders = true;
            axios.get('/api/orders-false', {
                params: {
                    stand: this.stand
                }
            }).then(res => {
                const tes = res.data.filter(item => !!item.product);
                this.listCanceledOrders = tes.map(item => ({
                    id: item.id,
                    date: item.created_at,
                    menu: item.product.name,
                    customer: item.nota.users.name,
                    price: item.harga_satuan,
                    qty: item.quantity,
                    total: (item.quantity * item.harga_satuan)
                }));
                this.loadingCanceledOrders = false;
            }).catch(err => {
                console.log(err);
            });
        },
    },
    mounted() {
        const ref = firestoreApp
        .collection('pkwu_pl').doc('order')
        .collection('seller').doc(this.$user.getStand().id.toString());
        
        ref.onSnapshot(() => {
            EventBus.$emit('updateSellerBalance');
            this.getOrders();
        });
    },
}
</script>
