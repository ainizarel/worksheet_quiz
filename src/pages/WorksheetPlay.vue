<template>
  <div class="container">
    <h1 class="title">Worksheet: {{ worksheetId }}</h1>

    <div v-if="loading" class="loading">Loading questions...</div>
    <div v-else>
      <!-- Student ID Input -->
      <div class="input-container">
        <label for="studentId" class="label">ID:</label>
        <input
          id="studentId"
          v-model="studentId"
          class="input"
          placeholder="Enter your student ID"
        />
      </div>

      <!-- Name Input -->
      <div class="input-container">
        <label for="name" class="label">Your Name:</label>
        <input
          id="name"
          v-model="name"
          class="input"
          placeholder="Enter your name"
        />
      </div>

      <!-- Questions and Options -->
      <div v-for="(q, i) in questions" :key="i" class="question-container">
        <p class="question">{{ i + 1 }}. {{ q.question }}</p>
        <div class="options-container">
          <div
            v-for="(opt, j) in q.options"
            :key="j"
            class="option"
            :class="{
              'option-selected': selectedAnswers[i] === opt[0], 
              'option-correct': submitted && selectedAnswers[i] === q.answer && selectedAnswers[i] !== null, 
              'option-wrong': submitted && selectedAnswers[i] !== q.answer && selectedAnswers[i] !== null,
              'option-real-correct': submitted && opt[0] === q.answer && selectedAnswers[i] !== q.answer && selectedAnswers[i] !== null // Only highlight real correct answer when user chooses the wrong one
            }"
            @click="selectedAnswers[i] = opt[0]"
          >
            <input
              type="radio"
              :name="`q${i}`"
              :value="opt[0]"
              v-model="selectedAnswers[i]"
              class="radio-button"
              :disabled="submitted"
              hidden
            />
            <span :class="{
              'selected-option': selectedAnswers[i] === opt[0],
              'hover-option': !selectedAnswers[i] && !submitted
            }">
              {{ opt }}
            </span>

            <!-- Icon for correct answer (only shown if answer is wrong and the option is correct) -->
            <span v-if="submitted && opt[0] === q.answer && selectedAnswers[i] !== q.answer" class="correct-icon">
              ✔️
            </span>
          </div>
        </div>
      </div>



      <!-- Submit and Reset Buttons -->
      <div v-if="!submitted" class="button-container">
        <button @click="submit" class="submit-btn">Submit</button>
        <button @click="reset" class="reset-btn">Reset</button>
      </div>

      <!-- View Leaderboard Button (only shows after submit) -->
      <div v-if="submitted" class="button-container">
        <button @click="viewLeaderboard" class="view-leaderboard-btn">View Leaderboard</button>
      </div>

      <!-- Score Display -->
      <div v-if="submitted" class="score-display">
        <p class="score">Score: {{ score }} / {{ questions.length }}</p>
      </div>

      <!-- Copyright Section -->
      <div v-if="copyright" class="copyright">
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
import { useRouter } from 'vue-router'

const router = useRouter()  // Initialize the router

const toast = useToast()

const route = useRoute()
const worksheetId = route.params.id as string

const name = ref('')
const studentId = ref('')
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
    })
    return
  }

  const unanswered = selectedAnswers.value
    .map((ans, idx) => (ans === null ? idx + 1 : null))
    .filter((idx) => idx !== null)

  if (unanswered.length > 0) {
    toast.add({
      severity: 'warn',
      summary: 'Incomplete Answers',
      detail: `Please answer all questions. Unanswered: ${unanswered.join(', ')}`,
      life: 5000,
    })
    return
  }

  const correct = selectedAnswers.value.reduce((count, ans, idx) => {
    return count + (ans === questions.value[idx].answer ? 1 : 0)
  }, 0)

  try {
    await submitScore({
      name: name.value,
      worksheetId,
      score: correct,
      studentId: studentId.value,
    })

    submitted.value = true
    score.value = correct

    toast.add({
      severity: 'success',
      summary: 'Submitted',
      detail: `You scored ${correct} / ${questions.value.length}`,
      life: 4000,
    })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: err.message || 'Unexpected error occurred',
      life: 5000,
    })
    console.error('Submit failed:', err.message)
  }
}

// Function to navigate to leaderboard page
const viewLeaderboard = () => {
  toast.add({
    severity: 'info',
    summary: 'Leaderboard',
    detail: 'Navigating to Leaderboard...',
    life: 3000,
  });

  const url = '/leaderboard';  // The URL to navigate to the leaderboard

  // Open the leaderboard in a new tab with specified dimensions
  window.open(url, '_blank', 'width=800,height=600');  // Adjust width and height as needed
};


onMounted(fetchQuestions)
</script>

<style scoped>
/* Container styles */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

/* Title style */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Loading text style */
.loading {
  font-size: 18px;
  color: gray;
}

/* Input fields */
.input-container {
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

/* Question styles */
.question-container {
  margin-bottom: 30px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.question {
  font-size: 18px;
  font-weight: 600;
}

.options-container {
  margin-top: 10px;
}

.option {
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Hidden radio button */
.radio-button {
  visibility: hidden;
  position: absolute;
}

/* Hover effect */
.option:hover {
  background-color: #f0f0f0; /* Light hover effect */
}

/* Correct answer styles */
.option-correct {
  background-color: #38a169; /* Green for correct answers */
  color: white;
  font-weight: bold;
}

/* Wrong answer styles */
.option-wrong {
  background-color: #e53e3e; /* Red for incorrect answers */
  color: white;
  font-weight: bold;
}

/* Real correct option styles (the actual correct answer) */
.option-real-correct {
  background-color: #38a169; /* Green for the real correct answer */
  color: white;
  font-weight: bold;
}

.correct-icon {
  margin-left: 8px;
  color: green;
}

/* Selected option background */
.option-selected {
  background-color: #e2e8f0; /* Selected option gray color */
}

.selected-option {
  font-weight: bold;
  color: green; /* Color for selected option */
}

/* Button styles */
.button-container {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.submit-btn, .reset-btn, .view-leaderboard-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn {
  background-color:rgb(56, 135, 161);
  color: white;
}

.submit-btn:hover {
  background-color:rgb(109, 193, 211);
}

.reset-btn {
  background-color: #4a5568;
  color: white;
}

.reset-btn:hover {
  background-color:rgb(56, 64, 79);
}

.view-leaderboard-btn {
  background-color: #3182ce;
  color: white;
}

.view-leaderboard-btn:hover {
  background-color: #2563eb;
}

/* Score and copyright styles */
.score-display {
  margin-top: 20px;
  font-size: 18px;
}

.score {
  font-size: 22px;
  font-weight: bold;
  color: green;
}

.copyright {
  margin-top: 10px;
  font-size: 14px;
  color: #aaa;
}
</style>
