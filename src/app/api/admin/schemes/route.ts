import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Scheme } from '@/models/Scheme';

export async function POST(request: NextRequest) {
  try {
    const { schemeName, schemeDescription, eligibilityCriteria, applicationLink } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('schemes');
    
    const newScheme: Omit<Scheme, '_id'> = {
      schemeName,
      schemeDescription,
      eligibilityCriteria,
      applicationLink,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newScheme);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: 'Failed to save scheme' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('schemes');
    
    const schemes = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: schemes });
  } catch (error) {
    console.error('Get schemes error:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
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
    const collection = db.collection('schemes');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete scheme error:', error);
    return NextResponse.json({ error: 'Failed to delete scheme' }, { status: 500 });
  }
}