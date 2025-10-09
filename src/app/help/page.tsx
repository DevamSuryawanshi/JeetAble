import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import VoiceAssistant from '@/components/VoiceAssistant'
import EmergencyHelpAndSupportIndia from '@/components/EmergencyHelpAndSupportIndia'

export default function EmergencyHelp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <BackButton />
      </div>
      <EmergencyHelpAndSupportIndia />
      <VoiceAssistant />
    </div>
  )
}