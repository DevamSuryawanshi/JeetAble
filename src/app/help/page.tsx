'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'

interface Location {
  latitude: number
  longitude: number
}

export default function EmergencyHelp() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isEmergency, setIsEmergency] = useState(false)
  const [emergencyType, setEmergencyType] = useState('')
  const { speak } = useAccessibility()

  useEffect(() => {
    // Get user's location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          speak('Unable to get your location. Please enable location services.')
        }
      )
    }
  }, [speak])

  const handleSOS = (type: string) => {
    setEmergencyType(type)
    setIsEmergency(true)
    
    // Mock emergency alert
    console.log('EMERGENCY ALERT:', {
      type,
      location,
      timestamp: new Date().toISOString()
    })
    
    speak(`Emergency alert sent for ${type}. Help is on the way.`)
    
    // Auto-reset after 10 seconds for demo
    setTimeout(() => {
      setIsEmergency(false)
      setEmergencyType('')
    }, 10000)
  }

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: '🚨' },
    { name: 'Poison Control', number: '1-800-222-1222', icon: '☠️' },
    { name: 'Crisis Hotline', number: '988', icon: '💭' },
    { name: 'Disability Services', number: '1-800-514-0301', icon: '♿' }
  ]

  const nearbyServices = [
    { name: 'General Hospital', distance: '0.8 miles', type: 'Hospital', icon: '🏥' },
    { name: 'Fire Station 12', distance: '1.2 miles', type: 'Fire Department', icon: '🚒' },
    { name: 'Police Station', distance: '1.5 miles', type: 'Police', icon: '👮' },
    { name: 'Urgent Care Center', distance: '2.1 miles', type: 'Medical', icon: '⚕️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8" role="main">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Help & Support
          </h1>
          <p className="text-xl text-gray-600">
            Quick access to emergency services and support resources
          </p>
        </div>

        {/* Emergency Alert Status */}
        {isEmergency && (
          <div className="bg-red-100 border-l-4 border-red-500 p-6 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-500 text-2xl mr-4 animate-pulse">🚨</div>
              <div>
                <h2 className="text-xl font-bold text-red-800">Emergency Alert Sent</h2>
                <p className="text-red-700">
                  {emergencyType} alert has been sent to emergency services.
                  {location && ` Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SOS Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleSOS('Medical Emergency')}
            className="bg-red-500 text-white p-6 rounded-lg hover:bg-red-600 focus:outline-none focus-visible transition-colors text-center"
            aria-label="Send medical emergency alert"
          >
            <div className="text-4xl mb-2">🚑</div>
            <div className="font-semibold">Medical Emergency</div>
          </button>
          
          <button
            onClick={() => handleSOS('Fire Emergency')}
            className="bg-orange-500 text-white p-6 rounded-lg hover:bg-orange-600 focus:outline-none focus-visible transition-colors text-center"
            aria-label="Send fire emergency alert"
          >
            <div className="text-4xl mb-2">🔥</div>
            <div className="font-semibold">Fire Emergency</div>
          </button>
          
          <button
            onClick={() => handleSOS('Police Emergency')}
            className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 focus:outline-none focus-visible transition-colors text-center"
            aria-label="Send police emergency alert"
          >
            <div className="text-4xl mb-2">👮</div>
            <div className="font-semibold">Police Emergency</div>
          </button>
          
          <button
            onClick={() => handleSOS('General Help')}
            className="bg-purple-500 text-white p-6 rounded-lg hover:bg-purple-600 focus:outline-none focus-visible transition-colors text-center"
            aria-label="Send general help request"
          >
            <div className="text-4xl mb-2">🆘</div>
            <div className="font-semibold">General Help</div>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              📞 Emergency Contacts
            </h2>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3" role="img" aria-label={contact.name}>
                      {contact.icon}
                    </span>
                    <span className="font-medium">{contact.name}</span>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
                    onClick={() => speak(`Calling ${contact.name}`)}
                  >
                    Call {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              📍 Nearby Services
            </h2>
            {location ? (
              <div className="space-y-3">
                {nearbyServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3" role="img" aria-label={service.type}>
                        {service.icon}
                      </span>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-600">{service.distance} • {service.type}</div>
                      </div>
                    </div>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 focus:outline-none focus-visible transition-colors"
                      onClick={() => speak(`Getting directions to ${service.name}`)}
                    >
                      Directions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Enable location services to see nearby emergency services</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
                >
                  Enable Location
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">🗺️ Emergency Services Map</h2>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-gray-600">Interactive map showing nearby emergency services</p>
              {location && (
                <p className="text-sm text-gray-500 mt-2">
                  Your location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">💡 Safety Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-lg">🏠 At Home</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Keep emergency numbers easily accessible</li>
                <li>• Install smoke and carbon monoxide detectors</li>
                <li>• Have a first aid kit readily available</li>
                <li>• Know your home's address and nearest cross streets</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg">🚗 On the Go</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Keep your phone charged and accessible</li>
                <li>• Share your location with trusted contacts</li>
                <li>• Carry emergency contact information</li>
                <li>• Know how to use emergency features on your device</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Crisis Resources */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">🤝 Crisis Support Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">Mental Health Crisis</h3>
              <p className="text-gray-600 mb-2">24/7 crisis counseling and support</p>
              <a href="tel:988" className="text-blue-600 hover:text-blue-800 font-medium">
                Call 988 - Suicide & Crisis Lifeline
              </a>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">Disability Rights</h3>
              <p className="text-gray-600 mb-2">ADA information and assistance</p>
              <a href="tel:1-800-514-0301" className="text-blue-600 hover:text-blue-800 font-medium">
                Call 1-800-514-0301
              </a>
            </div>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}