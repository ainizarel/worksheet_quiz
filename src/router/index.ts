import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import WorksheetPlay from '../pages/WorksheetPlay.vue'
import LeaderboardTop from '../pages/LeaderboardTop.vue' // Import Leaderboard component

const routes = [
  { path: '/', component: Home }, // Home page route
  { path: '/worksheet/:id/play', component: WorksheetPlay }, // WorksheetPlay route
  { path: '/leaderboard', component: LeaderboardTop }, // Leaderboard route
]

export default createRouter({
  history: createWebHistory(),
  routes
})
