import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { NewsModel } from '@/models/NewsModel';

export async function POST(request: NextRequest) {
  try {
    const { title, description, link } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('news');
    
    const newNews: Omit<NewsModel, '_id'> = {
      title,
      description,
      link,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(newNews);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add news' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('news');
    
    const news = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('news');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}