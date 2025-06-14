// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css' // ✅ Theme
import 'primevue/resources/primevue.min.css'                 // ✅ Core styles
import 'primeicons/primeicons.css'                           // ✅ Icons
import 'primeflex/primeflex.css'                             // ✅ Utility CSS

const app = createApp(App)
app.use(router)
app.use(PrimeVue)

app.mount('#app')
