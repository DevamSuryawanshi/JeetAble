import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { StudyMaterial } from '@/models/StudyMaterial';

export async function POST(request: NextRequest) {
  try {
    const { title, description, fileUrl } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('studyMaterials');
    
    const newMaterial: Omit<StudyMaterial, '_id'> = {
      title,
      description,
      fileUrl,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(newMaterial);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add study material' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('studyMaterials');
    
    const materials = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch study materials' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('studyMaterials');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete study material' }, { status: 500 });
  }
}