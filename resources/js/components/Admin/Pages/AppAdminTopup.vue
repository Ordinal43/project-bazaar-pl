<template>
    <v-container grid-list-lg>
        <v-layout row wrap justify-center>
            <v-flex xs12>
                <p class="headline primary--text">Isi saldo</p>
            </v-flex>
            <v-flex xs12 md6 lg4>
                <v-card class="rounded">
                    <v-card-text>
                        <v-input-number
                            label="Nominal"
                            v-model="amount"
                            prefix="Rp"
                            ref="inputAmount"
                            focus
                            :rules="[rules.required, rules.tooMuch]"
                        ></v-input-number>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" large round
                            :disabled="amount <= 0 || !amount"
                            :loading="loadingCreateVoucher"
                            @click="generateVoucher"
                        >
                            buat kode
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <div class="headline font-weight-bold">
                    Daftar Voucher
                </div>
                <v-divider class="my-4"></v-divider>
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
                                    Voucher tersedia
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="fetchAvailableVoucher" :loading="loadingAvailableVoucher">
                                    <v-icon left>replay</v-icon>
                                    muat ulang
                                </v-btn>
                            </v-layout>
                            <v-layout row wrap>
                                <TopupTable
                                    :items="listAvailableVoucher"
                                    :loading="loadingAvailableVoucher"
                                    @showQR="showQR"
                                ></TopupTable>
                            </v-layout>
                        </v-container>
                    </v-tab-item>

                    <v-tab-item value="tab-1">
                        <v-container grid-list-lg>
                            <v-layout row align-center class="mt-2 mb-3">
                                <div class="subheading font-weight-bold">
                                    Voucher ditukarkan
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="fetchRedeemedVoucher" :loading="loadingRedeemedVoucher">
                                    <v-icon left>replay</v-icon>
                                    muat ulang
                                </v-btn>
                            </v-layout>
                            <v-layout row wrap>
                                <TopupTable
                                    :items="listRedeemedVoucher"
                                    :loading="loadingRedeemedVoucher"
                                    @showQR="showQR"
                                ></TopupTable>
                            </v-layout>
                        </v-container>
                    </v-tab-item>

                    <v-tab-item value="tab-2">
                        <v-container grid-list-lg>
                            <v-layout row align-center class="mt-2 mb-3">
                                <div class="subheading font-weight-bold">
                                    Semua voucher
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="fetchAllVoucher" :loading="loadingAllVoucher">
                                    <v-icon left>replay</v-icon>
                                    muat ulang
                                </v-btn>
                            </v-layout>
                            <v-layout row wrap>
                                <TopupTable
                                    :items="listAllVoucher"
                                    :loading="loadingAllVoucher"
                                    @showQR="showQR"
                                ></TopupTable>
                            </v-layout>
                        </v-container>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>

        <v-dialog
            v-model="dialogQR"
            max-width="500px"
        >
            <v-card class="rounded">
                <v-card-title>
                    <h3 class="subheading font-weight-bold">Kode Voucher</h3>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeDialog">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="text-xs-center">
                    <qrcode v-if="!!shownQR" :value="shownQR" :options="{ width: 250 }"></qrcode>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { firebaseDB } from '../../../helpers/Firebase'

export default {
    components: {
        TopupTable: () => import('./TopupTable' /* webpackChunkName: "js/chunk-topup-table" */),
    },
    data: () => ({
        amount: 0,
        rules: {
            required: v => !!v || 'Harus diisi',
            tooMuch: v => v < 100000 || 'Nilai terlalu besar!',
        },
        loadingCreateVoucher: false,
        dialogQR: false,
        shownQR: '',

        activeTab: null,
        tabItems: [
            {name: "Voucher tersedia", icon: "assignment"},
            {name: "Voucher ditukarkan", icon: "assignment_turned_in"},
            {name: "Semua voucher", icon: "assignment_late"},
        ],
        loadingAvailableVoucher: false,
        loadingRedeemedVoucher: false,
        loadingAllVoucher: false,
        listAvailableVoucher: [],
        listRedeemedVoucher: [],
        listAllVoucher: [],
    }),
    watch: {
        activeTab() {
            this.getVouchers();
        }
    },
    methods: {
        async generateVoucher() {
            this.loadingCreateVoucher = true;
            try {
                const res = await axios.post('/api/voucher', {
                    nominal: this.amount,
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                    }
                });


                this.loadingCreateVoucher = false;
                if(this.activeTab === 'tab-0') {
                    this.fetchAvailableVoucher();
                } else {
                    this.activeTab = 'tab-0'
                }
                this.shownQR = res.data.data.qrcode;
                this.dialogQR = true;
                this.amount = 0;
            } catch (err) {
                const code = err.response.status;
                swal({
                    title: "Oops!",
                    text: `Error [${code}]. Please try again later.`,
                    icon: "error",
                });
            }
        },
        getVouchers() {
            switch(this.activeTab) {
                case "tab-0": this.fetchAvailableVoucher()
                    break;
                case "tab-1": this.fetchRedeemedVoucher()
                    break;
                case "tab-2": this.fetchAllVoucher()
                    break;
            }
        },
        fetchAvailableVoucher() {
            this.loadingAvailableVoucher = true;
            axios.get('/api/voucher-unredeemed').then(res => {
                this.listAvailableVoucher = res.data.map(item => ({
                    ...item,
                    is_redeem: !!item.is_redeem
                }));
                this.loadingAvailableVoucher = false;
            }).catch(err => {
                console.log(err);
            });
        },
        fetchRedeemedVoucher() {
            this.loadingRedeemedVoucher = true;
            axios.get('/api/voucher-redeemed').then(res => {
                this.listRedeemedVoucher = res.data.map(item => ({
                    ...item,
                    is_redeem: !!item.is_redeem
                }));
                this.loadingRedeemedVoucher = false;
            }).catch(err => {
                console.log(err);
            });
        },
        fetchAllVoucher() {
            this.loadingAllVoucher = true;
            axios.get('/api/voucher').then(res => {
                this.listAllVoucher = res.data.map(item => ({
                    ...item,
                    is_redeem: !!item.is_redeem
                }));
                this.loadingAllVoucher = false;
            }).catch(err => {
                console.log(err);
            });
        },
        showQR(qrcode) {
            this.shownQR = qrcode;
            this.dialogQR = true;
        },
        closeDialog() {
            this.dialogQR = false;
            this.$nextTick(() => {
                this.$refs.inputAmount.focus();
            })
        }
    },
    mounted() {
        firebaseDB.collection("redeemed_qr")
        .onSnapshot(() => {
            this.closeDialog();
            this.getVouchers();
        });
    },
}
</script>