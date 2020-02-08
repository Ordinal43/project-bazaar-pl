import Vue from 'vue'
import Vuex from 'vuex'
const CART_KEY = 'bazaar_PL_cart'

Vue.use(Vuex)

const cartListener = store => {
    store.subscribe((mutation, state) => {
        if( mutation.type === 'addToCart' || 
            mutation.type === 'addNewToCart' ||
            mutation.type === 'subtractFromCart' ||
            mutation.type === 'removeFromCart') {
            localStorage.setItem(CART_KEY, JSON.stringify(state.cartItems))
        } else if(mutation.type === 'emptyCart') {
            localStorage.removeItem(CART_KEY);
        }
    })
}

  
export default new Vuex.Store({
    plugins: [cartListener],
    state: {
        cartItems: [],
    },
    getters: {
        getCartItems: (state) => state.cartItems,
    },
    mutations: {
        initializeStore(state) {
            const localStorageArray = localStorage.getItem(CART_KEY);
			if(localStorageArray) {
				state.cartItems = JSON.parse(localStorageArray);
			}
        },
        addNewToCart(state, item) {
            item.qty = 1;
            state.cartItems.push(item);
        },
        addToCart(state, { item, inCartIdx }) {
            state.cartItems[inCartIdx].qty++;
            item.qty = state.cartItems[inCartIdx].qty;
        },
        subtractFromCart(state, item) {
            const inCartIdx = state.cartItems.findIndex(obj => {
                return obj.id == item.id;
            });

            if(inCartIdx !== -1) {
                if((state.cartItems[inCartIdx].qty - 1) === 0) {
                    item.qty--;
                    state.cartItems.splice(inCartIdx, 1);
                }
                else {
                    state.cartItems[inCartIdx].qty--;
                }
            }
        },
        removeFromCart(state, item) {
            const inCartIdx = state.cartItems.findIndex(obj => {
                return obj.id == item.id;
            });

            if(inCartIdx !== -1) {
                state.cartItems.splice(inCartIdx, 1);
            }
        },
        emptyCart(state, item) {
            state.cartItems = [];
            item.qty = 0;
        },
    },
    actions: {
        async addToCart({ commit, state }, item) {
            const inCartIdx = state.cartItems.findIndex(obj => obj.id == item.id);

            // check if current menu exists
            if(inCartIdx !== -1) {
                commit('addToCart', { item, inCartIdx });
            } else {
                // check if cart is not empty and current menu is from a different stand
                if(!state.cartItems.some(cartItem => cartItem.stand_id === item.stand_id)
                    && state.cartItems.length > 0) {
                    const res = await swal({
                        title: "Perbarui Keranjang?",
                        text: "Keranjang anda terisi menu toko lain! yakin ingin buat keranjang baru?",
                        icon: "warning",
                        buttons: {
                            cancel: {
                                text: "Kembali",
                                value: false,
                                visible: true,
                                closeModal: true,
                            },
                            confirm: {
                                text: "Buat baru",
                                value: true,
                                visible: true,
                                closeModal: true
                            }
                        }
                    });
                    
                    if(res) {
                        commit('emptyCart', item);
                    } else {
                        return Promise.resolve(false);
                    }
                }
                commit('addNewToCart', item);
            }
            return Promise.resolve(true);
        
        },
        removeFromCart({ commit, state }, item) {
            const inCartIdx = state.cartItems.findIndex(obj => {
                return obj.id == item.id;
            });

            if(inCartIdx !== -1) {
                swal({
                    title: "Hapus menu?",
                    text: "Menu ini akan dihapus dari keranjang anda.",
                    icon: "warning",
                    buttons: {
                        cancel: {
                            text: "Kembali",
                            value: false,
                            visible: true,
                            closeModal: true,
                        },
                        confirm: {
                            text: "Hapus",
                            value: true,
                            visible: true,
                            closeModal: true
                        }
                    }
                }).then(res => {
                    if(res) {
                        commit('removeFromCart', item);
                    }
                });
            }
        },
        makeOrder({ state }, name) {
            return new Promise((resolve, reject) => {
                const total = state.cartItems.reduce((acc, item) => 
                    acc + (item.price * item.qty)
                , 0)
    
                const data = state.cartItems.map(
                    (item) => ({
                        product_id: item.id,
                        harga_satuan: item.price,
                        quantity: item.qty
                    })
                );
    
                axios.post('/api/nota', {
                    customer: name,
                    harga_total: total,
                    products: data
                },{
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                    }
                }).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            })
        },
    }
})