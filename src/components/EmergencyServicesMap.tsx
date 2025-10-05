'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccessibility } from './AccessibilityProvider'

interface EmergencyService {
  id: string
  name: string
  type: 'hospital' | 'police' | 'fire' | 'urgent_care'
  distance: string
  address: string
  lat: number
  lng: number
  phone?: string
  rating?: number
}

interface UserLocation {
  lat: number
  lng: number
}

const SERVICE_TYPES = [
  { type: 'hospital', icon: '🏥', label: 'Hospitals', color: '#dc2626' },
  { type: 'police', icon: '👮', label: 'Police Stations', color: '#2563eb' },
  { type: 'fire', icon: '🚒', label: 'Fire Departments', color: '#ea580c' },
  { type: 'urgent_care', icon: '⚕️', label: 'Urgent Care', color: '#16a34a' }
]

export default function EmergencyServicesMap() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [services, setServices] = useState<EmergencyService[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedService, setSelectedService] = useState<string | null>(null)
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

  const getCurrentLocation = () => {
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
        findNearbyServices(location)
        speak('Location detected. Finding nearby emergency services.')
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
        
        // Load mock data for demo
        loadMockData()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const findNearbyServices = async (location: UserLocation) => {
    try {
      const response = await fetch('/api/emergency-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          radius: 5000 // 5km radius
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
        speak(`Found ${data.services?.length || 0} emergency services nearby`)
        
        if (mapLoaded && googleMapRef.current) {
          displayServicesOnMap(data.services || [], location)
        }
      } else {
        throw new Error('Failed to fetch emergency services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    const mockServices: EmergencyService[] = [
      {
        id: '1',
        name: 'City General Hospital',
        type: 'hospital',
        distance: '0.8 miles',
        address: '123 Medical Center Dr',
        lat: 40.7589,
        lng: -73.9851,
        phone: '(555) 123-4567',
        rating: 4.2
      },
      {
        id: '2',
        name: 'Fire Station 12',
        type: 'fire',
        distance: '1.2 miles',
        address: '456 Fire House Ave',
        lat: 40.7614,
        lng: -73.9776,
        phone: '(555) 987-6543',
        rating: 4.8
      },
      {
        id: '3',
        name: 'Police Precinct 15',
        type: 'police',
        distance: '1.5 miles',
        address: '789 Safety Blvd',
        lat: 40.7505,
        lng: -73.9934,
        phone: '(555) 456-7890',
        rating: 4.0
      },
      {
        id: '4',
        name: 'QuickCare Urgent Center',
        type: 'urgent_care',
        distance: '2.1 miles',
        address: '321 Health St',
        lat: 40.7648,
        lng: -73.9808,
        phone: '(555) 321-0987',
        rating: 4.5
      }
    ]
    
    setServices(mockServices)
    setUserLocation({ lat: 40.7580, lng: -73.9855 }) // Mock NYC location
    speak(`Showing ${mockServices.length} nearby emergency services`)
    
    if (mapLoaded) {
      displayServicesOnMap(mockServices, { lat: 40.7580, lng: -73.9855 })
    }
    setIsLoading(false)
  }

  const displayServicesOnMap = (services: EmergencyService[], location: UserLocation) => {
    if (!mapRef.current || !window.google) return

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      center: location,
      zoom: 13,
      styles: [
        {
          featureType: 'poi.medical',
          stylers: [{ visibility: 'on' }]
        }
      ]
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
      const serviceType = SERVICE_TYPES.find(t => t.type === service.type)
      
      const marker = new google.maps.Marker({
        position: { lat: service.lat, lng: service.lng },
        map: map,
        title: service.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="${serviceType?.color || '#666'}" stroke="#ffffff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">${serviceType?.icon || '📍'}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      // Add click listener
      marker.addListener('click', () => {
        setSelectedService(service.id)
        speak(`Selected ${service.name}`)
        
        // Scroll to service card
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
    const serviceType = SERVICE_TYPES.find(t => t.type === service.type)
    speak(`${service.name}, ${serviceType?.label}, ${service.distance} away, located at ${service.address}`)
  }

  const getServiceTypeInfo = (type: string) => {
    return SERVICE_TYPES.find(t => t.type === type)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          🚨 Emergency Help & Support
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Find nearby emergency services instantly with real-time location detection
        </p>
        
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="bg-red-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Find nearby emergency services"
        >
          {isLoading ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Finding Services...
            </>
          ) : (
            <>📍 Find Nearby Services</>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Services List */}
      {services.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Services Cards */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 Nearby Emergency Services ({services.length})
            </h2>
            
            {services.map((service) => {
              const serviceType = getServiceTypeInfo(service.type)
              const isSelected = selectedService === service.id
              
              return (
                <div
                  key={service.id}
                  id={`service-${service.id}`}
                  className={`bg-white border-2 rounded-lg p-6 shadow-md transition-all duration-200 ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedService(service.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span 
                        className="text-3xl p-2 rounded-full"
                        style={{ backgroundColor: `${serviceType?.color}20` }}
                      >
                        {serviceType?.icon}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{serviceType?.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {service.distance}
                      </span>
                      {service.rating && (
                        <div className="text-sm text-gray-600 mt-1">
                          ⭐ {service.rating}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">📍 {service.address}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        getDirections(service)
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                    >
                      🗺️ Directions
                    </button>
                    
                    {service.phone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          callService(service.phone!, service.name)
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                      >
                        📞 Call
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        speakServiceInfo(service)
                      }}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors"
                      aria-label={`Read aloud information for ${service.name}`}
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🗺️ Emergency Services Map
            </h2>
            <div 
              ref={mapRef}
              className="w-full h-96 bg-gray-200 rounded-lg border-2 border-gray-300"
              role="img"
              aria-label="Interactive map showing emergency services locations"
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
            
            {/* Map Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Map Legend:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
                {SERVICE_TYPES.map((type) => (
                  <div key={type.type} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: type.color }}
                    >
                      <span className="text-white text-xs">{type.icon}</span>
                    </div>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Instructions */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-red-900 mb-4">🚨 Emergency Instructions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🚑</div>
            <h3 className="font-semibold text-red-800">Medical Emergency</h3>
            <p className="text-red-700 text-sm">Call 911 immediately for life-threatening situations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="font-semibold text-red-800">Fire Emergency</h3>
            <p className="text-red-700 text-sm">Evacuate immediately and call 911</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">👮</div>
            <h3 className="font-semibold text-red-800">Police Emergency</h3>
            <p className="text-red-700 text-sm">Call 911 for crimes in progress or immediate danger</p>
          </div>
        </div>
      </div>
    </div>
  )
}