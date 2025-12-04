import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Emergency } from '@/models/Emergency';

export async function POST(request: NextRequest) {
  try {
    const { contactName, phoneNumber, emailAddress } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergency');
    
    const newEmergency: Omit<Emergency, '_id'> = {
      contactName,
      phoneNumber,
      emailAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newEmergency);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Admin emergency API error:', error);
    return NextResponse.json({ error: 'Failed to save emergency contact' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergency');
    
    const contacts = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    return NextResponse.json({ error: 'Failed to fetch emergency contacts' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergency');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    return NextResponse.json({ error: 'Failed to delete emergency contact' }, { status: 500 });
  }
}