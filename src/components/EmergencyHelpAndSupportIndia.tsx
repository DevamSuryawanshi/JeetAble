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
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'granted' | 'denied' | 'error'>('idle')
  const [manualSearch, setManualSearch] = useState('')
  const [showManualSearch, setShowManualSearch] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const { speak } = useAccessibility()

  // Load Google Maps API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script')
      // Use a fallback API key for demo purposes
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dpoWMROTJJOBDU'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = () => {
        console.log('Google Maps API loaded successfully')
        setMapLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        setError('Failed to load Google Maps. Map features may not work.')
      }
      document.head.appendChild(script)
    } else if (window.google) {
      console.log('Google Maps API already available')
      setMapLoaded(true)
    }
  }, [])

  const callEmergencyNumber = (number: string, title: string) => {
    window.location.href = `tel:${number}`
    speak(`Calling ${title} at ${number}`)
  }

  const detectLocation = () => {
    setIsLoading(true)
    setLocationStatus('detecting')
    setError('')
    setShowManualSearch(false)
    
    console.log('Starting location detection...')
    speak('Detecting your current location... please wait.')
    
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by this browser'
      console.error('Geolocation not supported')
      setError(errorMsg)
      setLocationStatus('error')
      setIsLoading(false)
      setShowManualSearch(true)
      speak(errorMsg)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location permission granted', position.coords)
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        setLocationStatus('granted')
        setError('')
        findNearbyServices(location, selectedServiceType)
        speak('Location detected successfully. Showing nearby emergency services.')
      },
      (error) => {
        console.error('Location error:', error)
        let errorMessage = 'Unable to detect your location'
        let status: 'denied' | 'error' = 'error'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access is blocked. Please enable it in your browser settings to show nearby services.'
            status = 'denied'
            console.log('Location permission denied by user')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. You can search manually for services.'
            console.log('Location position unavailable')
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. You can search manually for services.'
            console.log('Location request timeout')
            break
          default:
            errorMessage = 'Unable to detect your location. You can search manually for services.'
            console.log('Unknown location error:', error.message)
        }
        
        setError(errorMessage)
        setLocationStatus(status)
        setIsLoading(false)
        setShowManualSearch(true)
        speak(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    )
  }

  const findNearbyServices = async (location: UserLocation, serviceType: string) => {
    try {
      const response = await fetch('/api/getNearbyPlaces', {
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
        const mappedServices = data.places?.map((place: any) => ({
          id: place.id,
          name: place.name,
          type: place.type,
          distance: place.distance,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
          phone: place.phone,
          rating: place.rating
        })) || []
        
        setServices(mappedServices)
        speak(`Found ${mappedServices.length} real ${serviceType} services nearby`)
        
        // Always try to display map when services are found
        setTimeout(() => {
          if (mapLoaded) {
            displayServicesOnMap(mappedServices, location)
          }
        }, 100)
      } else {
        throw new Error('Failed to fetch services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      speak('Unable to fetch real-time data. Showing sample services.')
      loadMockIndianData()
    } finally {
      setIsLoading(false)
    }
  }

  const searchManualLocation = async () => {
    if (!manualSearch.trim()) {
      speak('Please enter a city or area name')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      console.log('Searching for location:', manualSearch)
      speak(`Searching for ${manualSearch}...`)
      
      // Use Google Geocoding API to get coordinates from city name
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualSearch)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        }
        
        console.log('Manual location found:', location)
        setUserLocation(location)
        setLocationStatus('granted')
        setShowManualSearch(false)
        findNearbyServices(location, selectedServiceType)
        speak(`Found ${manualSearch}. Searching for nearby services.`)
      } else {
        throw new Error('Location not found')
      }
    } catch (error) {
      console.error('Manual search error:', error)
      setError(`Could not find "${manualSearch}". Please try a different city or area name.`)
      speak('Location not found. Please try a different city name.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockIndianData = async () => {
    try {
      // First try to fetch from MongoDB
      const response = await fetch('/api/emergency-services')
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        const mappedServices = data.data.map((service: any, index: number) => ({
          id: service._id || index.toString(),
          name: service.name,
          type: 'hospital', // Default type
          distance: '1.0 km', // Default distance
          address: service.email, // Using email as address for now
          lat: 18.5204 + (Math.random() - 0.5) * 0.01, // Random nearby coordinates
          lng: 73.8567 + (Math.random() - 0.5) * 0.01,
          phone: service.phone
        }))
        
        setServices(mappedServices)
        setUserLocation({ lat: 18.5204, lng: 73.8567 })
        setLocationStatus('granted')
        speak(`Showing ${mappedServices.length} emergency services from database`)
        
        setTimeout(() => {
          if (mapLoaded) {
            displayServicesOnMap(mappedServices, { lat: 18.5204, lng: 73.8567 })
          }
        }, 100)
      } else {
        // Fallback to mock data if no database entries
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
          }
        ]
        
        const filteredServices = mockServices.filter(service => service.type === selectedServiceType)
        setServices(filteredServices)
        setUserLocation({ lat: 18.5204, lng: 73.8567 })
        setLocationStatus('granted')
        speak(`Showing ${filteredServices.length} sample ${selectedServiceType} services`)
        
        setTimeout(() => {
          if (mapLoaded) {
            displayServicesOnMap(filteredServices, { lat: 18.5204, lng: 73.8567 })
          }
        }, 100)
      }
    } catch (error) {
      console.error('Error loading emergency services:', error)
      speak('Unable to load emergency services')
    } finally {
      setIsLoading(false)
    }
  }

  const displayServicesOnMap = (services: EmergencyService[], location: UserLocation) => {
    if (!mapRef.current || !window.google) {
      console.log('Map ref or Google Maps not available')
      return
    }

    console.log('Initializing map with location:', location)
    
    const map = new google.maps.Map(mapRef.current, {
      center: location,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    })

    googleMapRef.current = map
    console.log('Map initialized successfully')

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

  // Voice command integration
  useEffect(() => {
    const handleVoiceCommand = (event: CustomEvent) => {
      const command = event.detail.toLowerCase()
      
      // Location detection commands
      if (command.includes('detect location') || command.includes('find my location') || command.includes('मेरा लोकेशन') || command.includes('माझे ठिकाण')) {
        detectLocation()
        return
      }
      
      // Service type commands
      if (command.includes('hospital') || command.includes('हॉस्पिटल') || command.includes('रुग्णालय')) {
        findNearbyByType('hospital')
      } else if (command.includes('police') || command.includes('पुलिस') || command.includes('पोलीस')) {
        findNearbyByType('police')
      } else if (command.includes('fire') || command.includes('आग') || command.includes('अग्निशमन')) {
        findNearbyByType('fire')
      } else if (command.includes('clinic') || command.includes('क्लिनिक') || command.includes('दवाखाना')) {
        findNearbyByType('clinic')
      }
    }

    window.addEventListener('voiceCommand', handleVoiceCommand as EventListener)
    return () => window.removeEventListener('voiceCommand', handleVoiceCommand as EventListener)
  }, [userLocation])

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
            disabled={isLoading || locationStatus === 'detecting'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
          >
            {locationStatus === 'detecting' ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Detecting Location...
              </>
            ) : locationStatus === 'granted' ? (
              '📍 Update Location'
            ) : (
              '📍 Detect My Location'
            )}
          </button>
          
          <button
            onClick={loadMockIndianData}
            disabled={isLoading}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 transition-colors"
          >
            🏥 Show Sample Services
          </button>
          
          {(locationStatus === 'denied' || locationStatus === 'error') && (
            <button
              onClick={() => setShowManualSearch(!showManualSearch)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors"
            >
              🔍 Search Manually
            </button>
          )}
          
          <select
            value={selectedServiceType}
            onChange={(e) => {
              setSelectedServiceType(e.target.value)
              if (userLocation) {
                findNearbyServices(userLocation, e.target.value)
              }
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => {
              if (userLocation) {
                findNearbyServices(userLocation, selectedServiceType)
              } else {
                loadMockIndianData()
              }
            }}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Searching...' : userLocation ? '🔍 Search Real Services' : '🔍 Show Sample Services'}
          </button>
        </div>

        {userLocation && locationStatus === 'granted' && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              📍 Current location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          </div>
        )}

        {/* Location Status Messages */}
        {locationStatus === 'detecting' && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6 flex items-center" role="status">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></span>
            📍 Detecting your current location... please wait.
          </div>
        )}
        
        {locationStatus === 'granted' && userLocation && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="status">
            ✅ Location detected successfully. Showing nearby hospitals, police stations, and fire departments.
          </div>
        )}
        
        {locationStatus === 'denied' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
            ⚠️ Location access is blocked. Please enable it in your browser settings to show nearby services.
          </div>
        )}
        
        {locationStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            🚫 Unable to detect your location. You can search manually for services.
          </div>
        )}
        
        {error && locationStatus !== 'detecting' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            {error}
          </div>
        )}
        
        {/* Manual Search */}
        {showManualSearch && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 Manual Location Search</h3>
            <p className="text-gray-600 mb-4">Enter your city or area to find nearby services manually:</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                placeholder="Enter city name (e.g., Mumbai, Delhi, Pune)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchManualLocation()
                  }
                }}
                disabled={isLoading}
              />
              <button
                onClick={searchManualLocation}
                disabled={isLoading || !manualSearch.trim()}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* No Results Message */}
      {!isLoading && userLocation && services.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg mb-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No nearby services found</h3>
          <p className="text-gray-600 mb-4">
            No {SERVICE_TYPES.find(t => t.value === selectedServiceType)?.label.toLowerCase()} found within 5km radius.
          </p>
          <button
            onClick={() => findNearbyServices(userLocation, selectedServiceType)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Map Section - Always Show */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          🗺️ Services Map
        </h3>
        <div className="relative">
          <div 
            ref={mapRef}
            className="w-full h-96 bg-gray-200 rounded-lg border border-gray-300"
            role="img"
            aria-label="Map showing emergency services locations"
            style={{ minHeight: '384px' }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
          {mapLoaded && services.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg pointer-events-none">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-600">Click "Detect My Location" or "Show Sample Services" to see the map</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Results */}
      {services.length > 0 && (
        <div className="space-y-6">
          {/* Services List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 Found {services.length} Real-time {SERVICE_TYPES.find(t => t.value === selectedServiceType)?.label}
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