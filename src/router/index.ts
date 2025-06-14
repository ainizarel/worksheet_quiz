import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import WorksheetPlay from '../pages/WorksheetPlay.vue'
import LeaderBoard from '../pages/Leaderboard.vue' // Import Leaderboard component

const routes = [
  { path: '/', component: Home }, // Home page route
  { path: '/worksheet/:id/play', component: WorksheetPlay }, // WorksheetPlay route
  { path: '/leaderboard', component: LeaderBoard }, // Leaderboard route
]

export default createRouter({
  history: createWebHistory(),
  routes
})
