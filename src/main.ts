// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css';  // Import the theme
import 'primevue/resources/primevue.min.css';                 // Import PrimeVue core styles
import 'primeicons/primeicons.css';                           // Import Icons                           // ✅ Icons
import 'primeflex/primeflex.css'                             // ✅ Utility CSS
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import 'font-awesome/css/font-awesome.min.css';




const app = createApp(App);

app.use(ToastService);
app.component('Toast', Toast);
app.use(router)
app.use(PrimeVue)

app.mount('#app')
