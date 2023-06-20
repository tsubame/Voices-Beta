import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
loadFonts()

createApp(App)
  .use(store)
  .use(router)
  .use(vuetify)
  .mount('#app')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX86qtCH4ypcXei3OEr7BIfdOE_JxLO7g",
  authDomain: "voices-fe84c.firebaseapp.com",
  databaseURL: "https://voices-fe84c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "voices-fe84c",
  storageBucket: "voices-fe84c.appspot.com",
  messagingSenderId: "1090005170150",
  appId: "1:1090005170150:web:3541504dedf6d31a068827",
  measurementId: "G-G7JFDDWETP"
};

// store
import store from './store'

// Initialize Firebase
import { initializeApp } from "firebase/app";
initializeApp(firebaseConfig);

