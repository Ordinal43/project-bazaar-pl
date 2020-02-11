<template>
    <v-card class="rounded menu-card" height="100%">
        <div>
            <v-img class="menu-img"
                :src="item.image"
                :aspect-ratio="4/3"
            ></v-img>

            <v-card-text class="text">
                <div class="title font-weight-light mb-2">{{ item.name }}</div>
                <div class="title mb-4">{{ $rupiahFormat(item.price) }}</div>
                <div class="subheading blue--text font-weight-bold" v-if="item.units > 0">Sisa {{ item.units }}</div>
                <div class="subheading red--text text-uppercase font-weight-bold" v-else>habis!</div>
            </v-card-text>
        </div>
        
        <v-card-actions v-if="item.units > 0">
            <v-spacer></v-spacer>
            <v-btn color="primary" round @click="addItem(item)"
                :disabled="isEnough"
            >
                <v-icon left>add_shopping_cart</v-icon>
                tambah
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    props: {
        item: {
            type: Object,
            required: true,
        }
    },
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
        isEnough() {
            let current = this.getCartItems.find(o => o.id === this.item.id);
            if(!!current) {
                return current.qty >= this.item.units; 
            } else {
                return false;
            }
        },
    },
    methods: {
        ...mapActions([
            'addToCart',
        ]),
        async addItem(item) {
            // Pass a new object because we only need the value, not the reference
            const newItemObj = { ...item }
            const showConfirm = await this.addToCart(newItemObj);
            if(showConfirm) {
                EventBus.$emit('showConfirmMenu', newItemObj);
            }
        }
    }
}
</script>
