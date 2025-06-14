<template>
  <div class="relative min-h-screen bg-white overflow-hidden">
    <!-- Background SVG -->
    <img
      src="@/assets/logo.svg"
      alt="Background Logo"
      class="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
    />

    <!-- Cards on top of SVG -->
    <div class="relative z-10 flex flex-wrap justify-center items-center gap-6 p-6">
      <Card
        v-for="worksheet in worksheets"
        :key="worksheet.worksheet_id"
        class="card"
        @mouseover="hovered = worksheet.worksheet_id"
        @mouseleave="hovered = null"
        @click="goToWorksheet(worksheet.worksheet_id)"
      >
        <template #title>
          <span class="text-lg font-bold text-gray-800">
            <!-- Dynamically change the icon based on hover -->
            <img 
              :src="hovered === worksheet.worksheet_id ? IconFileHover : IconFile" 
              alt="file icon" 
              class="mr-2" 
              style="width: 230px; height: 100px;" 
            />
            {{ worksheet.title }}
          </span>
        </template>

        <template #content>
          <small class="text-gray-300">
            <i class="fa fa-user mr-2"></i>
            Created by: <br> 
            <b>{{ worksheet.created_by }}</b>
            <br />
          </small>
          <br />
          
          <small class="text-gray-300">
            <i class="fa fa-calendar mr-2"></i>
            Created at: <br> 
            <b>{{ formatDate(worksheet.created_at) }}</b>
          </small>
          <br />
          <br />

          <small class="coral-grey" v-if="worksheet.copyright">
            <i class="fa fa-copyright mr-2"></i>
            {{ worksheet.copyright }}
          </small>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import supabase from '@/lib/supabase'

// Import the SVG icons
import IconFile from '@/assets/thinking.svg'
import IconFileHover from '@/assets/question.svg'  // The icon to show on hover

const router = useRouter()
const worksheets = ref<any[]>([])
const hovered = ref<string | null>(null)  // Track which worksheet is being hovered

// Function to format the created_at date (optional)
function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  const formattedDate = new Date(date).toLocaleDateString(undefined, options)
  return formattedDate
}

onMounted(async () => {
  const { data, error } = await supabase.from('worksheets').select()
  if (error) {
    console.error('Error fetching worksheets:', error)
    return
  }
  worksheets.value = data
})

function goToWorksheet(id: string) {
  router.push(`/worksheet/${id}/play`)
}
</script>

<style scoped>
/* Basic styling for the card */
.card {
  cursor: pointer;
  width: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  background-color: #f4ee8a61;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

/* Hover effect applied when the card is hovered */
.card:hover {
  transform: scale(1.05);
  background-color: rgba(244, 238, 138, 0.75); /* Adjust background on hover */
}

/* Coral grey color */
.coral-grey {
  color:rgb(17, 79, 112); /* Coral grey color */
}
</style>
