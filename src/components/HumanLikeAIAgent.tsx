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
  action?: 'navigate' | 'click' | 'filter' | 'form_submit' | 'play_media' | 'scroll' | 'search' | 'clarify'
  target?: string
  extra?: any
  needsClarification?: boolean
  sessionId?: string
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN' },
  { code: 'raj', name: 'राजस्थानी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' }
]

export default function HumanLikeAIAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [detectedLanguage, setDetectedLanguage] = useState('en')
  const [sessionId, setSessionId] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  
  const router = useRouter()
  const { speak } = useAccessibility()
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Initialize session
    setSessionId(Date.now().toString())
    
    // Load preferences
    const savedLang = localStorage.getItem('humanai-language') || 'en'
    setSelectedLanguage(savedLang)
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

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
        const confidence = event.results[0][0].confidence
        
        // Auto-detect language based on content
        const detected = detectLanguage(transcript)
        setDetectedLanguage(detected)
        
        handleUserInput(transcript, detected)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        addMessage('I couldn\'t hear you clearly. Could you please try again?', false, selectedLanguage)
      }
    }

    // Add welcome message
    if (messages.length === 0) {
      addMessage('Hello! I\'m your intelligent assistant. I can help you navigate, search, fill forms, or perform any action on this website. Just tell me what you\'d like to do!', false, savedLang)
    }
  }, [])

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(selectedLanguage)
    }
    localStorage.setItem('humanai-language', selectedLanguage)
  }, [selectedLanguage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getLanguageCode = (lang: string): string => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'raj': 'hi-IN', // Fallback to Hindi for Rajasthani
      'ta': 'ta-IN'
    }
    return langMap[lang] || 'en-US'
  }

  const detectLanguage = (text: string): string => {
    // Simple language detection based on character patterns
    if (/[\u0900-\u097F]/.test(text)) {
      if (text.includes('आहे') || text.includes('मराठी')) return 'mr'
      if (text.includes('राजस्थानी') || text.includes('थारो')) return 'raj'
      return 'hi'
    }
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'
    return 'en'
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

  const speakText = (text: string, language: string) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = getLanguageCode(language)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    // Try to find a voice for the specific language
    const voices = synthRef.current.getVoices()
    const voice = voices.find(v => v.lang.startsWith(language === 'raj' ? 'hi' : language))
    if (voice) {
      utterance.voice = voice
    }

    synthRef.current.speak(utterance)
  }

  const executeAction = async (response: AIResponse) => {
    try {
      switch (response.action) {
        case 'navigate':
          if (response.target) {
            addMessage(`Navigating to ${response.target}...`, false, selectedLanguage)
            router.push(response.target)
          }
          break

        case 'click':
          if (response.target) {
            const element = document.querySelector(response.target)
            if (element) {
              (element as HTMLElement).click()
              addMessage('Done! I clicked that for you.', false, selectedLanguage)
            } else {
              addMessage('I couldn\'t find that element to click. Could you be more specific?', false, selectedLanguage)
            }
          }
          break

        case 'scroll':
          if (response.target === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else if (response.target === 'bottom') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
          } else if (response.target) {
            const element = document.querySelector(response.target)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }
          addMessage('Scrolled as requested!', false, selectedLanguage)
          break

        case 'form_submit':
          if (response.extra && response.extra.formData) {
            // Fill form fields
            Object.entries(response.extra.formData).forEach(([field, value]) => {
              const input = document.querySelector(`[name="${field}"], #${field}`) as HTMLInputElement
              if (input) {
                input.value = value as string
                input.dispatchEvent(new Event('input', { bubbles: true }))
              }
            })
            
            // Submit form if target provided
            if (response.target) {
              const form = document.querySelector(response.target) as HTMLFormElement
              if (form) {
                form.submit()
                addMessage('Form submitted successfully!', false, selectedLanguage)
              }
            }
          }
          break

        case 'filter':
          if (response.extra && response.extra.filters) {
            // Apply filters based on the extra data
            Object.entries(response.extra.filters).forEach(([filterType, value]) => {
              const filterElement = document.querySelector(`[data-filter="${filterType}"]`) as HTMLElement
              if (filterElement) {
                filterElement.click()
              }
            })
            addMessage('Filters applied!', false, selectedLanguage)
          }
          break

        case 'search':
          if (response.extra && response.extra.searchTerm) {
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement
            if (searchInput) {
              searchInput.value = response.extra.searchTerm
              searchInput.dispatchEvent(new Event('input', { bubbles: true }))
              
              // Try to find and click search button
              const searchButton = document.querySelector('button[type="submit"], button:has([data-search])') as HTMLElement
              if (searchButton) {
                searchButton.click()
              }
              addMessage(`Searching for "${response.extra.searchTerm}"...`, false, selectedLanguage)
            }
          }
          break

        case 'play_media':
          if (response.target) {
            const media = document.querySelector(response.target) as HTMLMediaElement
            if (media) {
              media.play()
              addMessage('Playing media!', false, selectedLanguage)
            }
          }
          break

        default:
          // No specific action, just display the message
          break
      }
    } catch (error) {
      console.error('Action execution error:', error)
      addMessage('I encountered an issue while performing that action. Could you try rephrasing your request?', false, selectedLanguage)
    }
  }

  const handleUserInput = async (text: string, language: string = detectedLanguage) => {
    if (!text.trim()) return

    addMessage(text, true, language)
    setInputText('')
    setIsProcessing(true)
    setIsThinking(true)

    try {
      const response = await fetch('/api/humanai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          language: language,
          targetLanguage: selectedLanguage,
          sessionId: sessionId,
          currentUrl: window.location.pathname,
          pageContext: {
            title: document.title,
            url: window.location.href,
            hasForm: document.forms.length > 0,
            hasSearch: !!document.querySelector('input[type="search"]'),
            hasMedia: !!document.querySelector('video, audio')
          }
        }),
      })

      const data: AIResponse = await response.json()
      setIsThinking(false)

      if (data.message) {
        addMessage(data.message, false, selectedLanguage)
        
        // Speak the response
        setTimeout(() => {
          speakText(data.message, selectedLanguage)
        }, 500)
      }

      // Execute any actions
      if (data.action && data.action !== 'clarify') {
        setTimeout(() => {
          executeAction(data)
        }, 1000)
      }

    } catch (error) {
      console.error('AI Agent error:', error)
      setIsThinking(false)
      addMessage('I\'m having trouble processing your request right now. Could you please try again?', false, selectedLanguage)
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
    if (inputText.trim()) {
      handleUserInput(inputText, selectedLanguage)
    }
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
            : isListening
            ? 'bg-green-500 hover:bg-green-600 animate-pulse'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
        }`}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        title={isOpen ? 'Close AI Assistant' : 'Open Human-like AI Assistant'}
      >
        <span className="text-white text-2xl">
          {isOpen ? '✕' : isListening ? '🎙️' : '🧠'}
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🧠</span>
                <h3 className="font-semibold">Human-like AI</h3>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white bg-opacity-20 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Select language"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="text-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm opacity-90">
              {detectedLanguage !== selectedLanguage && (
                <span>Detected: {SUPPORTED_LANGUAGES.find(l => l.code === detectedLanguage)?.name} • </span>
              )}
              I can perform any action on this website!
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-md border'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {!message.isUser && (
                      <button
                        onClick={() => speakText(message.text, message.language)}
                        className="text-xs opacity-70 hover:opacity-100 ml-2"
                        title="Speak this message"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-2xl shadow-md border max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                    : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 hover:from-purple-200 hover:to-blue-200'
                }`}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                disabled={isProcessing}
              >
                {isListening ? '🛑' : '🎤'}
              </button>
              
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me to do anything on this website..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isProcessing}
              />
              
              <button
                type="submit"
                disabled={isProcessing || !inputText.trim()}
                className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Send message"
              >
                {isProcessing ? '⏳' : '🚀'}
              </button>
            </form>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              Try: "Open jobs page", "Fill the form", "Search for accessibility", "Scroll to top"
            </div>
          </div>
        </div>
      )}
    </>
  )
}