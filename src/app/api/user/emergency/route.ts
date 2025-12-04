import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('emergency');
    
    const contacts = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('User emergency API error:', error);
    return NextResponse.json({ error: 'Failed to fetch emergency contacts' }, { status: 500 });
  }
}