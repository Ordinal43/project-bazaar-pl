const state = {
    cartItems: []
}

const getters = {
    getCartItems: (state) => state.cartItems
}

const mutations = {
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
    removeFromCart(state, inCartIdx) {
        state.cartItems.splice(inCartIdx, 1);
    },
    emptyCart(state) {
        state.cartItems = [];
    }
}

const actions = {
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
                    commit('emptyCart');
                    item.qty = 0;
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
                    commit('removeFromCart', inCartIdx);
                }
            });
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}