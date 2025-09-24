import { useEffect, useRef, useState } from 'react'
import { submitReport } from '../api/reports'
import { transcribeAudio } from '../api/speech'

export default function ReportForm() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [form, setForm] = useState({
    event_type: 'Flood',
    description: '',
    latitude: '',
    longitude: '',
    location_name: ''
  })
  const [media, setMedia] = useState(null)
  const [status, setStatus] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [sttLang, setSttLang] = useState('en-IN')
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
    } else {
      const rec = new SpeechRecognition()
      rec.lang = sttLang
      rec.interimResults = true
      rec.continuous = true

      rec.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) finalTranscript += transcript + ' '
        }
        if (finalTranscript) {
          const combined = (form.description + ' ' + finalTranscript).trim()
          setForm(f => ({ ...f, description: combined }))
        }
      }

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e)
        setStatus('Speech recognition error. Try again.')
        setIsListening(false)
      }

      rec.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = rec
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.")
      setStatus("Geolocation not supported.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log("Fetched position:", pos.coords.latitude, pos.coords.longitude)
        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        }))
      },
      err => {
        console.error("Error getting location:", err)
        setStatus("Could not fetch your location. Please allow location access.")
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sttLang
    }
  }, [sttLang])

  function startListening() {
    if (!speechSupported) return
    try {
      recognitionRef.current && recognitionRef.current.start()
      setIsListening(true)
      setStatus('Listening...')
    } catch (e) {
      console.warn('Could not start recognition', e)
    }
  }

  function stopListening() {
    if (!speechSupported) return
    try {
      recognitionRef.current && recognitionRef.current.stop()
      setIsListening(false)
      setStatus(null)
    } catch (e) {
      console.warn('Could not stop recognition', e)
    }
  }

  function toggleListening() {
    if (isListening) stopListening()
    else startListening()
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      recordedChunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
        setStatus('Transcribing...')
        try {
          const { text } = await transcribeAudio(blob, sttLang)
          setForm(f => ({ ...f, description: (f.description + ' ' + (text || '')).trim() }))
          setStatus('Transcribed')
        } catch (err) {
          console.error(err)
          setStatus('Transcription failed')
        }
      }
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setStatus('Recording...')
    } catch (e) {
      console.error('Mic error', e)
      setStatus('Microphone access denied')
    }
  }

  function stopRecording() {
    try {
      mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive' && mediaRecorderRef.current.stop()
      mediaRecorderRef.current?.stream?.getTracks()?.forEach(t => t.stop())
    } catch (e) {
      console.warn('Stop recording error', e)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('Submitting...')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (media) fd.append('media', media)

    const res = await submitReport(fd, token)
    if (res && res.id) setStatus('Report submitted!')
    else setStatus('Failed to submit.')
  }

  if (!user) return <p className="card">Please login to submit a report.</p>

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-xl font-semibold mb-2">Submit a Hazard Report</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        {/* Event type */}
        <select
          className="w-full border rounded-2xl p-2"
          value={form.event_type}
          onChange={e => setForm({ ...form, event_type: e.target.value })}
        >
          <option>Flood</option>
          <option>Tsunami</option>
          <option>High Waves</option>
          <option>Swell Surge</option>
          <option>Coastal Damage</option>
        </select>

        {/* Description */}
        <textarea
          className="w-full border rounded-2xl p-2"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* Speech to Text Controls */}
        <div className="flex items-center gap-2">
          <select
            className="border rounded-2xl p-2"
            value={sttLang}
            onChange={(e) => setSttLang(e.target.value)}
            title="Speech recognition language"
          >
            <option value="en-IN">English (India)</option>
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi (India)</option>
            <option value="ta-IN">Tamil (India)</option>
            <option value="te-IN">Telugu (India)</option>
            <option value="bn-IN">Bengali (India)</option>
            <option value="mr-IN">Marathi (India)</option>
            <option value="kn-IN">Kannada (India)</option>
            <option value="ml-IN">Malayalam (India)</option>
          </select>

          <button
            type="button"
            className={`btn ${isListening ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'}`}
            onClick={toggleListening}
            disabled={!speechSupported}
            title={speechSupported ? 'Use your voice to fill description' : 'Speech recognition not supported'}
          >
            {isListening ? 'Stop Voice Input' : 'Speak to Fill'}
          </button>
        </div>

        {/* Audio Record and Server Transcription */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn"
            onClick={startRecording}
          >
            Start Recording (Server STT)
          </button>
          <button
            type="button"
            className="btn"
            onClick={stopRecording}
          >
            Stop & Transcribe
          </button>
        </div>

        {/* Auto-filled latitude & longitude */}
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border rounded-2xl p-2 bg-gray-100"
            placeholder="Latitude"
            value={form.latitude || ''}
            readOnly
          />
          <input
            className="border rounded-2xl p-2 bg-gray-100"
            placeholder="Longitude"
            value={form.longitude || ''}
            readOnly
          />
        </div>

        {/* Optional location name */}
        <input
          className="w-full border rounded-2xl p-2"
          placeholder="Location (optional)"
          value={form.location_name}
          onChange={e => setForm({ ...form, location_name: e.target.value })}
        />

        {/* Media */}
        <input
          className="w-full border rounded-2xl p-2"
          type="file"
          accept="image/*,video/*"
          onChange={e => setMedia(e.target.files[0])}
        />

        {/* Submit */}
        <button className="btn btn-primary">Submit Report</button>
      </form>

      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  )
}
