<!-- src/pages/Leaderboard.vue -->
<template>
  <div class="leaderboard-container">
    <h1>Leaderboard</h1>
    
    <div v-if="loading" class="loading">Loading leaderboard...</div>
    
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in leaderboard" :key="entry.studentId">
            <td>{{ index + 1 }}</td>
            <td>{{ entry.name }}</td>
            <td>{{ entry.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchLeaderboardData } from '@/lib/api';

const leaderboard = ref<any[]>([]); // To store leaderboard data
const loading = ref(true); // To handle loading state
const worksheetId = 'rounding-01'; // Set your specific worksheet ID here

onMounted(async () => {
  try {
    const data = await fetchLeaderboardData(worksheetId); // Fetch leaderboard with worksheetId
    leaderboard.value = data; // Store the data in the leaderboard
    loading.value = false; // Set loading to false when data is loaded
  } catch (err) {
    console.error('Error fetching leaderboard data:', err);
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
