<template>
    <div style="width: 100%">
        <v-card>
            <v-data-table
                :headers="headers"
                :items="items"
                disable-initial-sort
                :loading="loading"
                rows-per-page-text="Baris per halaman"
            >
                <template v-slot:items="props">
                    <td>{{ $getDateString(props.item.created_at) }}</td>
                    <td>{{ $rupiahFormat(props.item.nominal) }}</td>
                    <td>
                        <v-tooltip bottom v-if="!props.item.is_redeem">
                            <template v-slot:activator="{ on }">
                                <v-btn icon small color="primary" v-on="on" @click="showQR(props.item)">
                                    <v-icon>visibility</v-icon>
                                </v-btn>
                            </template>
                            <span>Lihat Kode</span>
                        </v-tooltip>
                        <span v-else class="danger--text font-weight-bold">
                            Sudah diambil
                        </span>
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ['items', 'loading'],
    data: () => ({
        headers: [
            { text: 'Tgl buat', value: 'created_at' },
            { text: 'Nominal', value: 'nominal' },
            { text: 'Status', value: 'is_redeem' },
        ],
    }),
    methods: {
        showQR(item) {
            this.$emit('showQR', item)
        }
    }
}
</script>