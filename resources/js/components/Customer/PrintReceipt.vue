<template>
    <div id="printMe" v-show="false">
        <div v-for="n in 2" :key="`nota-${n}`" class="mb-5">
            <p class="title text-xs-center">PL Food Bazaar</p>
            <div>
                <div>No Nota: {{ nota.id }}</div>
                <div>Cust : {{ nota.customer }}</div>
                <div>Tgl: {{ $getDateString(nota.created_at) }}, {{ $getTimeString(nota.created_at) }}</div>
            </div>
            <v-divider class="my-2"></v-divider>
            <table style="width: 100%;">
                <template v-for="(item, i) in nota.order">
                    <tr :key="`nt1-${i}`">
                        <td>
                            {{ item.product.name }}
                        </td>
                        <td>
                            Stand {{ item.product.stand.name }}
                        </td>
                    </tr>
                    <tr :key="`nt2-${i}`">
                        <td>
                            {{ item.quantity }} x {{ $rupiahFormat(item.harga_satuan) }}
                        </td>
                        <td class="text-xs-right">
                            {{ $rupiahFormat(item.harga_satuan * item.quantity) }}
                        </td>
                    </tr>
                </template>
            </table>
            <v-divider class="my-2"></v-divider>
            <table style="width: 100%;">
                <tr>
                <td>Subtotal</td>
                <td class="text-xs-right">{{ $rupiahFormat(getSubtotalNota) }}</td>
                </tr>
            </table>
            <v-divider class="my-2"></v-divider>
            <br><br>
            <div class="text-xs-center subheading">
                Terima kasih
            </div>
            <br><br>
            <hr style="border-top: dotted 1px;" />
            <br><br>
        </div>
    </div>
</template>
<script>
export default {
    props: ['nota'],
    mounted() {
        this.$htmlToPaper('printMe', () => {
            this.$emit('finished'); 
        });
    },
    computed: {
        getSubtotalNota() {
            const total = this.nota.order.reduce((acc, item) => acc + (item.harga_satuan * item.quantity), 0)
            return total
        },
    }
}
</script>