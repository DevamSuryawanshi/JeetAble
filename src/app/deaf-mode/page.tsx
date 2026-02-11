'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function DeafMode() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [notifications, setNotifications] = useState<string[]>([])
  const { speak } = useAccessibility()
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addNotification('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      addNotification('🎤 Speech recognition started')
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      addNotification('🛑 Speech recognition stopped')
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      addNotification(`❌ Error: ${event.error}`)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 4)])
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  const clearTranscript = () => {
    setTranscript('')
    addNotification('📝 Transcript cleared')
  }

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript)
    addNotification('📋 Transcript copied to clipboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8" role="main">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deaf Mode - Real-time Speech to Text
          </h1>
          <p className="text-xl text-gray-600">
            Convert speech to text in real-time with visual notifications
          </p>
        </div>

        {/* Visual Notifications */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔔 Visual Notifications</h2>
          <div className="bg-white rounded-lg shadow-md p-4 min-h-[120px]">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      index === 0 ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'
                    }`}
                  >
                    {notification}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Speech to Text Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">🎤 Speech Recognition</h2>
            <div className="text-center">
              <button
                onClick={toggleListening}
                className={`w-24 h-24 rounded-full text-white text-3xl shadow-lg transition-all focus:outline-none focus-visible ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                aria-label={isListening ? 'Stop speech recognition' : 'Start speech recognition'}
              >
                {isListening ? '🛑' : '🎤'}
              </button>
              <p className="mt-4 text-lg font-medium">
                {isListening ? 'Listening...' : 'Click to start listening'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">⚙️ Controls</h2>
            <div className="space-y-3">
              <button
                onClick={clearTranscript}
                className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus-visible transition-colors"
              >
                📝 Clear Transcript
              </button>
              <button
                onClick={copyTranscript}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus-visible transition-colors"
                disabled={!transcript}
              >
                📋 Copy Transcript
              </button>
            </div>
          </div>
        </div>

        {/* Live Transcript */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">📝 Live Transcript</h2>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {transcript ? (
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            ) : (
              <p className="text-gray-500 text-center py-20">
                Start speaking to see the transcript here...
              </p>
            )}
          </div>
        </div>

        {/* Sign Language Resources */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">🤟 Sign Language Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Basic Signs</h3>
              <p className="text-gray-600 mb-4">Learn essential sign language gestures</p>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Video: Basic ASL Signs</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Emergency Signs</h3>
              <p className="text-gray-600 mb-4">Important signs for emergency situations</p>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Video: Emergency ASL Signs</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}