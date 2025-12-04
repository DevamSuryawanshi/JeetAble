import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { AdminProfile } from '@/models/Admin';

export async function POST(request: NextRequest) {
  try {
    const { adminId, name, email, phone, department, role } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('adminProfile');
    
    // Check if admin already exists
    const existingAdmin = await collection.findOne({ adminId });
    
    if (existingAdmin) {
      // Update last login
      await collection.updateOne(
        { adminId },
        { 
          $set: { 
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );
      return NextResponse.json({ success: true, admin: existingAdmin });
    }
    
    // Create new admin profile
    const newAdmin: AdminProfile = {
      adminId,
      name,
      email,
      phone,
      department,
      role,
      joinDate: new Date(),
      permissions: ['emergency', 'learning', 'schemes', 'jobs'],
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newAdmin);
    
    return NextResponse.json({ 
      success: true, 
      admin: { ...newAdmin, _id: result.insertedId }
    });
    
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Failed to authenticate admin' }, { status: 500 });
  }
}