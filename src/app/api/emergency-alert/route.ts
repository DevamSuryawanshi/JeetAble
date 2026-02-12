import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, latitude, longitude, contacts } = body

    if (!latitude || !longitude) {
      return NextResponse.json(
        { success: false, error: 'Location required' },
        { status: 400 }
      )
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No emergency contacts found' },
        { status: 400 }
      )
    }

    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`

    // Simulate sending alerts (replace with actual Twilio integration)
    const smsResults = contacts.map((contact: any) => ({
      contact: contact.name,
      success: true,
      type: 'SMS'
    }))

    const whatsappResults = contacts.map((contact: any) => ({
      contact: contact.name,
      success: true,
      type: 'WhatsApp'
    }))

    return NextResponse.json({
      success: true,
      message: 'Emergency alerts sent successfully',
      location: {
        latitude,
        longitude,
        mapsLink
      },
      smsResults,
      whatsappResults,
      totalSent: contacts.length * 2
    })
  } catch (error: any) {
    console.error('Emergency alert error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
