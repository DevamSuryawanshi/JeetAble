import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessibility = searchParams.get('accessibility')

    let jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by accessibility features if provided
    if (accessibility) {
      const accessibilityFilters = accessibility.split(',')
      jobs = jobs.filter(job => 
        accessibilityFilters.some(filter => 
          job.accessibility.includes(filter)
        )
      )
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, company, location, type, accessibility, description, salary } = await request.json()

    // Validate input
    if (!title || !company || !location || !type || !description) {
      return NextResponse.json(
        { message: 'All job fields are required' },
        { status: 400 }
      )
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        accessibility: accessibility || [],
        description,
        salary: salary || 'Not specified'
      }
    })

    return NextResponse.json(
      { 
        message: 'Job created successfully',
        job
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}