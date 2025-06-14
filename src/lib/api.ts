// src/lib/api.ts
const baseURL = import.meta.env.DEV
  ? '' // Local dev will call Vite’s dev server
  : 'https://worksheet-app.vercel.app' // Production base URL

export async function submitScore(payload: {
  name: string
  worksheetId: string
  score: number
}) {
  const response = await fetch(`${baseURL}/api/submit-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error || 'Unknown error')
  }

  return response.json()
}
