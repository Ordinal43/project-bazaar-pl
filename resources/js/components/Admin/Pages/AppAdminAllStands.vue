<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <template v-if="loading">
                <v-flex xs12 class="text-xs-center">
                    <v-progress-circular
                        :size="70"
                        :width="7"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
                </v-flex>
            </template>
            <template v-else>
                <v-flex xs12>
                    <p class="headline primary--text">Semua Stand</p>
                </v-flex>
                <v-flex xs12 md6 xl4 v-for="(item, i) in stands" :key="`prod-${i}`">
                    <v-card class="rounded" height="100%">
                        <v-card-title>
                            <span class="headline">{{ item.stand_name }}</span>
                        </v-card-title>
                        <v-card-text class="grey--text text--darken-2 pt-0">
                            {{ item.description }}
                        </v-card-text>
                        <v-card-text class="font-weight-bold blue--text">
                            {{ item.products.length }} MENU
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="indigo" flat round  :to="`/admin-stands/${item.id}`">
                                <v-icon left>info</v-icon>
                                detail
                            </v-btn>
                            <v-btn color="warning" flat round @click="editStand(item.id)">
                                <v-icon left>create</v-icon>
                                edit
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </template>
        </v-layout>

        <v-dialog
            v-model="dialogEditStand"
            persistent max-width="600px"
            lazy
        >
            <dialog-edit-stand
                :standId="parseInt(standId)"
                @close="closeStand"  
                @create_success="reloadStand" 
                :key="dialogEditStandKey">
            </dialog-edit-stand>
        </v-dialog>
    </v-container>
</template>
<script>
export default {
    components: {
        DialogEditStand: () => import('./DialogEditStand' /* webpackChunkName: "js/chunk-dialog-edit-stand" */),
    },
    data: () => ({
        standId: 0,
        loading: false,
        stands: [],
        dialogEditStand: false,
        dialogEditStandKey: 0,
    }),
    methods: {
        async getStands() {
            this.loading = true;
            try {
                const res = await axios.get('/api/stands');
                this.stands = res.data;
            } catch (err) {
                console.log(err);
            }
            this.loading = false;
        },
        openStandDialog() {
            this.dialogEditStandKey = !!this.dialogEditStandKey? 0 : 1;
            this.dialogEditStand = true;
        },
        editStand(id) {
            this.standId = id;
            this.openStandDialog();
        },
        closeStand() {
            this.dialogEditStand = false;
            this.standId = 0;
        },
        reloadStand() {
            this.closeStand();
            this.getStands();
        }
    },
    mounted() {
        this.getStands();
    }
}
</script>