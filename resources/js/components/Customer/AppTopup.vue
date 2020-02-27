<template>
    <v-container grid-list-lg class="mb-5">
        <template v-if="isError">
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
        </template>
        <template v-else>
            <div class="title font-weight-black mt-3 mb-4 primary--text">
                Langkah topup saldo PL Pay:
            </div>
            <div>
                <v-stepper v-model="step" vertical>
                    <v-stepper-step :complete="step > 1" step="1">
                        Kunjungi Ruang TU
                        <small>Ruang Tata Usaha terletak di lantai 1</small>
                    </v-stepper-step>

                    <v-stepper-content step="1">
                        <v-card color="grey lighten-1" class="mb-4" height="200px"></v-card>
                        <v-card-actions>
                            <v-btn color="primary" round @click="step = 2">Lanjut</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="accent" round @click="step = 3">
                                Lewati
                                <v-icon right>chevron_right</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-stepper-content>

                    <v-stepper-step :complete="step > 2" step="2">
                        Sebutkan nominal saldo yang ingin diisi
                    </v-stepper-step>

                    <v-stepper-content step="2">
                        <v-card color="grey lighten-1" class="mb-4" height="200px"></v-card>
                        <v-btn color="primary" round @click="step = 3">Lanjut</v-btn>
                        <v-btn flat round @click="step--">Kembali</v-btn>
                    </v-stepper-content>

                    <v-stepper-step :complete="step > 3" step="3">
                        Berikan ponsel ke pihak TU yang akan meng-scan kode
                    </v-stepper-step>

                    <v-stepper-content step="3">
                        <div class="qr-scanner__container">
                            <qrcode-stream
                                @decode="onDecode"
                                @init="onInit"
                                :camera="camera"
                                v-if="!isError"
                                class="qr-scanner"
                            >
                                <div class="camera-pending primary--text" v-if="loading">
                                    Memuat...
                                </div>
                                <div class="camera-pending primary--text" v-else-if="validationPending">
                                    Memvalidasi...
                                </div>
                            </qrcode-stream>
                        </div>
                        <div class="mb-2 red--text font-weight-bold" v-if="isError">
                            {{ error }}
                            <br />
                            <span v-if="isRefreshable">
                                Silahkan <strong>muat ulang</strong> halaman ini.
                            </span>
                        </div>
                        <v-btn flat round @click="step--">Kembali</v-btn>
                    </v-stepper-content>
                </v-stepper>
            </div>
        </template>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { QrcodeStream } from 'vue-qrcode-reader'

const CAMERA_ON = 'auto'
const CAMERA_OFF = 'off'

export default {
    components: {
        QrcodeStream
    },
    data: () => ({
        step: 1,
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
        ...mapActions([
            'notifyQRChange',
        ]),
        async onDecode (result) {
            this.camera = CAMERA_OFF;
            try {
                const res = await this.validateScanResult(result)
                if(!!res.data.status) {
                    await this.notifyQRChange(result);
                    this.$router.replace({path: "/topup-success"});
                } else {
                    swal({
                        title: "Redeem gagal!",
                        text: res.data.message,
                        icon: "error",
                        button: "Kembali",
                    });
                }
            } catch (error) {
                console.log(error);
            }
            this.camera = CAMERA_ON;
        },
        validateScanResult(result) {
            return axios.post('/api/redeem', {
                qrcode: result,
                user_id: this.$user.info().id,
            });
        },
        async onInit (promise) {
            this.loading = true;
            try {
                await promise;
                if(!this.validationPending) {
                    this.isError = false;
                    this.isRefreshable = false;
                    this.camera = CAMERA_ON;
                }
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
    }
}
</script>

<style lang="scss" scoped>
    .camera-pending {
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