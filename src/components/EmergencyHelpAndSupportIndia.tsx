'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccessibility } from './AccessibilityProvider'

interface EmergencyService {
  id: string
  name: string
  type: 'hospital' | 'police' | 'fire' | 'clinic'
  distance: string
  address: string
  lat: number
  lng: number
  phone?: string
}

interface UserLocation {
  lat: number
  lng: number
}

const INDIAN_EMERGENCY_NUMBERS = [
  {
    title: 'Medical Emergency',
    number: '108',
    icon: '🚑',
    description: 'For serious injury, heart attack, or medical emergency, call now.',
    color: 'bg-red-500 hover:bg-red-600',
    serviceType: 'hospital'
  },
  {
    title: 'Fire Emergency',
    number: '101',
    icon: '🔥',
    description: 'If there is fire or smoke, evacuate immediately and call the fire service.',
    color: 'bg-orange-500 hover:bg-orange-600',
    serviceType: 'fire'
  },
  {
    title: 'Police Emergency',
    number: '100',
    icon: '👮',
    description: 'For theft, accidents, or immediate danger, contact police right now.',
    color: 'bg-blue-500 hover:bg-blue-600',
    serviceType: 'police'
  },
  {
    title: "Women's Helpline",
    number: '1091',
    icon: '💁‍♀️',
    description: "For women's safety or harassment issues, call the women helpline.",
    color: 'bg-purple-500 hover:bg-purple-600',
    serviceType: null
  }
]

const SERVICE_TYPES = [
  { value: 'hospital', label: 'Hospitals 🏥', icon: '🏥' },
  { value: 'police', label: 'Police Stations 👮', icon: '👮' },
  { value: 'fire', label: 'Fire Stations 🚒', icon: '🚒' },
  { value: 'clinic', label: 'Urgent Care / Clinics ⚕️', icon: '⚕️' }
]

