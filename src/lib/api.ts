// src/lib/api.ts
const baseURL = import.meta.env.DEV
  ? ''
  : 'https://worksheet-app.vercel.app';

  export async function submitScore(payload: {
    name: string;
    worksheetId: string;
    score: number;
    studentId: string;
  }) {
    const response = await fetch(`${baseURL}/api/submit-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  
    let responseBody;
  
    try {
      responseBody = await response.json();
    } catch (err) {
      throw new Error('⚠️ Server error: Invalid response from server.');
    }
  
    if (!response.ok) {
      throw new Error(responseBody?.error || '⚠️ Unknown submission error.');
    }
  
    return responseBody;
  }
  
