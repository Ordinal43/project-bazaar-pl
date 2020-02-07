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
                        <v-card elevation-10>
                        <v-form ref="login_form" @submit.prevent="login">
                            <v-card-text>
                                <v-text-field
                                    label="Email"
                                    v-model="email"
                                    type="text"
                                    :rules="[rules.required]"
                                ></v-text-field>
                                <v-text-field
                                    label="Password"
                                    v-model="password"
                                    :rules="[rules.required]"
                                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                    @click:append="showPassword = !showPassword"
                                    :type="showPassword ? 'text' : 'password'"
                                ></v-text-field>
                            </v-card-text>
                            <v-card-text class="text-xs-center">
                                <v-btn color="primary" 
                                    :loading="loading"
                                    round large block type="submit"
                                >
                                    masuk
                                </v-btn>
                            </v-card-text>
                            <v-card-text class="text-xs-center">
                                <span>Belum punya akun?</span>
                                <v-btn color="grey darken-2" round outline to="/register">
                                    daftar
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
        email: null,
        password: null,
        showPassword: false,
        loading: false,
        rules: {
            required: v => !!v || 'Harus diisi',
        },
    }),
    methods: {
        async login() {
            if(this.$refs.login_form.validate()) {
                this.loading = true
                try {
                    const request = {
                        email: this.email, 
                        password: this.password
                    }
                    const res = await this.$user.login(request);
                    this.$user.storeSession(res.data);
                    this.$router.replace({path: "/"});
                } catch (err) {
                    const code = err.response.status;
                    swal({
                        title: "Oops!",
                        text: `Error [${code}]. Please try again later.`,
                        icon: "error",
                    });
                }
                this.loading = false
            }
        },
    },
}
</script>