export default function EmergencyHelpAndSupportIndia() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [services, setServices] = useState<EmergencyService[]>([])
  const [selectedServiceType, setSelectedServiceType] = useState<string>('hospital')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const { speak } = useAccessibility()

  // Load Google Maps API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.onload = () => setMapLoaded(true)
      document.head.appendChild(script)
    } else if (window.google) {
      setMapLoaded(true)
    }
  }, [])

  const callEmergencyNumber = (number: string, title: string) => {
    window.location.href = `tel:${number}`
    speak(`Calling ${title} at ${number}`)
  }

  const detectLocation = () => {
    setIsLoading(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setIsLoading(false)
      speak('Geolocation is not supported by this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        findNearbyServices(location, selectedServiceType)
        speak('Location detected. Finding nearby services.')
      },
      (error) => {
        let errorMessage = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setError(errorMessage)
        setIsLoading(false)
        speak(errorMessage)
        
        // Load mock Indian data
        loadMockIndianData()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const findNearbyServices = async (location: UserLocation, serviceType: string) => {
    try {
      const response = await fetch('/api/emergency-services-india', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          type: serviceType,
          radius: 5000
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
        speak(`Found ${data.services?.length || 0} ${serviceType} services nearby`)
        
        if (mapLoaded && googleMapRef.current) {
          displayServicesOnMap(data.services || [], location)
        }
      } else {
        throw new Error('Failed to fetch services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      loadMockIndianData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockIndianData = () => {
    const mockServices: EmergencyService[] = [
      {
        id: '1',
        name: 'Ruby Hall Clinic',
        type: 'hospital',
        distance: '1.0 km',
        address: 'Sassoon Road, Pune, Maharashtra',
        lat: 18.5283,
        lng: 73.8795,
        phone: '+91-20-6645-8888'
      },
      {
        id: '2',
        name: 'KEM Hospital',
        type: 'hospital',
        distance: '1.5 km',
        address: 'Rasta Peth, Pune, Maharashtra',
        lat: 18.5089,
        lng: 73.8553,
        phone: '+91-20-2612-9801'
      },
      {
        id: '3',
        name: 'Bund Garden Police Station',
        type: 'police',
        distance: '0.9 km',
        address: 'Bund Garden Road, Pune, Maharashtra',
        lat: 18.5304,
        lng: 73.8776,
        phone: '+91-20-2613-2978'
      },
      {
        id: '4',
        name: 'Pune Fire Station',
        type: 'fire',
        distance: '1.2 km',
        address: 'Shivajinagar, Pune, Maharashtra',
        lat: 18.5314,
        lng: 73.8446,
        phone: '+91-20-2553-2888'
      },
      {
        id: '5',
        name: 'Sahyadri Hospital',
        type: 'clinic',
        distance: '2.1 km',
        address: 'Karve Road, Pune, Maharashtra',
        lat: 18.4948,
        lng: 73.8174,
        phone: '+91-20-6799-6999'
      }
    ]
    
    const filteredServices = mockServices.filter(service => service.type === selectedServiceType)
    setServices(filteredServices)
    setUserLocation({ lat: 18.5204, lng: 73.8567 }) // Pune coordinates
    speak(`Showing ${filteredServices.length} nearby ${selectedServiceType} services`)
    
    if (mapLoaded) {
      displayServicesOnMap(filteredServices, { lat: 18.5204, lng: 73.8567 })
    }
    setIsLoading(false)
  }

  const displayServicesOnMap = (services: EmergencyService[], location: UserLocation) => {
    if (!mapRef.current || !window.google) return

    const map = new google.maps.Map(mapRef.current, {
      center: location,
      zoom: 13
    })

    googleMapRef.current = map

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add user location marker
    const userMarker = new google.maps.Marker({
      position: location,
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#ffffff"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      }
    })

    markersRef.current.push(userMarker)

    // Add service markers
    services.forEach((service) => {
      const serviceTypeInfo = SERVICE_TYPES.find(t => t.value === service.type)
      
      const marker = new google.maps.Marker({
        position: { lat: service.lat, lng: service.lng },
        map: map,
        title: service.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">${serviceTypeInfo?.icon || '📍'}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      marker.addListener('click', () => {
        speak(`Selected ${service.name}`)
        const element = document.getElementById(`service-${service.id}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })

      markersRef.current.push(marker)
    })
  }

  const getDirections = (service: EmergencyService) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}&travelmode=driving`
    window.open(url, '_blank')
    speak(`Opening directions to ${service.name}`)
  }

  const callService = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`
    speak(`Calling ${name}`)
  }

  const speakServiceInfo = (service: EmergencyService) => {
    const serviceTypeInfo = SERVICE_TYPES.find(t => t.value === service.type)
    speak(`${service.name}, ${serviceTypeInfo?.label}, ${service.distance} away, located at ${service.address}`)
  }

  const findNearbyByType = (serviceType: string) => {
    setSelectedServiceType(serviceType)
    if (userLocation) {
      findNearbyServices(userLocation, serviceType)
    } else {
      detectLocation()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          🇮🇳 Emergency Help & Support (India)
        </h1>
        <p className="text-xl text-gray-600">
          Quick access to Indian emergency services and nearby help
        </p>
      </div>

      {/* Indian Emergency Numbers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {INDIAN_EMERGENCY_NUMBERS.map((emergency, index) => (
          <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">{emergency.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{emergency.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{emergency.description}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => callEmergencyNumber(emergency.number, emergency.title)}
                className={`w-full ${emergency.color} text-white py-4 px-6 rounded-lg text-lg font-bold focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-colors`}
                aria-label={`Call ${emergency.title} at ${emergency.number}`}
              >
                📞 Call {emergency.number}
              </button>
              
              {emergency.serviceType && (
                <button
                  onClick={() => findNearbyByType(emergency.serviceType)}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-sm"
                >
                  📍 Find Nearby {emergency.serviceType === 'hospital' ? 'Hospitals' : emergency.serviceType === 'fire' ? 'Fire Stations' : 'Police Stations'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Nearby Services Finder */}
      <div className="bg-gray-50 rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🗺️ Nearby Emergency Services Map
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
          <button
            onClick={detectLocation}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Detecting...
              </>
            ) : (
              '📍 Detect My Location'
            )}
          </button>
          
          <select
            value={selectedServiceType}
            onChange={(e) => setSelectedServiceType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => userLocation && findNearbyServices(userLocation, selectedServiceType)}
            disabled={!userLocation || isLoading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 transition-colors"
          >
            🔍 Search Services
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            {error}
          </div>
        )}
      </div>

      {/* Services Results */}
      {services.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Services List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 Found {services.length} Services
            </h3>
            
            {services.map((service) => {
              const serviceTypeInfo = SERVICE_TYPES.find(t => t.value === service.type)
              
              return (
                <div
                  key={service.id}
                  id={`service-${service.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{serviceTypeInfo?.icon}</span>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{serviceTypeInfo?.label}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {service.distance}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">📍 {service.address}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => getDirections(service)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                    >
                      🗺️ Directions
                    </button>
                    
                    {service.phone && (
                      <button
                        onClick={() => callService(service.phone!, service.name)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                      >
                        📞 Call
                      </button>
                    )}
                    
                    <button
                      onClick={() => speakServiceInfo(service)}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors"
                    >
                      🔊 Read Aloud
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-4">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              🗺️ Services Map
            </h3>
            <div 
              ref={mapRef}
              className="w-full h-96 bg-gray-200 rounded-lg border border-gray-300"
              role="img"
              aria-label="Map showing emergency services locations"
            >
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Indian Emergency Info */}
      <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-orange-900 mb-4">🇮🇳 Important Indian Emergency Numbers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div><strong>Ambulance:</strong> 108</div>
          <div><strong>Police:</strong> 100</div>
          <div><strong>Fire:</strong> 101</div>
          <div><strong>Women Helpline:</strong> 1091</div>
          <div><strong>Child Helpline:</strong> 1098</div>
          <div><strong>Tourist Helpline:</strong> 1363</div>
          <div><strong>Railway Enquiry:</strong> 139</div>
          <div><strong>Road Accident:</strong> 1073</div>
          <div><strong>Disaster Management:</strong> 108</div>
        </div>
      </div>
    </div>
  )
}