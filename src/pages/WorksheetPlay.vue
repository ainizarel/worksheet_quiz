<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Worksheet: {{ worksheetId }}</h1>

    <div v-if="loading">Loading questions...</div>
    <div v-else>

      <!-- Student ID Input -->
      <div class="mb-4">
        <label for="studentId" class="block font-semibold mb-1">Student ID:</label>
        <input
          id="studentId"
          v-model="studentId"
          class="border px-3 py-2 w-full rounded-lg"
          placeholder="Enter your student ID"
        />
      </div>

      <!-- Name Input -->
      <div class="mb-4">
        <label for="name" class="block font-semibold mb-1">Your Name:</label>
        <input 
          id="name" 
          v-model="name" 
          class="border px-3 py-2 w-full rounded-lg" 
          placeholder="Enter your name" 
        />
      </div>

      <!-- Questions and Options without Card -->
      <div v-for="(q, i) in questions" :key="i" class="mb-6">
        <!-- Container for each question -->
        <div class="question-container p-4 mb-4 border rounded-lg">
          <p class="font-medium text-lg">{{ i + 1 }}. {{ q.question }}</p>

          <!-- Options -->
          <div class="ml-4">
            <label
              v-for="(opt, j) in q.options"
              :key="j"
              class="block text-base mt-2"
              :class="{
                'text-green-600 font-semibold': submitted && opt[0] === q.answer,
                'text-red-500': submitted && selectedAnswers[i] === opt[0] && opt[0] !== q.answer
              }"
            >
              <input
                type="radio"
                :name="`q${i}`"
                :value="opt[0]"
                v-model="selectedAnswers[i]"
                class="mr-2"
                :disabled="submitted"
              />
              <span :class="{
                'text-green-600': submitted && opt[0] === q.answer,
                'text-red-500': submitted && selectedAnswers[i] === opt[0] && opt[0] !== q.answer
              }">
                {{ opt }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Submit and Reset Buttons -->
      <div v-if="!submitted" class="mt-6 flex gap-4">
        <button 
          @click="submit" 
          class="submit-btn"
        >
          Submit
        </button>
        <button 
          @click="reset" 
          class="reset-btn"
        >
          Reset
        </button>
      </div>

      <!-- Score Display -->
      <div v-if="submitted" class="mt-6">
        <p class="text-lg font-bold">Score: <span class="text-green-600">{{ score }} / {{ questions.length }}</span></p>
      </div>

      <!-- Copyright Section -->
      <div v-if="copyright" class="mt-4 text-sm text-gray-500">
        © {{ copyright }}
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { submitScore } from '@/lib/api'
import supabase from '@/lib/supabase'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const route = useRoute()
const worksheetId = route.params.id as string

const name = ref('')
const studentId = ref('');
const submitted = ref(false)
const score = ref<number | null>(null)
const selectedAnswers = ref<(string | null)[]>([])
const questions = ref<any[]>([])
const copyright = ref<string | null>(null)
const loading = ref(true)

const authorizedStudentIds = ref<string[]>([])

const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('worksheets')
    .select('questions, copyright, authorized_students')
    .eq('worksheet_id', worksheetId)
    .single()

  if (error || !data) {
    alert('Worksheet not found')
    console.error(error)
    return
  }

  questions.value = data.questions
  authorizedStudentIds.value = data.authorized_students || []
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
    toast.add({
      severity: 'warn',
      summary: 'Missing Name',
      detail: 'Please enter your name',
      life: 3000,
    });
    return;
  }

  const unanswered = selectedAnswers.value
    .map((ans, idx) => (ans === null ? idx + 1 : null))
    .filter(idx => idx !== null);

  if (unanswered.length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Incomplete Answers',
      detail: `Please answer all questions. Unanswered: ${unanswered.join(', ')}`,
      life: 5000,
    });
    return;
  }

  const correct = selectedAnswers.value.reduce((count, ans, idx) => {
    return count + (ans === questions.value[idx].answer ? 1 : 0);
  }, 0);

  try {
    await submitScore({
      name: name.value,
      worksheetId,
      score: correct,
      studentId: studentId.value,
    });

    submitted.value = true;
    score.value = correct;

    toast.add({
      severity: 'success',
      summary: 'Submitted',
      detail: `You scored ${correct} / ${questions.value.length}`,
      life: 4000,
    });

  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: err.message || 'Unexpected error occurred',
      life: 5000,
    });
    console.error('Submit failed:', err.message);
  }
};

onMounted(fetchQuestions)
</script>

<style scoped>
/* Styling for question container (previously Card) */
.question-container {
  cursor: pointer;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  background-color: #f4ee8a61;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

/* Hover effect applied when the question container is hovered */
.question-container:hover {
  transform: scale(1.05);
  background-color: rgba(244, 238, 138, 0.75); /* Adjust background on hover */
}

/* Multiple choice answer styles */
input[type="radio"]:checked + label {
  font-weight: bold;
}

input[type="radio"]:checked + label span {
  color: green; /* Correct answer is green */
}

input[type="radio"]:not(:checked) + label span {
  color: red; /* Incorrect answers are red */
}

/* Radio button hover effect */
input[type="radio"]:hover + label span {
  text-decoration: underline;
}

/* Button styling */
.submit-btn, .reset-btn {
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  width: 140px;
  transition: background-color 0.3s ease;
}

.submit-btn {
  background-color: #38a169; /* Green background */
  color: white;
}

.submit-btn:hover {
  background-color: #2f855a; /* Slightly darker green on hover */
}

.reset-btn {
  background-color: #4a5568; /* Gray background */
  color: white;
}

.reset-btn:hover {
  background-color: #2d3748; /* Darker gray on hover */
}

/* Add focus effect for accessibility */
.submit-btn:focus, .reset-btn:focus {
  outline: 2px solid #cbd5e0;
  outline-offset: 2px;
}
</style>
