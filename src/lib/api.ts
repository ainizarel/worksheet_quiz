// src/lib/api.ts
import supabase from './supabase'; // Ensure you have a supabase instance exported here

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

export async function fetchLeaderboardData(worksheetId: string) {
  const { data, error } = await supabase
    .from('scores')  // Ensure you're targeting the correct table
    .select('name, score')
    .eq('worksheet_id', worksheetId)  // Filter by the specific worksheet
    .order('score', { ascending: false });  // Sort scores in descending order
  
  if (error) {
    throw new Error('Error fetching leaderboard data');
  }

  return data;
}
