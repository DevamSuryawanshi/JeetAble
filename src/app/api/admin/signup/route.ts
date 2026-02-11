import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { AdminAuth } from '@/models/AdminAuth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await collection.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const newAdmin: Omit<AdminAuth, '_id'> = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    };

    const result = await collection.insertOne(newAdmin);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin registered successfully',
      adminId: result.insertedId 
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}