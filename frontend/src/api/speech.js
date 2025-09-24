import { API_BASE } from './client'

export async function transcribeAudio(blob, language) {
  const form = new FormData()
  form.append('audio', blob, 'recording.webm')
  if (language) form.append('language', language)

  const res = await fetch(API_BASE + '/api/speech/transcribe', {
    method: 'POST',
    body: form
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || 'Transcription failed')
  }
  return data
}


