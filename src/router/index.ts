import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import WorksheetPlay from '../pages/WorksheetPlay.vue'
import Leaderboard from '../pages/Leaderboard.vue' // Import Leaderboard component

const routes = [
  { path: '/', component: Home }, // Home page route
  { path: '/worksheet/:id/play', component: WorksheetPlay }, // WorksheetPlay route
  { path: '/leaderboard', component: Leaderboard }, // Leaderboard route
]

export default createRouter({
  history: createWebHistory(),
  routes
})
