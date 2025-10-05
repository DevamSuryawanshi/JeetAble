import { NextRequest, NextResponse } from 'next/server'

interface EmergencyServiceRequest {
  lat: number
  lng: number
  type: string
  radius: number
}

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

// Convert distance to km and format
function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm.toFixed(1)} km`
}

// Generate mock Indian emergency services data
function generateIndianServices(lat: number, lng: number, type: string): EmergencyService[] {
  const indianServices: { [key: string]: EmergencyService[] } = {
    hospital: [
      {
        id: '1',
        name: 'Ruby Hall Clinic',
        type: 'hospital',
        distance: '',
        address: 'Sassoon Road, Pune, Maharashtra',
        lat: lat + 0.01,
        lng: lng + 0.01,
        phone: '+91-20-6645-8888'
      },
      {
        id: '2',
        name: 'KEM Hospital',
        type: 'hospital',
        distance: '',
        address: 'Rasta Peth, Pune, Maharashtra',
        lat: lat - 0.015,
        lng: lng + 0.02,
        phone: '+91-20-2612-9801'
      },
      {
        id: '3',
        name: 'Sahyadri Hospital',
        type: 'hospital',
        distance: '',
        address: 'Karve Road, Pune, Maharashtra',
        lat: lat + 0.02,
        lng: lng - 0.01,
        phone: '+91-20-6799-6999'
      },
      {
        id: '4',
        name: 'Deenanath Mangeshkar Hospital',
        type: 'hospital',
        distance: '',
        address: 'Erandwane, Pune, Maharashtra',
        lat: lat - 0.008,
        lng: lng - 0.018,
        phone: '+91-20-2712-8888'
      }
    ],
    police: [
      {
        id: '5',
        name: 'Bund Garden Police Station',
        type: 'police',
        distance: '',
        address: 'Bund Garden Road, Pune, Maharashtra',
        lat: lat - 0.005,
        lng: lng + 0.015,
        phone: '+91-20-2613-2978'
      },
      {
        id: '6',
        name: 'Shivajinagar Police Station',
        type: 'police',
        distance: '',
        address: 'Shivajinagar, Pune, Maharashtra',
        lat: lat + 0.018,
        lng: lng - 0.008,
        phone: '+91-20-2553-4567'
      },
      {
        id: '7',
        name: 'Koregaon Park Police Station',
        type: 'police',
        distance: '',
        address: 'Koregaon Park, Pune, Maharashtra',
        lat: lat + 0.012,
        lng: lng + 0.022,
        phone: '+91-20-2615-8901'
      }
    ],
    fire: [
      {
        id: '8',
        name: 'Pune Fire Station - Shivajinagar',
        type: 'fire',
        distance: '',
        address: 'Shivajinagar, Pune, Maharashtra',
        lat: lat + 0.008,
        lng: lng - 0.012,
        phone: '+91-20-2553-2888'
      },
      {
        id: '9',
        name: 'Pune Fire Station - Camp',
        type: 'fire',
        distance: '',
        address: 'Camp Area, Pune, Maharashtra',
        lat: lat - 0.02,
        lng: lng - 0.01,
        phone: '+91-20-2634-5678'
      },
      {
        id: '10',
        name: 'Pune Fire Station - Kothrud',
        type: 'fire',
        distance: '',
        address: 'Kothrud, Pune, Maharashtra',
        lat: lat - 0.025,
        lng: lng - 0.035,
        phone: '+91-20-2542-9876'
      }
    ],
    clinic: [
      {
        id: '11',
        name: 'Apollo Clinic',
        type: 'clinic',
        distance: '',
        address: 'Baner Road, Pune, Maharashtra',
        lat: lat + 0.012,
        lng: lng + 0.008,
        phone: '+91-20-6730-1000'
      },
      {
        id: '12',
        name: 'Fortis Clinic',
        type: 'clinic',
        distance: '',
        address: 'Viman Nagar, Pune, Maharashtra',
        lat: lat + 0.025,
        lng: lng + 0.030,
        phone: '+91-20-6704-0000'
      },
      {
        id: '13',
        name: 'Max Healthcare Clinic',
        type: 'clinic',
        distance: '',
        address: 'Hadapsar, Pune, Maharashtra',
        lat: lat - 0.008,
        lng: lng - 0.018,
        phone: '+91-20-6745-5000'
      }
    ]
  }

  const services = indianServices[type] || []
  
  // Calculate distances and sort by proximity
  return services.map(service => ({
    ...service,
    distance: formatDistance(calculateDistance(lat, lng, service.lat, service.lng))
  })).sort((a, b) => {
    const distA = calculateDistance(lat, lng, a.lat, a.lng)
    const distB = calculateDistance(lat, lng, b.lat, b.lng)
    return distA - distB
  })
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, type, radius }: EmergencyServiceRequest = await request.json()
    
    if (!lat || !lng || !type) {
      return NextResponse.json({
        error: 'Latitude, longitude, and type are required'
      }, { status: 400 })
    }

    // Generate Indian emergency services based on location and type
    const services = generateIndianServices(lat, lng, type)

    return NextResponse.json({
      services: services.slice(0, 10), // Limit to 10 results
      userLocation: { lat, lng },
      totalFound: services.length,
      serviceType: type
    })

  } catch (error) {
    console.error('Indian emergency services API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      services: []
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Indian Emergency Services API is running',
    supportedTypes: ['hospital', 'police', 'fire', 'clinic'],
    emergencyNumbers: {
      ambulance: '108',
      police: '100',
      fire: '101',
      womensHelpline: '1091',
      childHelpline: '1098'
    },
    note: 'POST with lat, lng, type, and radius to get nearby Indian emergency services'
  })
}