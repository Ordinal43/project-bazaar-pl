<template>
    <v-card class="rounded">
        <v-card-text v-if="isOpen">
            <template v-if="isError">
                <v-container grid-list-lg>
                    <v-layout row wrap class="my-5">
                        <v-flex xs12>
                            <v-img
                                src="/assets/svg/access_denied.svg"
                                height="130"
                                contain
                            ></v-img>
                        </v-flex>
                        <v-flex xs12 class="text-xs-center">
                            <p class="subheading grey--text text--darken-1">
                                {{ error }}
                                <br />
                                <span v-if="isRefreshable">
                                    Silahkan <strong>muat ulang</strong> halaman ini.
                                </span>
                            </p>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>
            <template v-else>
                <div class="mb-4 text-xs-center subheading primary--text">
                    Silahkan ke 
                    <span class="font-weight-bold">stand</span>
                    tempat pesanan anda dibuat, kemudian
                    <span class="font-weight-bold">scan kode dari stand</span>
                    jika menu sudah selesai dibuat.
                </div>
                <div class="qr-scanner__container">
                    <qrcode-stream
                        @decode="onDecode"
                        @init="onInit"
                        :camera="camera"
                        v-if="!isError"
                        class="qr-scanner"
                    >
                        <div class="text-xs-center" v-if="loading">
                            Memuat...
                        </div>
                        <div v-if="validationPending" class="validation-pending">
                            Memvalidasi...
                        </div>
                    </qrcode-stream>
                </div>
            </template>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" outline round @click="$emit('close')">
                kembali
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { QrcodeStream } from 'vue-qrcode-reader'

const CAMERA_ON = 'auto'
const CAMERA_OFF = 'off'

export default {
    props: ['isOpen', 'item'],
    components: {
        QrcodeStream
    },
    data: () => ({
        camera: CAMERA_ON,
        loading: false,
        isError: false,
        error: '',
        isRefreshable: false,
    }),
    computed: {
        validationPending () {
            return this.camera === 'off'
        },
    },
    methods: {
        async onDecode (result) {
            this.camera = CAMERA_OFF;
            if(result !== this.item.qrcode) {
                await swal({
                    title: "Pembayaran gagal!",
                    text: "Kode QR tidak sesuai!",
                    icon: "error",
                    button: "Kembali",
                });
            } else {
                try {
                    const res = await this.validateScanResult(result)
                    console.log(res.data);
                    
                    if(!!res.data.status) {
                        this.$router.replace({path: "/payment-success"});
                    } else {
                        await swal({
                            title: "Pembayaran gagal!",
                            text: res.data.message,
                            icon: "error",
                            button: "Kembali",
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            this.camera = CAMERA_ON;
        },
        validateScanResult(result) {
            return axios.post('/api/pay', {
                qrcode: result,
                user_id: this.$user.info().id,
            });
        },
        async onInit (promise) {
            this.loading = true;
            try {
                await promise;
                this.isValid = undefined;
                this.isError = false;
                this.isRefreshable = false;
                this.camera = CAMERA_ON;
            } catch (error) {
                console.log(error);
                this.isError = true;
                if (error.name === 'NotAllowedError') {
                    this.error = "Anda perlu memberikan kami izin akses kamera."
                    this.isRefreshable = true;
                } else if (error.name === 'NotFoundError') {
                    this.error = "Kami tidak mendeteksi kamera pada device anda."
                } else if (error.name === 'NotSupportedError') {
                    this.error = "ERROR: Secure context required (HTTPS, localhost)"
                } else if (error.name === 'NotReadableError') {
                    this.error = "Kamera sedang sibuk ketika coba kami akses."
                    this.isRefreshable = true;
                } else if (error.name === 'OverconstrainedError') {
                    this.error = "Kamera device anda tidak didukung situs ini."
                } else if (error.name === 'StreamApiNotSupportedError') {
                    this.error = "Browser anda tidak mendukung fitur ini. Silahkan gunakan browser rekomendasi kami (Chrome, Firefox, Opera)."
                }
            } finally {
                this.loading = false;
            }
        },
    },
}
</script>

<style lang="scss" scoped>
    .validation-pending {
        position: absolute;
        width: 100%;
        height: 100%;

        background-color: rgba(255, 255, 255, .8);
        text-align: center;
        font-weight: bold;
        font-size: 1.4rem;
        padding: 10px;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
    }

    .qr-scanner {
        max-width: 400px;
        &__container {
            display: flex;
            justify-content: center;
        }
    }
</style>
