<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-side-icon
                @click.stop="drawer = !drawer"
            ></v-toolbar-side-icon>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-navigation-drawer app v-model="drawer">
            <v-container grid-list-lg class="title">
                <span class="font-weight-light">Halo,</span>
                <span class="font-weight-medium primary--text">{{ $user.info().name }}</span>

                <div class="my-4 primary--text balance" justify-content-start v-if="$user.info().role_id == 2">
                    <span class="mr-1">
                        Rp
                    </span>
                    <span class="headline font-weight-bold">
                        {{ balanceFormat($user.info().balance) }}
                    </span>
                </div>
            </v-container>
            <v-list>
                <template v-for="(item, index) in routes">
                    <v-list-tile
                        v-if="$user.info().role_id == item.roleId"
                        :key="`menu-${index}`"
                        router sub-group
                        :to="item.route"
                    >
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
                
                <v-list-tile @click="logout">
                    <v-list-tile-action>
                        <v-icon>power_settings_new</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>Logout</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>
<script>
import { mapGetters } from 'vuex'

const ROLE_ADMIN = 1;
const ROLE_SELLER = 2;

export default {
    data: () => ({
        drawer: true,
        routes: [
            {
                icon: "receipt",
                title: "Daftar Pesanan",
                route: "/seller-orders",
                roleId: ROLE_SELLER,
            },
            {
                icon: "store_mall_directory",
                title: "Stand Saya",
                route: "/my-stand",
                roleId: ROLE_SELLER,
            },
            {
                icon: "assignment",
                title: "Rekap Transaksi",
                route: "/stand-transactions",
                roleId: ROLE_SELLER,
            },
            {
                icon: "local_atm",
                title: "Isi Saldo",
                route: "/admin-topup",
                roleId: ROLE_ADMIN,
            },
            {
                icon: "store_mall_directory",
                title: "Semua Stand",
                route: "/all-stands",
                roleId: ROLE_ADMIN,
            },
            {
                icon: "receipt",
                title: "Rekap Transaksi",
                route: "/transactions",
                roleId: ROLE_ADMIN,
            },
        ],
    }),
    computed: {
        ...mapGetters([
            'getCartItems'
        ])
    },
    methods: {
        balanceFormat(value) {
            value = parseFloat(value);
            return value.toLocaleString(
                "de-DE", { minimumFractionDigits: 0 }
            );
        },
        async logout() {
            try {
                await this.$user.logout();
                this.$router.replace({path: "/login"})
            } catch (err) {
                const code = err.response.status;
                swal({
                    title: "Oops!",
                    text: `Error [${code}]. Please try again later.`,
                    icon: "error",
                });
            }
        },
    },
}
</script>

<style lang="scss" scoped>
    .balance {
        display: flex;
    }
</style>