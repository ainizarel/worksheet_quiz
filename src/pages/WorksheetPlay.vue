<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { submitScore } from '@/lib/api'
import supabase from '@/lib/supabase'

const route = useRoute()
const worksheetId = route.params.id as string

const name = ref('')
const submitted = ref(false)
const score = ref<number | null>(null)
const selectedAnswers = ref<(string | null)[]>([])
const questions = ref<any[]>([])
const copyright = ref<string | null>(null)
const loading = ref(true)

const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('worksheets')
    .select('questions, copyright')
    .eq('worksheet_id', worksheetId)
    .single()

  if (error || !data) {
    alert('Worksheet not found')
    console.error(error)
    return
  }

  questions.value = data.questions
  selectedAnswers.value = Array(data.questions.length).fill(null)
  copyright.value = data.copyright || null
  loading.value = false
}

const reset = () => {
  selectedAnswers.value = Array(questions.value.length).fill(null)
  name.value = ''
  submitted.value = false
  score.value = null
}

const submit = async () => {
  if (!name.value.trim()) {
    alert('Please enter your name')
    return
  }

  const correct = selectedAnswers.value.reduce((count, ans, idx) => {
    return count + (ans === questions.value[idx].answer ? 1 : 0)
  }, 0)

  score.value = correct
  submitted.value = true

  try {
    await submitScore({
      name: name.value,
      worksheetId,
      score: correct
    })
  } catch (err: any) {
    console.error('Submit failed:', err.message)
    alert('Submission failed: ' + err.message)
  }
}

onMounted(fetchQuestions)
</script>


<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Worksheet: {{ worksheetId }}</h1>

    <div v-if="loading">Loading questions...</div>
    <div v-else>
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
        <p class="text-lg font-bold">Score: {{ score }} / {{ questions.length }}</p>
      </div>

    <div v-if="copyright" class="mt-2 text-sm text-gray-500">
    © {{ copyright }}
    </div>

    </div>
  </div>
</template>

