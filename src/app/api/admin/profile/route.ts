import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('admins');
    
    const { ObjectId } = require('mongodb');
    const admin = await collection.findOne({ _id: new ObjectId(decoded.adminId) });
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    
    // Return admin data without password
    const { password, ...adminData } = admin;
    return NextResponse.json({ success: true, admin: adminData });
    
  } catch (error) {
    console.error('Get admin profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { name, phone } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('admins');
    
    const { ObjectId } = require('mongodb');
    const result = await collection.updateOne(
      { _id: new ObjectId(decoded.adminId) },
      {
        $set: {
          name,
          phone,
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