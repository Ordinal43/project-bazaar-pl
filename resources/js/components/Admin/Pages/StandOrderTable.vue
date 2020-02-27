<template>
    <div style="width: 100%">
        <v-card>
            <v-container grid-list-lg v-if="!hideSummary">
                <v-layout row wrap>
                    <v-flex xs12 md6>
                        <v-card color="blue-grey darken-3" dark>
                            <v-card-text>
                                <p class="subheading">Produk terjual</p>
                                <div class="headline">
                                    {{ getTotalSold }} item
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 md6>
                        <v-card color="blue-grey darken-3" dark>
                            <v-card-text>
                                <p class="subheading">Pendapatan saat ini</p>
                                <div class="headline">
                                    {{ $rupiahFormat(getTotalEarnings) }}
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-data-table
                :headers="headers"
                :items="items"
                disable-initial-sort
                :loading="loading"
                rows-per-page-text="Baris per halaman"
            >
                <template v-slot:items="props">
                    <td>{{ $getDateString(props.item.date) }}</td>
                    <td v-if="isAdmin">{{ props.item.stand_name }}</td>
                    <td>{{ props.item.menu }}</td>
                    <td>{{ props.item.customer }}</td>
                    <td>{{ props.item.qty }}</td>
                    <td>{{ $rupiahFormat(props.item.price) }}</td>
                    <td>{{ $rupiahFormat(props.item.total) }}</td>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>
<script>
export default {
    props: ['items', 'loading', 'hideSummary', 'isAdmin'],
    data: () => ({
        headers: [
            { text: 'Tgl order', value: 'date' },
            { text: 'Nama menu', value: 'menu', sortable: false  },
            { text: 'Pelanggan', value: 'customer', sortable: false },
            { text: 'Jumlah', value: 'qty' },
            { text: 'Harga', value: 'price' },
            { text: 'Total', value: 'total' },
        ],
    }),
    computed: {
        getTotalSold() {
            return this.items.reduce((acc, item) => acc + item.qty, 0);
        },
        getTotalEarnings() {
            return this.items.reduce((acc, item) => acc + item.total, 0);
        }
    },
    mounted() {
        if(this.isAdmin) {
            this.headers.splice(1, 0, { 
                text: 'Stand', value: 'stand_name' 
            });
        }
    },
}
</script>
