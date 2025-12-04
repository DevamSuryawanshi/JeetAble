import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { EmergencyService } from '@/models/EmergencyService';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergencyServices');
    
    const newService: Omit<EmergencyService, '_id'> = {
      name,
      phone,
      email,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(newService);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add emergency service' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergencyServices');
    
    const services = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch emergency services' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergencyServices');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete emergency service' }, { status: 500 });
  }
}