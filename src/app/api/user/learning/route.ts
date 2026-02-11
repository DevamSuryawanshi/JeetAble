import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('learning');
    
    const materials = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    console.error('User learning API error:', error);
    return NextResponse.json({ error: 'Failed to fetch learning materials' }, { status: 500 });
  }
}