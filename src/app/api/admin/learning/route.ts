import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Learning } from '@/models/Learning';

export async function POST(request: NextRequest) {
  try {
    const { materialTitle, description, fileUrl, fileName } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('learning');
    
    const newMaterial: Omit<Learning, '_id'> = {
      materialTitle,
      description,
      fileUrl,
      fileName,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newMaterial);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Admin learning API error:', error);
    return NextResponse.json({ error: 'Failed to save learning material' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('learning');
    
    const materials = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    console.error('Get learning materials error:', error);
    return NextResponse.json({ error: 'Failed to fetch learning materials' }, { status: 500 });
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
    const collection = db.collection('learning');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete learning material error:', error);
    return NextResponse.json({ error: 'Failed to delete learning material' }, { status: 500 });
  }
}