import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const jobs = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('User jobs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}