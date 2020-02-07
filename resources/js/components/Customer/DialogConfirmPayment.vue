<template>
    <v-card class="rounded">
        <v-card-title>
            <h3 class="headline">
                Info pembeli
            </h3>
        </v-card-title>
        <v-card-text>
            <v-form ref="formConfirm">
                <v-text-field
                    label="Nama"
                    autofocus
                    v-model="name"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" round large flat @click="$emit('close')">
                kembali
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" round large @click="buy" :loading="loading">
                beli
            </v-btn>
        </v-card-actions>
        <template v-if="!!showPrint">
            <print-receipt
                :nota="nota"
                @finished="finishOrder"
            ></print-receipt>
        </template>
    </v-card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
    components: {
        PrintReceipt: () => import('./PrintReceipt' /* webpackChunkName: "js/chunk-print-receipt" */),
    },
    data: () => ({
        name: null,
        nota: null,
        loading: false,
        showPrint: false,
        rules: {
            required: v => !!v || 'Harus diisi',
        }
    }),
    methods: {
        ...mapActions([
            'makeOrder',
        ]),
        ...mapMutations([
            'emptyCart',
        ]),
        async buy() {
            if(this.$refs.formConfirm.validate()) {
                try {
                    const res = await swal({
                        title: "Pesan menu?",
                        text: "Menu yang dipilih masuk ke daftar pesanan.",
                        icon: "warning",
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
                                closeModal: false,
                            }
                        }
                    });
                    if(res) {
                        this.loading = true;
                        const res = await this.makeOrder(this.name);
                        await swal({
                            title: "Success!",
                            text: "Pesanan berhasil dibuat!",
                            icon: "success",
                            button: "Cetak Nota",
                        });
                        const print = await axios.get(`/api/nota/${res.data.nota_id}`);
                        this.nota = print.data;
                        this.showPrint = true;
                    }
                } catch (err) {
                    const code = err.response.status;
                    swal({
                        title: "Oops!",
                        text: `Error ${code}.`,
                        icon: "error",
                    });
                }
            }
        },
        finishOrder() {
            this.$router.replace({path: '/'});
            this.emptyCart();
        },
    },
}
</script>