<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-side-icon
                @click.stop="drawer = !drawer"
            ></v-toolbar-side-icon>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-navigation-drawer app v-model="drawer">
            <v-list>
                <v-list-group
                    prepend-icon="more_horiz"
                    :value="isChildRouteActive"
                    no-action
                >
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>Penjual/admin</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>

                    <template v-for="(item, index) in routes">
                        <v-list-tile
                            v-if="$user.info().role_id == 1 && item.for_admin"
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
                </v-list-group>
                
            </v-list>
        </v-navigation-drawer>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    data: () => ({
        drawer: true,
        routes: [
            {
                icon: "assignment",
                title: "Daftar Transaksi",
                route: "/stand-transactions",
                for_admin: false,
            },
            {
                icon: "store_mall_directory",
                title: "Tambah Menu",
                route: "/my-stand",
                for_admin: false,
            },
            {
                icon: "local_atm",
                title: "Isi saldo",
                route: "/admin-topup",
                for_admin: true,
            },
            {
                icon: "store_mall_directory",
                title: "Semua stand",
                route: "/all-stands",
                for_admin: true,
            },
            {
                icon: "receipt",
                title: "Transaksi",
                route: "/transactions",
                for_admin: true,
            },
        ],
    }),
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
        isChildRouteActive() {
            const currentPath = this.$router.history.current.path
            return this.routes.map(item => item.route).indexOf(currentPath) !== -1;
        },
    },
    methods: {
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