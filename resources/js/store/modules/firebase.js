import { firebaseDB } from '../../helpers/Firebase'

const state = {}

const getters = {}

const mutations = {}

const actions = {
    notifyQRChange(context, qrcode) {
        return firebaseDB.collection('pkwu_pl')
            .doc('refresh_qr')
            .set({ qrcode })
    }
    async notifyNotaToSeller(context, standId) {
        const ref = firebaseDB
        .collection('pkwu_pl').doc('nota')
        .collection('seller').doc(standId.toString())

        try {
            const doc = await ref.get();
            // handle undefined object
            const flag = !(doc.data() || {}).flag;
            return ref.set({ flag });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async notifyNotaToCustomer(context, custId) {
        const ref = firebaseDB
        .collection('pkwu_pl').doc('nota')
        .collection('customer').doc(custId.toString())

        try {
            const doc = await ref.get();
            // handle undefined object
            const flag = !(doc.data() || {}).flag;
            return ref.set({ flag });
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