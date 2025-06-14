<!-- src/pages/Home.vue -->
<template>
  <div class="p-d-flex p-jc-center p-ai-center" style="height: 100vh">
    <Card class="p-shadow-4" @click="goToWorksheet" style="cursor: pointer; width: 300px">
      <template #title>🧮 Rounding-Off Worksheet</template>
      <template #content>
        <p>Click here to answer rounding-off questions.</p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'

const router = useRouter()
function goToWorksheet() {
  router.push('/worksheet/rounding-01/play')
}
</script>

