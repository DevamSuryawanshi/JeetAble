'use client'

import { useEffect, useRef, useState } from 'react'

interface EmergencyContact {
  name: string
  phoneNumber: string
  whatsappNumber: string
}

export default function EmergencyVoiceAssistant() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const recognitionRef = useRef<any>(null)
  const hasInitializedRef = useRef(false)
  const isProcessingRef = useRef(false)

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

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const sendEmergencyAlert = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          latitude,
          longitude,
          contacts
        })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Alert error:', error)
      throw error
    }
  }

  const handleEmergency = async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    try {
      speak('Getting your location. Please wait.')

      const location = await getCurrentLocation()
      const mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`

      speak('Location detected. Sending emergency alerts to all contacts.')

      const result = await sendEmergencyAlert(location.latitude, location.longitude)

      if (result.success) {
        speak(`Emergency alerts sent successfully to ${result.totalSent} contacts. Location shared.`)
        
        setTimeout(() => {
          speak('Starting navigation guidance.')
          window.open(`https://www.google.com/maps/dir/?api=1&destination=hospital&travelmode=driving`, '_blank')
        }, 3000)
      } else {
        speak('Failed to send emergency alerts. Please try again.')
      }
    } catch (error: any) {
      if (error.code === 1) {
        speak('Unable to get location. Please enable GPS in your browser settings.')
      } else {
        speak('Error occurred. Please try again or call emergency services directly.')
      }
    } finally {
      isProcessingRef.current = false
      setTimeout(() => startListening(), 2000)
    }
  }

  const handleSendHelp = async () => {
    await handleEmergency()
  }

  const handleCallAmbulance = async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    try {
      speak('Calling ambulance. Please wait.')

      const location = await getCurrentLocation()
      
      await sendEmergencyAlert(location.latitude, location.longitude)
      
      speak('Emergency alerts sent. Calling ambulance now.')
      
      setTimeout(() => {
        window.location.href = 'tel:108'
      }, 2000)
    } catch (error) {
      speak('Unable to get location. Calling ambulance directly.')
      setTimeout(() => {
        window.location.href = 'tel:108'
      }, 1000)
    } finally {
      isProcessingRef.current = false
    }
  }

  const confirmAction = (action: () => void, actionName: string) => {
    speak(`Do you want to ${actionName}? Say yes to confirm.`, () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase()
          
          if (transcript.includes('yes') || transcript.includes('confirm')) {
            action()
          } else {
            speak('Action cancelled.')
            setTimeout(() => startListening(), 1000)
          }
          
          recognitionRef.current.onresult = handleRecognitionResult
        }
      }
    })
  }

  const handleRecognitionResult = (event: any) => {
    const transcript = event.results[0][0].transcript.toLowerCase()
    console.log('Recognized:', transcript)

    if (transcript.includes('emergency')) {
      confirmAction(handleEmergency, 'send emergency alert')
    } else if (transcript.includes('send help') || transcript.includes('help')) {
      confirmAction(handleSendHelp, 'send help alert')
    } else if (transcript.includes('call ambulance') || transcript.includes('ambulance')) {
      confirmAction(handleCallAmbulance, 'call ambulance')
    }
  }

  const startListening = () => {
    if (!recognitionRef.current || isProcessingRef.current) return

    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Recognition start error:', error)
    }
  }

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/emergency-contacts?userId=demo-user')
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        setContacts(data.data)
      } else {
        setContacts([
          { name: 'Emergency Contact 1', phoneNumber: '+911234567890', whatsappNumber: '+911234567890' },
          { name: 'Emergency Contact 2', phoneNumber: '+911234567891', whatsappNumber: '+911234567891' }
        ])
      }
    } catch (error) {
      console.error('Load contacts error:', error)
      setContacts([
        { name: 'Emergency Contact 1', phoneNumber: '+911234567890', whatsappNumber: '+911234567890' }
      ])
    }
  }

  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    loadContacts()

    if (!('speechSynthesis' in window)) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = handleRecognitionResult

    recognition.onerror = (event: any) => {
      console.error('Recognition error:', event.error)
      if (event.error === 'no-speech') {
        setTimeout(() => startListening(), 1000)
      }
    }

    recognition.onend = () => {
      if (!isProcessingRef.current) {
        setTimeout(() => startListening(), 500)
      }
    }

    recognitionRef.current = recognition

    setTimeout(() => {
      speak('Emergency voice assistant activated. Say emergency, send help, or call ambulance for assistance.')
      setTimeout(() => startListening(), 3000)
    }, 1000)

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  return null
}
