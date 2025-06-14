// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'; // Saga Blue theme // ✅ Theme
import 'primevue/resources/primevue.min.css'                 // ✅ Core styles
import 'primeicons/primeicons.css'                           // ✅ Icons
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
