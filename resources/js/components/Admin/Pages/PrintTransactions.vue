<template>
    <div v-show="false" id="printMe">
        <div class="ma-3">
            <div class="text-xs-center mb-2">
                <p class="headline">Laporan Riwayat Transaksi</p>
                <p class="title" v-if="!isAdmin">
                    Stand {{ $user.getStand().stand_name }}
                </p>
                <p class="title" v-else>
                    Seluruh Stand
                </p>
            </div>
            <div>
                <table class="orders">
                    <tr>
                        <th>Id order</th>
                        <th v-if="isAdmin">Stand</th>
                        <th>Tanggal order</th>
                        <th>Menu</th>
                        <th>Pelanggan</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th>Total</th>
                    </tr>
                    <template v-for="(item, i) in list">
                        <tr :key="i">
                            <td>{{ item.id }}</td>
                            <td v-if="isAdmin">{{ item.stand_name }}</td>
                            <td>{{ item.date }}</td>
                            <td>{{ item.menu }}</td>
                            <td>{{ item.customer }}</td>
                            <td>{{ item.qty }}</td>
                            <td>{{ $rupiahFormat(item.price) }}</td>
                            <td>{{ $rupiahFormat(item.total) }}</td>
                        </tr>
                    </template>
                    <tfoot class="title">
                        <tr>
                            <td class="text-xs-right" :colspan="isAdmin? 7 : 6">Total produk terjual</td>
                            <td>{{ getTotalSold }} item</td>
                        </tr>
                        <tr>
                            <td class="text-xs-right" :colspan="isAdmin? 7 : 6">Total pendapatan</td>
                            <td>{{ $rupiahFormat(getTotalEarnings) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['list', 'isAdmin'],
    mounted() {
        this.$htmlToPaper('printMe', null, () => {
            this.$emit('finished'); 
        });
    },
    computed: {
        getTotalSold() {
            return this.list.reduce((acc, item) => acc + item.qty, 0);
        },
        getTotalEarnings() {
            return this.list.reduce((acc, item) => acc + item.total, 0);
        }
    }
}
</script>