import { NextRequest, NextResponse } from 'next/server'

interface NearbyPlacesRequest {
  lat: number
  lng: number
  type: string
  radius?: number
}

interface Place {
  id: string
  name: string
  type: string
  distance: string
  address: string
  lat: number
  lng: number
  rating?: number
  phone?: string
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm.toFixed(1)} km`
}

async function fetchGooglePlaces(lat: number, lng: number, type: string, radius: number = 5000) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Maps API key not configured')
  }

  const typeMap: { [key: string]: string } = {
    'hospital': 'hospital',
    'police': 'police',
    'fire': 'fire_station',
    'clinic': 'doctor'
  }

  const placeType = typeMap[type] || type
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${placeType}&key=${apiKey}`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status}`)
  }

  return data.results.map((place: any) => ({
    id: place.place_id,
    name: place.name,
    type: type,
    distance: formatDistance(calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)),
    address: place.vicinity || place.formatted_address || 'Address not available',
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    rating: place.rating,
    phone: place.formatted_phone_number
  })).sort((a: Place, b: Place) => {
    const distA = calculateDistance(lat, lng, a.lat, a.lng)
    const distB = calculateDistance(lat, lng, b.lat, b.lng)
    return distA - distB
  })
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, type, radius = 5000 }: NearbyPlacesRequest = await request.json()
    
    if (!lat || !lng || !type) {
      return NextResponse.json({
        error: 'Latitude, longitude, and type are required'
      }, { status: 400 })
    }

    const places = await fetchGooglePlaces(lat, lng, type, radius)

    return NextResponse.json({
      places: places.slice(0, 15),
      userLocation: { lat, lng },
      totalFound: places.length,
      searchType: type
    })

  } catch (error) {
    console.error('Nearby places API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch nearby places',
      places: []
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Nearby Places API is running',
    supportedTypes: ['hospital', 'police', 'fire', 'clinic'],
    note: 'POST with lat, lng, and type to get nearby places'
  })
}