<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const worksheetId = route.params.id as string

const name = ref('')
const submitted = ref(false)
const score = ref<number | null>(null)
const selectedAnswers = ref<(string | null)[]>(Array(12).fill(null))

// Dummy questions (replace with backend data later)
const questions = [
  { question: 'Round 47 to the nearest 10.', options: ['A. 40', 'B. 50', 'C. 60', 'D. 70'], answer: 'B' },
  { question: 'Round 84 to the nearest 10.', options: ['A. 80', 'B. 90', 'C. 70', 'D. 85'], answer: 'A' },
  { question: 'Round 122 to the nearest 10.', options: ['A. 120', 'B. 130', 'C. 100', 'D. 110'], answer: 'A' },
  { question: 'Round 69 to the nearest 10.', options: ['A. 60', 'B. 70', 'C. 80', 'D. 90'], answer: 'B' },
  { question: 'Round 95 to the nearest 10.', options: ['A. 90', 'B. 100', 'C. 95', 'D. 105'], answer: 'B' },
  { question: 'Round 135 to the nearest 10.', options: ['A. 130', 'B. 140', 'C. 150', 'D. 160'], answer: 'B' },
  { question: 'Round 222 to the nearest 10.', options: ['A. 220', 'B. 200', 'C. 230', 'D. 210'], answer: 'A' },
  { question: 'Round 317 to the nearest 10.', options: ['A. 320', 'B. 300', 'C. 310', 'D. 330'], answer: 'C' },
  { question: 'Round 404 to the nearest 10.', options: ['A. 410', 'B. 400', 'C. 420', 'D. 390'], answer: 'B' },
  { question: 'Round 589 to the nearest 10.', options: ['A. 590', 'B. 580', 'C. 600', 'D. 570'], answer: 'A' },
  { question: 'Round 624 to the nearest 10.', options: ['A. 620', 'B. 630', 'C. 600', 'D. 640'], answer: 'A' },
  { question: 'Round 755 to the nearest 10.', options: ['A. 750', 'B. 760', 'C. 770', 'D. 740'], answer: 'B' }
]

const reset = () => {
  selectedAnswers.value = Array(12).fill(null)
  name.value = ''
  submitted.value = false
  score.value = null
}

const submit = async () => {
  if (!name.value.trim()) {
    alert('Please enter your name')
    return
  }

  let correct = 0
  selectedAnswers.value.forEach((ans, index) => {
    if (ans === questions[index].answer) correct++
  })

  score.value = correct
  submitted.value = true

  try {
    await axios.post('/api/submit-score', {
      name: name.value,
      worksheetId,
      score: correct
    })
  } catch (err) {
    console.error('Failed to submit score', err)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Worksheet: {{ worksheetId }}</h1>

    <div class="mb-4">
      <label for="name" class="block font-semibold mb-1">Your Name:</label>
      <input id="name" v-model="name" class="border px-2 py-1 w-full rounded" placeholder="Enter your name" />
    </div>

    <div v-for="(q, i) in questions" :key="i" class="mb-4">
      <p class="font-medium">{{ i + 1 }}. {{ q.question }}</p>
      <div class="ml-4">
        <label v-for="(opt, j) in q.options" :key="j" class="block">
          <input
            type="radio"
            :name="`q${i}`"
            :value="opt[0]"
            v-model="selectedAnswers[i]"
            class="mr-2"
          />
          {{ opt }}
        </label>
      </div>
    </div>

    <div class="mt-6 flex gap-4">
      <button @click="submit" class="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      <button @click="reset" class="bg-gray-400 text-white px-4 py-2 rounded">Reset</button>
    </div>

    <div v-if="submitted" class="mt-6">
      <p class="text-lg font-bold">Score: {{ score }} / 12</p>
    </div>
  </div>
</template>

<style scoped>
input[type="radio"]:checked + span {
  font-weight: bold;
}
</style>
