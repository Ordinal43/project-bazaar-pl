import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import store from './store'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css'
import VInputNumber from './components/VInputNumber'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VueProgressBar from 'vue-progressbar'
import VueSwal from 'vue-swal'
import User from './helpers/User'
import AppRoot from './components/AppRoot'

window.EventBus = new Vue()
window.axios = axios.create()

Vue.use(Vuetify, {
    iconfont: 'md',
    // override colors
    theme: {
        primary: "#512DA8",
        accent: "#FF4081",
        orange: "#FF5722"
    }
});

// custom number input component
Vue.component('VInputNumber', VInputNumber)

// vue-qrcode
Vue.component(VueQrcode.name, VueQrcode);

Vue.use(VueProgressBar, {
    color: '#FF9800',
    failedColor: 'red',
    thickness: '3px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    }
})

// vue sweet-alert
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

// Prototypes =================================

Vue.prototype.$user = User

Vue.prototype.$rupiahFormat = function(value) {
    value = parseFloat(value)
    const absValueLocale = Math.abs(value).toLocaleString(
        "de-DE", { minimumFractionDigits: 2 }
    );
    return `${value<0? '- ' : ''} Rp ${absValueLocale}`;
}

Vue.prototype.$getDateString = function(dateString) {
    const days = [
        "Senin","Selasa","Rabu",
        "Kamis","Jumat","Sabtu","Minggu"
    ];

    const months = [
        "Jan","Feb","Mar",
        "Apr","Mei","Jun",
        "Jul","Ags","Sep",
        "Okt","Nov","Des"
    ];
    let date = new Date(Date.parse(dateString));
    return `${days[date.getDay()-1]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

Vue.prototype.$getTimeString = function(dateString) {
    let date = new Date(Date.parse(dateString));
    return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
}

// ============================================

Vue.config.productionTip = false

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