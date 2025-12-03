import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { schemeName, schemeDescription, eligibilityCriteria, applicationLink } = await request.json();
    
    console.log('Received scheme data:', { schemeName, schemeDescription, eligibilityCriteria, applicationLink });
    
    // For now, just return success to test
    return NextResponse.json({ success: true, message: 'Scheme received' });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: 'Failed to save scheme' }, { status: 500 });
  }
}