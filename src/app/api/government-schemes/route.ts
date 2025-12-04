import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { GovernmentScheme } from '@/models/GovernmentScheme';

export async function POST(request: NextRequest) {
  try {
    const { schemeName, description, eligibility, applicationLink } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('governmentSchemes');
    
    const newScheme: Omit<GovernmentScheme, '_id'> = {
      schemeName,
      description,
      eligibility,
      applicationLink,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(newScheme);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add scheme' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('governmentSchemes');
    
    const schemes = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: schemes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('governmentSchemes');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete scheme' }, { status: 500 });
  }
}