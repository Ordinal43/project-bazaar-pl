<template>
    <v-container grid-list-lg>
        <v-layout row wrap v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-flex>
        </v-layout>
        <div v-show="!loading">
            <v-layout row align-center>
                <v-btn fab dark color="primary" to="/all-stands" v-if="$user.info().role_id == 1">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <div class="ml-4">
                    <v-layout row wrap align-center>
                        <span class="headline font-weight-bold mr-1">
                            Stand {{ name }}
                        </span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn flat icon color="primary" 
                                    @click="editStand" v-on="on">
                                    <v-icon>create</v-icon>
                                </v-btn>
                            </template>
                            <span>Tooltip</span>
                        </v-tooltip>
                    </v-layout>
                    <v-layout row wrap>
                        <div class="subheading">{{ description }}</div>
                    </v-layout>
                </div>
            </v-layout>
            <v-divider class="mt-4"></v-divider>
            <v-container grid-list-lg>
                <v-layout row align-center class="mt-2 mb-3">
                    <v-flex xs6 class="title font-weight-bold">
                        Daftar Menu
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="openProductDialog">
                        <v-icon left>add</v-icon>
                        menu baru
                    </v-btn>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md6 lg4 v-for="(item, i) in standProducts" :key="`am-${i}`">
                        <v-card class="rounded menu-card" height="100%">
                            <div>
                            <v-img class="menu-img"
                            :src="item.image"
                            :aspect-ratio="16/9"
                            ></v-img>

                            <v-card-text>
                                <p class="title font-weight-regular">{{ item.name }}</p>
                                <div class="subheading">{{ $rupiahFormat(item.price) }}</div>
                                <div class="subheading">Sisa {{ item.units }}</div>
                            </v-card-text>
                            </div>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="warning" flat round @click="editProduct(item.id)">
                                    <v-icon left>create</v-icon>
                                    edit
                                </v-btn>
                                <v-btn color="error" flat round @click="deleteProduct(item.id)">
                                    <v-icon left>delete</v-icon>
                                    delete
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-dialog
                    v-model="dialogCreateEditProduct"
                    persistent max-width="600px"
                    lazy
                >
                    <dialog-create-edit-product 
                        @close="closeProduct" 
                        @create_success="reloadProduct"
                        :productId="parseInt(productId)" 
                        :stand="parseInt(stand)"
                        :key="dialogCreateEditProductKey">
                    </dialog-create-edit-product>
                </v-dialog>
            </v-container>
        </div>

        <v-dialog
            v-model="dialogEditStand"
            persistent max-width="600px"
            lazy
        >
            <dialog-edit-stand
                :standId="parseInt(stand)"
                @close="closeStand"  
                @create_success="reloadStand" 
                :key="dialogEditStandKey">
            </dialog-edit-stand>
        </v-dialog>
    </v-container>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        DialogCreateEditProduct: () => import('./DialogCreateEditProduct' /* webpackChunkName: "js/chunk-dialog-create-edit-product" */),
        DialogEditStand: () => import('./DialogEditStand' /* webpackChunkName: "js/chunk-dialog-edit-stand" */),
    },
    data: (vm) => ({
        stand: !!vm.$route.params.standId? vm.$route.params.standId : vm.$user.info().stands.id,
        productId: 0,
        loading: false,
        name: "",
        description: "",
        standProducts: [],
        dialogCreateEditProduct: false,
        dialogCreateEditProductKey: 0,
        dialogEditStand: false,
        dialogEditStandKey: 0,
    }),
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
    },
    methods: {
        async getStandDetails() {
            this.loading = true;
            try {
                const res = await axios.get(`/api/stands/${this.stand}`);
                const stand = res.data;
                this.name = stand.stand_name;
                this.description = stand.description;
                this.standProducts = stand.products.reverse();
            } catch (err) {
                console.log(err);
            }    
            this.loading = false;    
        },
        openProductDialog() {
            this.dialogCreateEditProductKey = !!this.dialogCreateEditProductKey? 0 : 1;
            this.dialogCreateEditProduct = true;
        },
        editProduct(id) {
            this.productId = id;
            this.openProductDialog();
        },
        editStand() {
            this.dialogEditStandKey = !!this.dialogEditStandKey? 0 : 1;
            this.dialogEditStand = true;
        },
        async deleteProduct(id) {
            let willDelete = await swal({
                title: "Hapus menu ini?",
                text: "Sekali dihapus, menu tidak bisa dikembalikan!",
                icon: "warning",
                dangerMode: true,
                buttons: {
                    cancel: {
                        text: "Batal",
                        value: false,
                        visible: true,
                        closeModal: true,
                    },
                    confirm: {
                        text: "Hapus",
                        value: true,
                        visible: true,
                        closeModal: false
                    }
                }
            });

            if(willDelete) {
                try {
                    await axios.delete(`/api/products/${id}`, null);
                    swal({
                        title: "Success!",
                        text: "Menu berhasil dihapus!",
                        icon: "success",
                        button: "Close",
                    });
                    this.getStandDetails();
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
        closeProduct() {
            this.dialogCreateEditProduct = false;
            this.productId = 0;
        },
        reloadProduct() {
            this.closeProduct();
            this.getStandDetails();
        },
        closeStand() {
            this.dialogEditStand = false;
        },
        reloadStand() {
            this.closeStand();
            this.getStandDetails();
        },
    },
    mounted() {
        this.getStandDetails();
    }
}
</script>
