// src/lib/api.ts
const baseURL = import.meta.env.DEV
  ? ''
  : 'https://worksheet-app.vercel.app';

export async function submitScore(payload: {
  name: string;
  worksheetId: string;
  score: number;
}) {
  const response = await fetch(`${baseURL}/api/submit-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error?.error || 'Unknown error');
    } catch {
      throw new Error('Unexpected error');
    }
  }

  try {
    return await response.json();
  } catch {
    return { success: true }; // fallback if backend doesn't return body
  }
}
