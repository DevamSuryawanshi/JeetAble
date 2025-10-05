import { NextRequest, NextResponse } from 'next/server'

interface EmergencyServiceRequest {
  lat: number
  lng: number
  radius: number
}

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

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const d = R * c // Distance in kilometers
  return d
}

// Convert distance to miles and format
function formatDistance(distanceKm: number): string {
  const distanceMiles = distanceKm * 0.621371
  if (distanceMiles < 1) {
    return `${Math.round(distanceMiles * 1000)} ft`
  }
  return `${distanceMiles.toFixed(1)} miles`
}

// Generate mock data based on user location
function generateMockServices(lat: number, lng: number): EmergencyService[] {
  const mockServices: EmergencyService[] = [
    {
      id: '1',
      name: 'City General Hospital',
      type: 'hospital',
      distance: formatDistance(calculateDistance(lat, lng, lat + 0.01, lng + 0.01)),
      address: '123 Medical Center Dr',
      lat: lat + 0.01,
      lng: lng + 0.01,
      phone: '(555) 123-4567',
      rating: 4.2
    },
    {
      id: '2',
      name: 'Regional Medical Center',
      type: 'hospital',
      distance: formatDistance(calculateDistance(lat, lng, lat - 0.015, lng + 0.02)),
      address: '456 Healthcare Blvd',
      lat: lat - 0.015,
      lng: lng + 0.02,
      phone: '(555) 234-5678',
      rating: 4.5
    },
    {
      id: '3',
      name: 'Fire Station 12',
      type: 'fire',
      distance: formatDistance(calculateDistance(lat, lng, lat + 0.008, lng - 0.012)),
      address: '789 Fire House Ave',
      lat: lat + 0.008,
      lng: lng - 0.012,
      phone: '(555) 987-6543',
      rating: 4.8
    },
    {
      id: '4',
      name: 'Central Fire Department',
      type: 'fire',
      distance: formatDistance(calculateDistance(lat, lng, lat - 0.02, lng - 0.01)),
      address: '321 Emergency Way',
      lat: lat - 0.02,
      lng: lng - 0.01,
      phone: '(555) 876-5432',
      rating: 4.6
    },
    {
      id: '5',
      name: 'Police Precinct 15',
      type: 'police',
      distance: formatDistance(calculateDistance(lat, lng, lat - 0.005, lng + 0.015)),
      address: '654 Safety Blvd',
      lat: lat - 0.005,
      lng: lng + 0.015,
      phone: '(555) 456-7890',
      rating: 4.0
    },
    {
      id: '6',
      name: 'Metro Police Station',
      type: 'police',
      distance: formatDistance(calculateDistance(lat, lng, lat + 0.018, lng - 0.008)),
      address: '987 Law Enforcement St',
      lat: lat + 0.018,
      lng: lng - 0.008,
      phone: '(555) 345-6789',
      rating: 4.3
    },
    {
      id: '7',
      name: 'QuickCare Urgent Center',
      type: 'urgent_care',
      distance: formatDistance(calculateDistance(lat, lng, lat + 0.012, lng + 0.008)),
      address: '147 Health St',
      lat: lat + 0.012,
      lng: lng + 0.008,
      phone: '(555) 321-0987',
      rating: 4.4
    },
    {
      id: '8',
      name: 'Immediate Care Clinic',
      type: 'urgent_care',
      distance: formatDistance(calculateDistance(lat, lng, lat - 0.008, lng - 0.018)),
      address: '258 Wellness Ave',
      lat: lat - 0.008,
      lng: lng - 0.018,
      phone: '(555) 210-9876',
      rating: 4.1
    }
  ]

  // Sort by distance (closest first)
  return mockServices.sort((a, b) => {
    const distA = calculateDistance(lat, lng, a.lat, a.lng)
    const distB = calculateDistance(lat, lng, b.lat, b.lng)
    return distA - distB
  })
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, radius }: EmergencyServiceRequest = await request.json()
    
    if (!lat || !lng) {
      return NextResponse.json({
        error: 'Latitude and longitude are required'
      }, { status: 400 })
    }

    // Generate mock services based on location
    const allServices = generateMockServices(lat, lng)

    // Sort by distance and limit results
    const sortedServices = allServices.slice(0, 20)

    return NextResponse.json({
      services: sortedServices,
      userLocation: { lat, lng },
      totalFound: sortedServices.length
    })

  } catch (error) {
    console.error('Emergency services API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      services: []
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Emergency Services API is running',
    supportedTypes: ['hospital', 'police', 'fire', 'urgent_care'],
    maxRadius: 10000,
    note: 'POST with lat, lng, and radius to get nearby emergency services'
  })
}