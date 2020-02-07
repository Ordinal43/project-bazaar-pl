<template>
    <v-card class="rounded menu-card" height="100%">
        <div>
            <v-img class="menu-img"
            :src="item.image"
            :aspect-ratio="16/9"
        ></v-img>
        
        <v-card-text class="text">
            <p class="title font-weight-regular">{{ item.name }}</p>
            <p class="subheading">{{ $rupiahFormat(item.price) }}</p>
            <div class="title blue--text" v-if="item.units > 0">Sisa {{ item.units }}</div>
            <div class="title red--text text-uppercase" v-else>habis!</div>
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
import { mapGetters } from 'vuex'

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
        addItem(item) {
            EventBus.$emit('addItem', item);
        }
    }
}
</script>
