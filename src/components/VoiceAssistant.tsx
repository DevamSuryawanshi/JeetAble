'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccessibility } from './AccessibilityProvider'

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const router = useRouter()
  const { settings, speak } = useAccessibility()

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      speak('Listening for voice command')
    }

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase()
      setTranscript(command)
      handleVoiceCommand(command)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      speak('Voice recognition error occurred')
    }

    const startListening = () => {
      if (!isListening) {
        recognition.start()
      }
    }

    const stopListening = () => {
      if (isListening) {
        recognition.stop()
      }
    }

    // Expose methods to component
    ;(window as any).voiceAssistant = { startListening, stopListening }

    return () => {
      recognition.stop()
    }
  }, [isListening])

  const handleVoiceCommand = (command: string) => {
    speak(`Command received: ${command}`)

    if (command.includes('home') || command.includes('homepage')) {
      router.push('/')
      speak('Navigating to homepage')
    } else if (command.includes('learning') || command.includes('learn')) {
      router.push('/learning')
      speak('Opening learning hub')
    } else if (command.includes('job') || command.includes('jobs')) {
      router.push('/jobs')
      speak('Opening job portal')
    } else if (command.includes('deaf') || command.includes('deaf mode')) {
      router.push('/deaf-mode')
      speak('Opening deaf mode')
    } else if (command.includes('help') || command.includes('emergency')) {
      router.push('/help')
      speak('Opening emergency help')
    } else if (command.includes('profile') || command.includes('dashboard')) {
      router.push('/dashboard')
      speak('Opening dashboard')
    } else {
      speak('Command not recognized. Try saying: home, learning hub, jobs, deaf mode, or help')
    }
  }

  const toggleListening = () => {
    if (isListening) {
      ;(window as any).voiceAssistant?.stopListening()
    } else {
      ;(window as any).voiceAssistant?.startListening()
    }
  }

  if (!settings.voiceNavigation) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-all focus:outline-none focus-visible ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-primary-500 hover:bg-primary-600'
        }`}
        aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
        title={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? '🛑' : '🎤'}
      </button>
      
      {transcript && (
        <div className="absolute bottom-20 right-0 bg-white p-3 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm text-gray-700">
            <strong>Heard:</strong> {transcript}
          </p>
        </div>
      )}
    </div>
  )
}