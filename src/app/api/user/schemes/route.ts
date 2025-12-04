import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('schemes');
    
    const schemes = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: schemes });
  } catch (error) {
    console.error('User schemes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}