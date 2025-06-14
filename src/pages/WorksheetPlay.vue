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
const loading = ref(true)

const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('worksheets')
    .select('questions')
    .eq('worksheet_id', worksheetId)
    .single()

  if (error || !data) {
    alert('Worksheet not found')
    console.error(error)
    return
  }

  questions.value = data.questions
  selectedAnswers.value = Array(data.questions.length).fill(null)
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
