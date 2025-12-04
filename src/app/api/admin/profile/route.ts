import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('adminProfile');
    
    const admin = await collection.findOne({ adminId });
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, admin });
    
  } catch (error) {
    console.error('Get admin profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { adminId, name, email, phone, department, role } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('adminProfile');
    
    const result = await collection.updateOne(
      { adminId },
      {
        $set: {
          name,
          email,
          phone,
          department,
          role,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Profile updated' });
    
  } catch (error) {
    console.error('Update admin profile error:', error);
    return NextResponse.json({ error: 'Failed to update admin profile' }, { status: 500 });
  }
}