import Navbar from '@/components/Navbar'
import VoiceAssistant from '@/components/VoiceAssistant'
import EmergencyHelpAndSupportIndia from '@/components/EmergencyHelpAndSupportIndia'

export default function EmergencyHelp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EmergencyHelpAndSupportIndia />
      <VoiceAssistant />
    </div>
  )
}