import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { type, message, userId } = await request.json()

    // Validate input
    if (!type || !message) {
      return NextResponse.json(
        { message: 'Type and message are required' },
        { status: 400 }
      )
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        type,
        message,
        userId: userId || null
      }
    })

    return NextResponse.json(
      { 
        message: 'Feedback submitted successfully',
        feedback
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error('Get feedback error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}