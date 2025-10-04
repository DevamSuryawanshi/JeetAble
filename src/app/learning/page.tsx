'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function LearningHub() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [textToSpeak, setTextToSpeak] = useState('')
  const [speechToText, setSpeechToText] = useState('')
  const { speak } = useAccessibility()

  const handleTextToSpeech = () => {
    if (textToSpeak.trim()) {
      speak(textToSpeak)
    }
  }

  const startSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setSpeechToText(result)
    }

    recognition.start()
  }

  const learningResources = [
    {
      title: 'Sign Language Basics',
      description: 'Learn fundamental ASL signs and gestures',
      type: 'video',
      content: 'Introduction to American Sign Language'
    },
    {
      title: 'Braille Reading Guide',
      description: 'Interactive Braille learning system',
      type: 'interactive',
      content: 'Learn to read and write Braille'
    },
    {
      title: 'Voice Navigation Tutorial',
      description: 'Master voice commands for web navigation',
      type: 'audio',
      content: 'Complete guide to voice navigation'
    },
    {
      title: 'Accessibility Best Practices',
      description: 'Understanding digital accessibility',
      type: 'document',
      content: 'Comprehensive accessibility guidelines'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8" role="main">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Hub
          </h1>
          <p className="text-xl text-gray-600">
            Accessible learning resources and interactive tools
          </p>
        </div>

        {/* Interactive Tools */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Text to Speech Tool */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              🔊 Text-to-Speech Tool
            </h2>
            <textarea
              value={textToSpeak}
              onChange={(e) => setTextToSpeak(e.target.value)}
              placeholder="Enter text to be spoken aloud..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              aria-label="Text to convert to speech"
            />
            <button
              onClick={handleTextToSpeech}
              disabled={!textToSpeak.trim()}
              className="mt-4 w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors disabled:bg-gray-300"
            >
              🎵 Speak Text
            </button>
          </div>

          {/* Speech to Text Tool */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              🎤 Speech-to-Text Converter
            </h2>
            <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto mb-4">
              {speechToText ? (
                <p className="text-gray-800">{speechToText}</p>
              ) : (
                <p className="text-gray-500">Click the button below to start speaking...</p>
              )}
            </div>
            <button
              onClick={startSpeechToText}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus-visible transition-colors"
            >
              🎙️ Start Recording
            </button>
          </div>
        </div>

        {/* Learning Resources */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">📚 Learning Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningResources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus-visible"
                onClick={() => setSelectedTool(resource.title)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedTool(resource.title)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open ${resource.title}`}
              >
                <div className="text-2xl mb-2">
                  {resource.type === 'video' && '🎥'}
                  {resource.type === 'audio' && '🎧'}
                  {resource.type === 'interactive' && '🎮'}
                  {resource.type === 'document' && '📄'}
                </div>
                <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Resource Modal */}
        {selectedTool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedTool}</h3>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none focus-visible"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedTool === 'Sign Language Basics' && (
                  <div>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-gray-500">Video: ASL Alphabet and Basic Signs</span>
                    </div>
                    <p className="text-gray-700">
                      Learn the fundamentals of American Sign Language including the alphabet, 
                      common greetings, and essential everyday signs.
                    </p>
                  </div>
                )}
                
                {selectedTool === 'Braille Reading Guide' && (
                  <div>
                    <div className="bg-blue-50 rounded-lg p-6 mb-4">
                      <h4 className="font-semibold mb-2">Interactive Braille Trainer</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-4 rounded">⠁<br/>A</div>
                        <div className="bg-white p-4 rounded">⠃<br/>B</div>
                        <div className="bg-white p-4 rounded">⠉<br/>C</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Interactive Braille learning system with tactile feedback simulation.
                    </p>
                  </div>
                )}
                
                {selectedTool === 'Voice Navigation Tutorial' && (
                  <div>
                    <div className="bg-green-50 rounded-lg p-6 mb-4">
                      <h4 className="font-semibold mb-2">Voice Commands</h4>
                      <ul className="space-y-2">
                        <li>• "Go to home" - Navigate to homepage</li>
                        <li>• "Open learning hub" - Access learning resources</li>
                        <li>• "Find jobs" - Open job portal</li>
                        <li>• "Emergency help" - Access emergency services</li>
                      </ul>
                    </div>
                    <p className="text-gray-700">
                      Master voice navigation commands to browse the web hands-free.
                    </p>
                  </div>
                )}
                
                {selectedTool === 'Accessibility Best Practices' && (
                  <div>
                    <div className="prose max-w-none">
                      <h4 className="font-semibold mb-2">Key Accessibility Principles</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• <strong>Perceivable:</strong> Information must be presentable in ways users can perceive</li>
                        <li>• <strong>Operable:</strong> Interface components must be operable</li>
                        <li>• <strong>Understandable:</strong> Information and UI operation must be understandable</li>
                        <li>• <strong>Robust:</strong> Content must be robust enough for various assistive technologies</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Study Resources */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">📖 Study Materials</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📄 Accessibility Guidelines (PDF)</h3>
              <p className="text-gray-600 text-sm mb-3">WCAG 2.1 compliance guide</p>
              <button className="text-primary-500 hover:text-primary-600 focus:outline-none focus-visible">
                Download PDF
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎧 Audio Lessons</h3>
              <p className="text-gray-600 text-sm mb-3">Screen reader usage tutorials</p>
              <button className="text-primary-500 hover:text-primary-600 focus:outline-none focus-visible">
                Play Audio
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎮 Interactive Exercises</h3>
              <p className="text-gray-600 text-sm mb-3">Practice accessibility skills</p>
              <button className="text-primary-500 hover:text-primary-600 focus:outline-none focus-visible">
                Start Exercise
              </button>
            </div>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}