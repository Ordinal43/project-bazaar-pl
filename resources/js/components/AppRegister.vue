<template>
    <v-app>
        <v-content>
            <v-container grid-list-lg fill-height>
                <v-layout row wrap justify-center align-content-space-around>
                    <v-flex xs12 md5 lg3>
                        <v-img
                            src="/assets/logo-pkwu.png"
                            contain
                            position="center center"
                            height="240"
                        ></v-img>
                    </v-flex>
                    <v-flex xs12 md7 lg9 style="max-width: 600px">
                        <v-card elevation-10 class="rounded">
                        <v-form ref="login_form" @submit.prevent="register">
                            <v-card-title>
                                <h3 class="headline">
                                    Buat akun baru
                                </h3>
                            </v-card-title>
                            <v-card-text>
                                <v-text-field
                                    label="Nama"
                                    v-model="name"
                                    type="text"
                                    :rules="[rules.required]"
                                ></v-text-field>
                                <v-text-field
                                    label="Email"
                                    v-model="email"
                                    type="text"
                                    :rules="[rules.required, rules.email]"
                                ></v-text-field>
                                <v-text-field
                                    label="Password"
                                    v-model="password"
                                    :rules="[rules.required, rules.password]"
                                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                    @click:append="showPassword = !showPassword"
                                    :type="showPassword ? 'text' : 'password'"
                                ></v-text-field>
                                <v-text-field
                                    label="Konfirmasi Password"
                                    v-model="cpassword"
                                    :rules="[rules.required, rules.password, samePasswordRule]"
                                    :success="samePasswordSuccess"
                                    type="password"
                                ></v-text-field>
                            </v-card-text>

                            <v-card-text class="text-xs-center">
                                <v-btn color="primary" 
                                    :loading="loading"
                                    round large block type="submit"
                                >
                                    daftar
                                </v-btn>
                            </v-card-text>
                            <v-card-text class="text-xs-center">
                                <span>Sudah punya akun?</span>
                                <v-btn color="accent" round to="/login">
                                    masuk
                                </v-btn>
                                <div class="mb-5"></div>
                                <span>Mendaftarkan stand?</span>
                                <v-btn color="grey" small round outline to="/register/seller">
                                    Daftar stand
                                </v-btn>
                            </v-card-text>
                        </v-form>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>

export default {
    data: () => ({
        name: null,
        email: null,
        password: null,
        showPassword: false,
        cpassword: null,
        loading: false,

        rules: {
            required: v => !!v || 'Harus diisi',
            email: v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail tidak valid',
            password: v => String(v).length >= 6 || 'Password minimal 6 karakter',
        },
    }),
    computed: {
        samePasswordRule() {
            return this.password === this.cpassword || 'Password tidak sesuai'
        },
        samePasswordSuccess() {
            return !!this.cpassword && (this.password === this.cpassword) 
        }
    },
    methods: {
        async register() {
            if(this.$refs.login_form.validate()) {
                this.loading = true
                try {
                    const request = {
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        c_password: this.cpassword,
                    };

                    const res = await this.$user.signupCustomer(request)
                    this.$user.storeSession(res.data)
                    this.$router.replace({path: "/"});
                } catch (err) {
                    const code = err.response.status;
                    swal({
                        title: "Oops!",
                        text: `Error ${code}.`,
                        icon: "error",
                    });
                }
                this.loading = false
            }
        },
    },
}
</script>
