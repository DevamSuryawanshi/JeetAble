'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAccessibility } from './AccessibilityProvider'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  language: string
}

interface AIResponse {
  message: string
  action?: 'navigate' | 'speak' | 'help'
  route?: string
  error?: string
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
]

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [voiceOnlyMode, setVoiceOnlyMode] = useState(false)
  const [textOnlyMode, setTextOnlyMode] = useState(false)
  
  const router = useRouter()
  const { speak } = useAccessibility()
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load preferences from localStorage
    const savedLang = localStorage.getItem('aiagent-language') || 'en'
    const savedVoiceOnly = localStorage.getItem('aiagent-voice-only') === 'true'
    const savedTextOnly = localStorage.getItem('aiagent-text-only') === 'true'
    
    setSelectedLanguage(savedLang)
    setVoiceOnlyMode(savedVoiceOnly)
    setTextOnlyMode(savedTextOnly)

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = getLanguageCode(savedLang)

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleUserInput(transcript, savedLang)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        addMessage('Sorry, I couldn\'t hear you clearly. Please try again.', false, 'en')
      }
    }

    // Add welcome message
    if (messages.length === 0) {
      addMessage('Hello! I\'m your AI assistant. How can I help you today?', false, savedLang)
    }
  }, [])

  useEffect(() => {
    // Update speech recognition language when language changes
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(selectedLanguage)
    }
    
    // Save preferences
    localStorage.setItem('aiagent-language', selectedLanguage)
    localStorage.setItem('aiagent-voice-only', voiceOnlyMode.toString())
    localStorage.setItem('aiagent-text-only', textOnlyMode.toString())
  }, [selectedLanguage, voiceOnlyMode, textOnlyMode])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getLanguageCode = (lang: string): string => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'es': 'es-ES',
      'fr': 'fr-FR'
    }
    return langMap[lang] || 'en-US'
  }

  const addMessage = (text: string, isUser: boolean, language: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleUserInput = async (text: string, language: string = selectedLanguage) => {
    if (!text.trim()) return

    addMessage(text, true, language)
    setInputText('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/aiagent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          language: language,
          targetLanguage: selectedLanguage
        }),
      })

      const data: AIResponse = await response.json()

      if (data.error) {
        addMessage('Sorry, I encountered an error. Please try again.', false, selectedLanguage)
        return
      }

      addMessage(data.message, false, selectedLanguage)

      // Handle actions
      if (data.action === 'navigate' && data.route) {
        setTimeout(() => {
          router.push(data.route!)
          speak(`Navigating to ${data.route}`)
        }, 1000)
      } else if (data.action === 'speak' || !textOnlyMode) {
        speak(data.message)
      }

    } catch (error) {
      console.error('AI Agent error:', error)
      addMessage('Sorry, I\'m having trouble connecting. Please try again later.', false, selectedLanguage)
    } finally {
      setIsProcessing(false)
    }
  }

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleUserInput(inputText)
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 z-50 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-primary-500 hover:bg-primary-600'
        }`}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        <span className="text-white text-2xl">
          {isOpen ? '✕' : '🤖'}
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40">
          {/* Header */}
          <div className="bg-primary-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-primary-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Select language"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Mode Toggles */}
            <div className="flex items-center space-x-4 text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceOnlyMode}
                  onChange={(e) => setVoiceOnlyMode(e.target.checked)}
                  className="mr-1"
                />
                Voice Only
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={textOnlyMode}
                  onChange={(e) => setTextOnlyMode(e.target.checked)}
                  className="mr-1"
                />
                Text Only
              </label>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              {!textOnlyMode && (
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  disabled={isProcessing}
                >
                  🎤
                </button>
              )}
              
              {!voiceOnlyMode && (
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isProcessing}
                />
              )}
              
              <button
                type="submit"
                disabled={isProcessing || (!inputText.trim() && !voiceOnlyMode)}
                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                📤
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}