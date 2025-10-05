'use client'

import Navbar from '@/components/Navbar'
import VoiceAssistant from '@/components/VoiceAssistant'
import EmergencyServicesMap from '@/components/EmergencyServicesMap'

interface Location {
  latitude: number
  longitude: number
}

export default function EmergencyHelp() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EmergencyServicesMap />
      <VoiceAssistant />
    </div>
  )
}