'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceCommands, setVoiceCommands] = useState<string[]>([])
  const { speak, settings } = useAccessibility()
  const recognitionRef = useRef<any>(null)

  const commands = [
    { command: 'Go to dashboard', description: 'Navigate to main dashboard' },
    { command: 'Open learning hub', description: 'Access learning resources' },
    { command: 'Show job portal', description: 'View job opportunities' },
    { command: 'Emergency help', description: 'Access emergency services' },
    { command: 'Activate deaf mode', description: 'Enable deaf mode features' },
    { command: 'Read page content', description: 'Read current page aloud' },
    { command: 'Scroll to top', description: 'Scroll to page top' },
    { command: 'Scroll to bottom', description: 'Scroll to page bottom' }
  ]

  useEffect(() => {
    speak('Voice Assistant page loaded. You can use voice commands to navigate the website.')
  }, [speak])

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      setVoiceCommands(prev => [result, ...prev.slice(0, 9)])
      speak(`You said: ${result}`)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      speak('Speech recognition error. Please try again.')
    }

    recognitionRef.current = recognition

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [speak])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const testCommand = (command: string) => {
    speak(`Testing command: ${command}`)
    setTranscript(command)
    setVoiceCommands(prev => [command, ...prev.slice(0, 9)])
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
            🎙️ Voice Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Control the website using your voice commands
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Voice Control Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">🎤 Voice Control</h2>
            
            <div className="text-center mb-6">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-32 h-32 rounded-full text-white text-4xl shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? '🛑' : '🎤'}
              </button>
              <p className="mt-4 text-lg font-medium">
                {isListening ? 'Listening...' : 'Click to start voice input'}
              </p>
            </div>

            {transcript && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">Last Command:</h3>
                <p className="text-blue-800">{transcript}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => speak('Voice navigation is now active. You can use voice commands to navigate the website.')}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
              >
                🔊 Test Voice Output
              </button>
              
              <button
                onClick={() => setVoiceCommands([])}
                className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                🗑️ Clear History
              </button>
            </div>
          </div>

          {/* Available Commands */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">📋 Available Commands</h2>
            
            <div className="space-y-3 mb-6">
              {commands.map((cmd, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-primary-600">"{cmd.command}"</p>
                      <p className="text-sm text-gray-600">{cmd.description}</p>
                    </div>
                    <button
                      onClick={() => testCommand(cmd.command)}
                      className="ml-4 bg-primary-100 text-primary-600 px-3 py-1 rounded text-sm hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
                      title="Test this command"
                    >
                      Test
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Tips:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Speak clearly and at normal pace</li>
                <li>• Use natural language commands</li>
                <li>• Wait for the beep before speaking</li>
                <li>• Commands work in multiple languages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Command History */}
        {voiceCommands.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">📝 Recent Voice Commands</h2>
            <div className="space-y-2">
              {voiceCommands.map((command, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    index === 0 ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <span className="text-sm text-gray-500">#{voiceCommands.length - index}: </span>
                  <span className="font-medium">{command}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">⚙️ Voice Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Current Settings:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Voice Navigation:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    settings.voiceNavigation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {settings.voiceNavigation ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Speech Recognition:</span>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? 'Supported' : 'Not Supported'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Text-to-Speech:</span>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    {'speechSynthesis' in window ? 'Supported' : 'Not Supported'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Supported Languages:</h3>
              <div className="space-y-1 text-sm">
                <div>🇺🇸 English</div>
                <div>🇮🇳 हिंदी (Hindi)</div>
                <div>🇮🇳 मराठी (Marathi)</div>
                <div>🇮🇳 தமிழ் (Tamil)</div>
                <div>🇮🇳 राजस्थानी (Rajasthani)</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}