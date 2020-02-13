<template>
    <v-card class="py-2">
        <template v-if="!!getMenuAmount">
            <v-list>
                <v-list-tile 
                    avatar 
                    v-for="(item, index) in getCartItems.slice(0, 2)" 
                    :key="`cart-${index}`"
                    class="mb-3"
                >
                    <v-list-tile-avatar>
                        <img :src="item.image" :alt="item.name">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <div class="item-wrapper">
                            <div class="item-wrapper__name pr-2">
                                {{ item.name }}
                            </div>
                            <div class="item-wrapper__price primary--text">
                                {{ $rupiahFormat(item.price) }}
                            </div>
                        </div>
                        <v-list-tile-sub-title>{{ item.qty }} porsi</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        <div 
            v-if="!!getCartItems.slice(2).length"
            class="text-xs-center pb-3 subheading grey--text text--darken-1"
        >
            ...dan {{ getCartItems.slice(2).length }} menu lainnya
        </div>

        <v-card-title class="subheading">
            <div>
                Total: 
                <span class="font-weight-bold">
                    {{ getMenuAmount }} porsi
                </span>
            </div>
            <v-spacer></v-spacer>
            <router-link to="/cart" class="primary--text font-weight-bold">
                Lihat semua
            </router-link>
        </v-card-title>
        </template>
        <template v-else>
            <v-card-title class="pt-5">
                <v-img
                    src="/assets/svg/empty_cart.svg"
                    height="130"
                    contain
                ></v-img>
            </v-card-title>
            <v-card-text class="text-xs-center">
                <p class="subheading grey--text text--darken-1">
                    Keranjangmu masih kosong nih. Yuk mulai pesan!
                </p>
            </v-card-text>
            <v-card-text>
                <div>
                    <v-btn
                        color="primary"
                        large round block
                        to="/"
                    >
                        ke beranda
                    </v-btn>
                </div>
            </v-card-text>
        </template>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'getCartItems'
        ]),
        getMenuAmount() {
            return this.getCartItems.reduce((acc, item) => acc + item.qty, 0);
        }
    }
}
</script>

<style lang="scss" scoped>
    .item-wrapper {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        &__name {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            flex: 1;
        }
        &__price {
            flex: 0 0 auto;
        }
    }
</style>