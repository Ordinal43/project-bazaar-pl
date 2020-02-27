import Vue from 'vue'
import Vuex from 'vuex'

import moduleCart from './modules/cart'
import moduleFirebase from './modules/firebase'

Vue.use(Vuex)

const CART_KEY = 'bazaar-pl-cart'

const cartListener = store => {
    store.subscribe((mutation, state) => {
        switch(mutation.type) {
            case 'addToCart':
            case 'addNewToCart':
            case 'subtractFromCart':
            case 'removeFromCart':
                localStorage.setItem(CART_KEY, JSON.stringify(state.cart.cartItems));
                break;
            case 'emptyCart':
                localStorage.removeItem(CART_KEY);
                break;
        }
    })
}

export default new Vuex.Store({
    plugins: [
        cartListener
    ],
    modules: {
        cart: moduleCart,
        firebase: moduleFirebase
    },
    mutations: {
        initializeStore(state) {
            const localStorageArray = localStorage.getItem(CART_KEY);
            if(localStorageArray) {
                state.cart.cartItems = JSON.parse(localStorageArray);
            }
        },
    },
    actions: {
        makeOrder({ state }, userId) {
            let total = 0;
            const data = state.cart.cartItems.map(item => {
                total += item.price * item.qty;
                return {
                    product_id: item.id,
                    harga_satuan: item.price,
                    quantity: item.qty
                }
            });

            const standId = state.cart.cartItems[0].stand_id;

            return axios.post('/api/nota', {
                user_id: userId,
                stand_id: standId,
                harga_total: total,
                products: data
            },{
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }
            });
        }
    }
})