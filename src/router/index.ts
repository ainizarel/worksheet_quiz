import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import WorksheetPlay from '../pages/WorksheetPlay.vue'
import Leaderboard from '../pages/Leaderboard.vue' // Import the leaderboard component

const routes = [
  { path: '/', component: Home },
  { path: '/worksheet/:id/play', component: WorksheetPlay },
  { path: '/leaderboard', component: Leaderboard }, // The leaderboard route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
