import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, contacts } = body

    if (!contacts || !Array.isArray(contacts)) {
      return NextResponse.json(
        { success: false, error: 'Contacts array required' },
        { status: 400 }
      )
    }

    if (contacts.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 contacts allowed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contacts,
      message: 'Emergency contacts saved successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
