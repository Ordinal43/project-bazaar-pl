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
}

export default {
    state,
    getters,
    mutations,
    actions
}