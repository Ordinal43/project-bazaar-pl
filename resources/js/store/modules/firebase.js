import { firestoreApp } from '../../helpers/Firebase'

const state = {}

const getters = {}

const mutations = {}

const actions = {
    notifyQRChange(context, qrcode) {
        const ref = firestoreApp
        .collection('pkwu_pl').doc('refresh_qr')
        
        try {
            return ref.set({ qrcode })
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async notifyNotaToSeller(context, standId) {
        const ref = firestoreApp
        .collection('pkwu_pl').doc('nota')
        .collection('seller').doc(standId.toString())

        try {
            return ref.set({ value: Math.random() });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async notifyNotaToCustomer(context, custId) {
        const ref = firestoreApp
        .collection('pkwu_pl').doc('nota')
        .collection('customer').doc(custId.toString())

        try {
            return ref.set({ value: Math.random() });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async notifyOrder(context, standId) {
        const ref = firestoreApp
        .collection('pkwu_pl').doc('order')
        .collection('seller').doc(standId.toString())

        try {
            return ref.set({ value: Math.random() });
        } catch (error) {
            return Promise.reject(error);
        }
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}