'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoVoiceAssistant() {
  const router = useRouter()
  const recognitionRef = useRef<any>(null)
  const welcomeCountRef = useRef(0)
  const hasInitializedRef = useRef(false)

  const speak = (text: string, callback?: () => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      
      if (callback) {
        utterance.onend = callback
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Recognition start error:', error)
    }
  }

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    console.log('Voice command received:', lowerCommand)

    const commands = [
      { keywords: ['daily news', 'news'], path: '/news', label: 'Daily News' },
      { keywords: ['government schemes', 'schemes', 'government'], path: '/schemes', label: 'Government Schemes' },
      { keywords: ['learning hub', 'learning', 'learn'], path: '/learning', label: 'Learning Hub' },
      { keywords: ['job portal', 'jobs', 'job'], path: '/jobs', label: 'Job Portal' },
      { keywords: ['emergency', 'help'], path: '/help', label: 'Emergency Help' },
      { keywords: ['home'], path: '/', label: 'Home' }
    ]

    for (const cmd of commands) {
      if (cmd.keywords.some(keyword => lowerCommand.includes(keyword))) {
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }
        speak(`Opening ${cmd.label}`, () => {
          setTimeout(() => {
            router.push(cmd.path)
          }, 1000)
        })
        return
      }
    }

    speak('Sorry, I did not understand. Please try again.', () => {
      setTimeout(() => {
        startListening()
      }, 1000)
    })
  }

  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    if (!('speechSynthesis' in window)) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      console.log('Recognized speech:', transcript)
      handleVoiceCommand(transcript)
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setTimeout(() => startListening(), 1000)
      } else {
        speak('Sorry, an error occurred. Please try again.', () => {
          setTimeout(() => startListening(), 1000)
        })
      }
    }

    recognition.onend = () => {
      setTimeout(() => startListening(), 500)
    }

    recognitionRef.current = recognition

    const speakWelcome = () => {
      welcomeCountRef.current++
      
      if (welcomeCountRef.current <= 2) {
        speak('Welcome to JeetAble', () => {
          if (welcomeCountRef.current < 2) {
            setTimeout(speakWelcome, 500)
          } else {
            setTimeout(() => {
              startListening()
            }, 1000)
          }
        })
      }
    }

    setTimeout(speakWelcome, 500)

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  return null
}