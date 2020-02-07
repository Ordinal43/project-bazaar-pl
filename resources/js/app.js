window.Vue = require('vue')

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import store from './store'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css'
import VInputNumber from './components/VInputNumber'

window.EventBus = new Vue()
window.axios = axios.create()

Vue.use(Vuetify, {
    iconfont: 'md',
    // override colors
    theme: {
        primary: "#ff5722",
    }
});

Vue.component('VInputNumber', VInputNumber)

Vue.prototype.$rupiahFormat = function(value) {
    value = parseFloat(value)
    return "Rp " + value.toLocaleString(
        "de-DE", { minimumFractionDigits: 2 }
    )
}

import User from './helpers/User'
Vue.prototype.$user = User

// vue sweet-alert
import VueSwal from 'vue-swal'
Vue.use(VueSwal)

// html to paper
import VueHtmlToPaper from 'vue-html-to-paper'
Vue.use(VueHtmlToPaper, {
    name: '_blank',
    specs: [
        'fullscreen=no',
        'titlebar=no',
        'scrollbars=yes'
    ],
    styles: [
        '/css/print.css',
        '/css/app.css',
    ],
});

import AppRoot from './components/AppRoot'
new Vue({
    el: '#app',
    router,
    store,
    components: {
        AppRoot
    },
    beforeCreate() {
		this.$store.commit('initializeStore');
	}
});