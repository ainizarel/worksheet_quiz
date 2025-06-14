import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import WorksheetPlay from '../pages/WorksheetPlay.vue'

const routes = [
  { path: '/', component: Home }, // 👈 Add this for home card page
  { path: '/worksheet/:id/play', component: WorksheetPlay }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
