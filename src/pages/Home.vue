<!-- src/pages/Home.vue -->
<template>
  <div class="p-d-flex p-jc-center p-ai-center flex-wrap gap-4 p-4" style="min-height: 100vh">
    <Card
      v-for="worksheet in worksheets"
      :key="worksheet.worksheet_id"
      class="p-shadow-4"
      style="cursor: pointer; width: 300px"
      @click="goToWorksheet(worksheet.worksheet_id)"
    >
      <template #title>{{ worksheet.title }}</template>
      <template #content>
        <p>Click here to answer {{ worksheet.title }} questions.</p>
        <small v-if="worksheet.copyright">© {{ worksheet.copyright }}</small>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const worksheets = ref<any[]>([])

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
