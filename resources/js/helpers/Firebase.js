const firebaseConfig = {
    apiKey: "AIzaSyAp4z6fnPTQG4Ul7arD6K1rrUvlAjbejvk",
    authDomain: "pkwu-pl.firebaseapp.com",
    databaseURL: "https://pkwu-pl.firebaseio.com",
    projectId: "pkwu-pl",
    storageBucket: "pkwu-pl.appspot.com",
    messagingSenderId: "367258772960",
    appId: "1:367258772960:web:ec4e6c12a62f5a1bb87785",
    measurementId: "G-2F4SWJDQ3Z"
};

import Firebase from 'firebase/app'
import 'firebase/firestore'

const app = Firebase.initializeApp(firebaseConfig);

export const firestoreApp = app.firestore();