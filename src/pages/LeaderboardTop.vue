<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchLeaderboardData } from '@/lib/api'; // Import the function

const leaderboard = ref<any[]>([]); // To store leaderboard data
const loading = ref(true); // To handle loading state
const worksheetId = 'rounding-01'; // Set your specific worksheet ID here

// Fetch leaderboard data when the component mounts
onMounted(async () => {
  try {
    const data = await fetchLeaderboardData(worksheetId); // Fetch leaderboard
    leaderboard.value = data; // Store the data in the leaderboard
    loading.value = false; // Set loading to false when data is loaded
  } catch (err) {
    console.error('Error fetching leaderboard data:', err);
  }
});
</script>
