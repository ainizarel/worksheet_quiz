<template>
  <div class="leaderboard-container">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">Back</button>  

    <!-- Title -->
    <h1 class="leaderboard-title">Leaderboard</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading">Loading leaderboard...</div>
    
    <!-- Table Display -->
    <div v-else>
      <div class="leaderboard-card">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(entry, index) in leaderboard" 
              :key="entry.studentId" 
              :class="{
                'top-rank': index === 0, 
                'second-rank': index === 1, 
                'third-rank': index === 2
              }"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ entry.name }}</td>
              <td>{{ entry.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // Import useRouter to handle navigation
import { fetchLeaderboardData } from '@/lib/api';

const leaderboard = ref<any[]>([]); // To store leaderboard data
const loading = ref(true); // To handle loading state
const worksheetId = 'rounding-01'; // Set your specific worksheet ID here

const router = useRouter();  // Initialize the router

// Function to handle the back navigation
const goBack = () => {
  router.back();  // Go back to the previous page
};

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
/* Overall styling for the leaderboard container */
.leaderboard-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fafb;  /* Light gray background */
}

/* Back button styles */
.back-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #2563eb;
}

/* Title styles */
.leaderboard-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Table and card styling */
.leaderboard-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  margin-top: 20px;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

th, td {
  padding: 12px 20px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #333;
}

td {
  color: #555;
}

/* Row highlighting for the top ranks */
.top-rank {
  background-color: #f1faee;  /* Light green for 1st place */
  font-weight: bold;
}

.second-rank {
  background-color: #fefae0;  /* Light yellow for 2nd place */
}

.third-rank {
  background-color: #e0f7fa;  /* Light cyan for 3rd place */
}

/* Loading state styling */
.loading {
  text-align: center;
  font-size: 18px;
  color: #999;
}
</style>
